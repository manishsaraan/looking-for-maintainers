import React, { Component } from "react";
import { connect } from "react-redux";
import GithubLogin from "./lib";
import Form from "./Form";
import { getData } from "./actions/index";
import { clientId, redirectUri } from "./config/index";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

const mapStateToProps = state => {
  return { articles: state.remoteArticles.slice(0, 10) };
};

class App extends Component {
  componentDidMount() {
    this.props.getData();
  }
  logout = () => {
    localStorage.setItem("user", null);
    this.props.history.push("/");
  };

  render() {
    const { user, articles } = this.props;
    console.log("---user---", articles);

    return (
      <div className="App">
        {!!user && <button onClick={this.logout}>Logout</button>}
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <GithubLogin clientID={clientId} />
        </header>
        <Form />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  { getData }
)(App);
