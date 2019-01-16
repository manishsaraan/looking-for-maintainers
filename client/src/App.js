import React, { Component } from "react";
import GithubLogin from "./lib";
// import { clientId, redirectUri } from "./config/index";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  logout = () => {
    localStorage.setItem("user", null);
    this.props.history.push("/");
  };

  render() {
    const { search } = this.props.location;
    const { user } = this.props;
    console.log("---user---", user);

    return (
      <div className="App">
        {!!user && <button onClick={this.logout}>Logout</button>}
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <GithubLogin clientID="test" />
        </header>
      </div>
    );
  }
}

export default App;
