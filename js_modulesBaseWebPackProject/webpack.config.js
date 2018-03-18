const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        //данное свойсво используется всеми loaders, которые предоставляют ссылки на файлы
        publicPath: 'build/'
    },
    //Preprocessing actions (Module Loaders)
    module: {
        //задаем правила, что будут выполнятся перед процесингом
        rules: [
            {
                //выполнить babel-loader перед процесингом
                use: 'babel-loader',
                //regular expression который указывает babel что нужно обработать файлы равные *.js
                test: /\.js$/
            },
            {
                //порядок важен, так как лоадеры работают в порядке справа на лево
                //тоесть сначала выполнится css-loader а потом style-loader
                //данные настройки берут весь симпорченный css код добавляют в bundle.js (это делает css-loader)
                //а потом style-loader добавляет его на html страницу в style tag
                //use: ['style-loader', 'css-loader'],

                //для webpack свойства use и loader имеют одинаковые значения но если мы используем переменную а не текст
                //то лучше использовать loader
                loader: ExtractTextPlugin.extract({
                    loader: 'css-loader'
                }),
                test: /\.css$/
            },
            {
                // jpe?g = jpeg or jpg
                test: /\.(jpe?g|png|gif|svg)$/,
                use: [
                    {
                        //задача данного loader найти все import image по регулярому выражению
                        //и скопировать в наш build folder (либо в bundle.js как raw text).
                        //после этого url-loader возвращается к import директории где она встретила импорт данной картинки
                        //и асайнет имя новой картинки для import (например: import big from '../assets/big.jpg')
                        loader: 'url-loader',
                        //проверяет если картинка больше 40 кбайт, то сохраняем ее в отдельный файл
                        //иначе добавляем ее как raw текст в bundle.js
                        options: { limit: 40000 }
                    },
                    'image-webpack-loader'
                ]
            }
        ]
    },
    plugins: [
        //данная настройка говорит extract text library, что нужно найти файлы, которые были трансформированы
        //лоадером выше. Тоесть все то что будет сделано лоадером будет сохраненно в файле style.css.
        //Тоесть весь css код из всех файлов, что заимпорчены в нашем приложении, будет размещен в style.css
        //Подход состоящий из разделения файлов лучше, так как браузер использует мультипоточность для загрузки нескольких файлов одновременно.
        //Соответственно разделив css код от bundle.js и пометив css код в style.css является более производительным и удобным подходом
        new ExtractTextPlugin('style.css')
    ]
};

module.exports = config;