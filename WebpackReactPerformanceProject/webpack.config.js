var webpack = require('webpack');
var path = require('path');
var HtmlWebPackPlugin = require('html-webpack-plugin');

//если мы забудем добавить какуе-то библиотеку, то она будет все-равно обработана webPack-ом
//только он ее добавит не в vendor.js а в bundle.js
const VENDOR_LIBS = [
  'faker', 'lodash', 'react', 'react-dom', 'react-input-range', 'react-redux', 'react-router', 'redux', 'redux-form', 'redux-thunk'
];

module.exports = {
  entry: {
    bundle: './src/index.js',
    vendor: VENDOR_LIBS
  },
  output: {
    path: path.join(__dirname, 'dist'),
    //[name] это ключ который будет заменен на имена свойств указанных в entry объекте
    //то есть webPack сначала создаст bundle.js п потом vendor.js
    //если я просто оставлю filename:'bundle.js' то webPack вернет ошибку, говорящую о колизии имен
    //всякий раз, когда js-файлы обновляются, webPack задает новый хеш
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        //данный сетинг говорит, что не нужно использовать babel для node_module папки
        exclude: /node_modules/
      },
      {
        use: ['style-loader', 'css-loader'],
        test: /\.css$/
      }
    ]
  },
  plugins: [
    //данный плагин нужен для CodeSplitting. Если не задать данный плагин, то webPack все-также создаст bundle.js со всем 3rd party кодом
    //только он еще создаст vendor.js с тем же 3rd party кодом. Данный плагин говорит webPack-у:
    //смотри на файлы нашего приложения, указанные в объекте entry: bundle.js и vendor.js и если у этих файлов есть модули, которые дублируются, то взять данные модули и поместить их только в vendor entry point 
    //мы добавили 'manifest' настройку, чтобы при изменении нашего кода, веб пак при билде не менял хеш для имени vendor файл.
    //Если оставить просто name:'vendor' то при изменении нашего кода, веб пак при билде изменит хеш для bundle.js и для vendor.js 
    //Данный манифест также подключается в index.html файле и дает понять браузеру, изменился ли vendor.js файл или нет.
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    //для всех js файлов которые были сгенерены webPack-ом, нужно добавить script тег в наш index.html файл
    //при этом веб пак не трогает index.html файл, что мы указали в template свойстве. Он берет данный html файл, копирует его в dist папку и добавляет ему script теги 
    //также данный плагин решает проблему с добавлением имен с хешами js файлов, так как при построении нового bundle мы задаем ему новый хещь, данный плагин берет актуальное имя и задает его в теге script
    new HtmlWebPackPlugin({
      template: 'src/index.html'
    })
  ]
};
