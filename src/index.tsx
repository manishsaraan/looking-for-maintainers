import React, { lazy, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import App from './App';
import store from './store';
import GithubLogin from './GithubLogin';
import GA from './ga';
import { gaKey } from './config';
import { UserRef } from './interface';
import { Provider as AuthProvider } from './context/authContext';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/global.css';
import './all.css';

const Explore = lazy(() => import('./components/Explore'));
const Profile = lazy(() => import('./components/Profile'));

const history = createBrowserHistory();

GA.init(gaKey);

GA.pageView(window.location.pathname + window.location.search);

history.listen((location: any) => {
  GA.pageView(location.pathname);
});

type PrivateRouteType = (component: any, path: string) => any;

const isAuthenticated = () => {
  let data: string | null = localStorage.getItem('user');

  return data ? JSON.parse(data) : null;
};

const PrivateRoute: PrivateRouteType = ({ component: Component, path }) => {
  const userInfo = isAuthenticated();
  const isAuth = Boolean(userInfo);
  console.log(isAuth);

  return (
    <Route
      render={(props) =>
        isAuth ? (
          <Component user={userInfo} {...props} />
        ) : (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )
      }
    />
  );
};

const Routes = () => {
  const [user, updateUser] = React.useState(null);

  useEffect(() => {
    updateUser(isAuthenticated());
  }, []);

  return (
    <Provider store={store}>
      <Router history={history}>
        <React.Suspense fallback={() => <div>Loading...</div>}>
          <AuthProvider value={user}>
            <Switch>
              <Route path="/" exact component={App} />
              <Route path="/login/github/return" component={GithubLogin} />
              <Route
                path="/explore"
                component={(props: any) => <Explore {...props} />}
              />
              <PrivateRoute path="/profile" component={Profile} />
            </Switch>
          </AuthProvider>
        </React.Suspense>
      </Router>
    </Provider>
  );
};

ReactDOM.render(<Routes />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
