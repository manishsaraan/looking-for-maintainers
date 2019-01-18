import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import Explore from "./components/explore";
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
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/global.css";

window.store = store;
window.addArticle = addArticle;
let data = localStorage.getItem("user");
let authed = false;
if (data) {
  authed = true;
  data = JSON.parse(data);
}

const Profile = () => <div>profile</div>;

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
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
          render={props => <App user={data} {...props} />}
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
