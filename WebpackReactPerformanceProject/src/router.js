import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Home from './components/Home';
import ArtistMain from './components/artists/ArtistMain';

//делаем codeSplitting наших роутов, чтобы при запуске приложения в bundle.js был код только hashHistory и Home компонента
//а все остальные подтягивались по ходу обращения к ним
//для этого нам нужно переписать jsx роуты в js plain объект и воспользоваться функцией getComponent которая асинхронно загрузит нужный нам компонент
//react Router запускает функцию getComponent автоматически 
const componentRoutes = {
  component: Home,
  path: '/',
  indexRoute: { component: ArtistMain },
  //getComponent в данном куске кода постоянно дублируется. Но мы не можем динамически как-то делать импорт, так как веб пак читает статический код и основываясь на эти import создает соответствующие бандлы 
  childRoutes: [
    {
      path: 'artists/new',
      //если мы хотим ассинхронно загружать наши компоненты, нам нужно использовать данную функцию
      //cb это callback функция, которая принимает в качестве первого парамента error object, а в качестве второго, код самого модуля, который вернется вызвав функцию default промис объекта
      getComponent(location, cb) {
        System.import('./components/artists/ArtistCreate')
          .then(module => cb(null, module.default));//первый аргумент это error объект. Предположим что можуль вернулся без ошибок и передадим туда просто null
      }
    },
    {
      path: 'artists/:id',
      getComponent(location, cb) {
        System.import('./components/artists/ArtistDetail')
          .then(module => cb(null, module.default));
      }
    },
    {
      path: 'artists/:id/edit',
      getComponent(location, cb) {
        System.import('./components/artists/ArtistEdit')
          .then(module => cb(null, module.default));
      }
    }
  ]
};

/*
данный объект равен следующему jsx:
     <Route path="/" component={Home}>
        <IndexRoute component={ArtistMain} />
        <Route path="artists/new" component={ArtistCreate} />
        <Route path="artists/:id" component={ArtistDetail} />
        <Route path="artists/:id/edit" component={ArtistEdit} />
      </Route>
*/

const Routes = () => {
  return (
    <Router history={hashHistory} routes={componentRoutes} />
  );
};

export default Routes;
