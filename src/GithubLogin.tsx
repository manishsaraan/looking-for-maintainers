import React, { Component } from "react";
import axios from "axios";
import { apiEndPoint } from "./config";
import { History } from 'history';
import { UserRef } from './interface/user';
import "./App.css";

type GithubLoginProps = {
  history: History,
  user: UserRef,
  location: any
}

class GithubLogin extends Component<GithubLoginProps, {}> {
  onSuccess = async (code: string) => {
    const { data, status } = await axios.get(
      `${apiEndPoint}/api/login/github/${code}`
    );
    if (status === 200) {
      localStorage.setItem("user", JSON.stringify(data));
      this.props.history.push("/");
    } else {
      alert("error occured");
    }
  };

  render() {
    const { search } = this.props.location;
    let user: UserRef;
    ({ user } = this.props);

    if (search) {
      const [, code] = search.split("=");
      this.onSuccess(code);
      console.log("-code-", code);
    }
    return (
      <div className="App">
        <header className="App-header">Loggin to github.....</header>
      </div>
    );
  }
}

export default GithubLogin;
