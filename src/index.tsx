import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createBrowserHistory } from 'history';
import {
  Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import App from "./App";
import Explore from "./components/Explore/index";
import Profile from "./components/Profile";
import store from "./store/index";
import GithubLogin from "./GithubLogin";
import GA from './ga';
import { gaKey } from './config';
import * as serviceWorker from "./serviceWorker";
import "./assets/css/global.css";

const history = createBrowserHistory();

GA.init(gaKey);

GA.pageView("/");

history.listen((location: any) => {
  GA.pageView(location.pathname);
});

let data = localStorage.getItem("user");
let authed = false;

if (data) {
  authed = true;
  data = JSON.parse(data);
}

function PrivateRoute({ component: Component, authed, path }: { component: any, authed: any, path: string }) {
  return (
    <Route
      render={props =>
        authed ? (
          <Component path={path} user={data} {...props} />
        ) : (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          )
      }
    />
  );
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route
          path="/"
          exact
          render={(props: any) => <App user={data} {...props} />}
        />
        <Route path="/login/github/return" component={GithubLogin} />
        <Route
          path="/explore"
          render={props => <Explore {...props} user={data} />}
        />
        <PrivateRoute authed={authed} path="/profile" component={Profile} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
