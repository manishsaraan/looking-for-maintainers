import React, { Component } from "react";
import GithubLogin from "./lib";
import { clientId } from "./config/index";
import "./App.css";

type AppProps = {
  history: any,
  user: any,
  articles: any
}

class App extends Component<AppProps> {
  logout = () => {
    localStorage.setItem("user", "");
    this.props.history.push("/");
  };

  render() {
    const { user, articles } = this.props;
    console.log("---user---", articles);

    return (
      <div className="App">
        {!!user && <button onClick={this.logout}>Logout</button>}
        <header className="App-header">
          <GithubLogin clientID={clientId} />
        </header>
      </div>
    );
  }
}

export default App;
