import React, { Component } from "react";
import GitHubLogin from "react-github-login";
import { clientId, redirectUri } from "./config/index";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

const onSuccess = async ({ code }) => {
  const user = await axios.get(`/login/github/${code}`);
  console.log(user);
};
const onFailure = response => console.error("-ss-", response);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and safsdfds
          </p>
          <GitHubLogin
            clientId={clientId}
            redirectUri={redirectUri}
            onSuccess={onSuccess}
            onFailure={onFailure}
          />
        </header>
      </div>
    );
  }
}

export default App;
