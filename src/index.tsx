import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import Explore from "./components/Explore";
import Profile from "./components/Profile";
import store from "./store/index";
import GithubLogin from "./GithubLogin";
import * as serviceWorker from "./serviceWorker";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/global.css";

let data = localStorage.getItem("user");
let authed = false;

if (data) {
  authed = true;
  data = JSON.parse(data);
}

function PrivateRoute(input: any) {
  return (
    <Route
      {...input}
      render={props =>
        authed === true ? (
          <input.component user={data} {...props} />
        ) : (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          )
      }
    />
  );
}

ReactDOM.render(
  <Provider store={store}>
    <Router>
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
