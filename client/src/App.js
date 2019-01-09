import React, { Component } from "react";
import GitHubLogin from "react-github-login";
import logo from "./logo.svg";
import "./App.css";

const onSuccess = response => console.log(response);
const onFailure = response => console.error("--", response);

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
            clientId="b2464a59102ba2db9cb1"
            redirectUri="http://localhost:3000/login/github/return"
            onSuccess={onSuccess}
            onFailure={onFailure}
          />
        </header>
      </div>
    );
  }
}

export default App;
