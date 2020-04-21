import React, { lazy } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import App from "./App";
import store from "./store";
import GithubLogin from "./GithubLogin";
import GA from "./ga";
import { gaKey } from "./config";
import { UserRef } from "./interface";
import * as serviceWorker from "./serviceWorker";
import "./assets/css/global.css";

const Explore = lazy(() => import("./components/Explore"));
const Profile = lazy(() => import("./components/Profile"));

const history = createBrowserHistory();

GA.init(gaKey);

GA.pageView(window.location.pathname + window.location.search);

history.listen((location: any) => {
  GA.pageView(location.pathname);
});

let data: string | null = localStorage.getItem("user");
let authed: boolean = false;
let userData: UserRef;

if (data) {
  authed = true;
  userData = JSON.parse(data);
}

function PrivateRoute({
  component: Component,
  authed,
  path,
}: {
  component: any;
  authed: boolean;
  path: string;
}) {
  return (
    <Route
      render={(props) =>
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
      <React.Suspense fallback={() => <div>Loading...</div>}>
        <Switch>
          <Route
            path="/"
            exact
            render={(props: any) => <App user={userData} {...props} />}
          />
          <Route path="/login/github/return" component={GithubLogin} />
          <Route
            path="/explore"
            render={(props) => <Explore {...props} user={userData} />}
          />
          <PrivateRoute authed={authed} path="/profile" component={Profile} />
        </Switch>
      </React.Suspense>
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
