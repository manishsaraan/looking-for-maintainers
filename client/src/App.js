import React, { Component } from "react";
import GithubLogin from "./lib";
// import { clientId, redirectUri } from "./config/index";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

const onSuccess = async code => {
  const { data, status } = await axios.get(`/login/github/${code}`);
  if (status === 200) {
    console.log(data);
    localStorage.setItem("user", JSON.stringify(data));
  } else {
    alert("error occured");
  }
};
const logout = () => localStorage.setItem("user", null);

class App extends Component {
  render() {
    const { search } = this.props.location;
    if (search) {
      const [, code] = search.split("=");
      onSuccess(code);
      console.log("-code-", code);
    }
    return (
      <div className="App">
        <button onClick={logout}>Logout</button>
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <GithubLogin clientID="test" />
        </header>
      </div>
    );
  }
}

export default App;
