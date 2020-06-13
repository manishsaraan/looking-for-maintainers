import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginUser } from './actions';
import { apiEndPoint } from './config';
import { History } from 'history';
import { UserRef } from './interface/user';
import './App.css';

type GithubLoginProps = {
  history: History;
  user: UserRef;
  location: any;
  loginUser: (code: string) => any;
  auth: any;
};

class GithubLogin extends Component<GithubLoginProps, {}> {
  componentDidMount() {
    const { search } = this.props.location;

    if (search) {
      const [, code] = search.split('=');
      this.props.loginUser(code);
    }
  }

  componentDidUpdate(oldProps: GithubLoginProps) {
    if (this.props.auth.user !== oldProps.auth.user) {
      this.props.history.push('/explore');
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">Loggin to github.....</header>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { loginUser })(GithubLogin);
