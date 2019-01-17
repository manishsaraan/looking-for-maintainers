import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import store from "./store/index";
import { addArticle } from "./actions/index";
import GithubLogin from "./GithubLogin";
import * as serviceWorker from "./serviceWorker";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
window.store = store;
window.addArticle = addArticle;
let data = localStorage.getItem("user");
let authed = false;
if (data) {
  authed = true;
  data = JSON.parse(data);
}

const Login = () => <div>Lgin</div>;
const Profile = () => <div>profkel</div>;

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/" exact render={props => <App user={data} {...props} />} />
      <Route path="/login/github/return" component={GithubLogin} />
      <Route path="/login" component={Login} />
      <PrivateRoute authed={authed} path="/profile" component={Profile} />
    </Switch>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
