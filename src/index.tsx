import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Routes from './Routes';
import GA from './ga';
import { gaKey } from './config';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/global.css';
import './all.css';

const history = createBrowserHistory();

GA.init(gaKey);

GA.pageView(window.location.pathname + window.location.search);

history.listen((location: any) => {
  GA.pageView(location.pathname);
});

const App = () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Routes />
      </Router>
    </Provider>
  );
};
ReactDOM.render(<App />, document.body);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
