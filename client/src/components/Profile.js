import React from "react";
import { connect } from "react-redux";
import Header from "./partials/Header";
import UserRepo from "./partials/UserRepo";
import {
  fetchUserRepos,
  fetchUserGithubRepos,
  publishRepo
} from "../actions/index";
import Spinner from "./partials/Spinner";

class Profile extends React.Component {
  state = {
    search: ""
  };

  componentDidMount() {
    // this.props.fetchUserRepos(this.props.user.id);
  }

  onChange = event => {
    this.setState({
      search: event.target.value
    });
  };

  findRepos = event => {
    event.preventDefault();
    const { search } = this.state;
    this.props.fetchUserGithubRepos(this.props.user.login, search);
  };

  updateRepoStatus = repo => {
    this.props.publishRepo(this.props.user, repo);
  };

  render() {
    const { user, userPublishedRepos, userGithubRepos } = this.props;
    let showRepos = [...userPublishedRepos];
    if (userGithubRepos.items) {
      showRepos = [...userGithubRepos.items];
    }
    console.log("user", user, this.props);
    return (
      <div>
        <div className="page-wrap">
          <Header user={user} />
        </div>
        <div className="container bootstrap snippet mt-5">
          <div className="row">
            <div className="col-sm-3">
              <div className="text-left">
                <img
                  src={user.avatar_url}
                  className="avatar rounded-circle img-thumbnail"
                  alt="avatar"
                />
                <div>
                  <h2 className="text-left">{user.name}</h2>
                </div>
                <div>
                  <h4 className="text-left">{user.username}</h4>
                </div>
              </div>
              <br />
            </div>
            <div className="col-sm-9">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    href="#repositories"
                    role="tab"
                    data-toggle="tab"
                  >
                    Repositories
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#settings"
                    role="tab"
                    data-toggle="tab"
                  >
                    Settings
                  </a>
                </li>
              </ul>

              <div className="tab-content">
                <div
                  role="tabpanel"
                  className="tab-pane in active"
                  id="repositories"
                >
                  <div className="container">
                    <br />
                    <div className="row justify-content-center">
                      <div className="col-12 col-md-10 col-lg-8">
                        <form
                          className="card card-sm"
                          id="searchForm"
                          onSubmit={this.findRepos}
                        >
                          <div className="search-body row no-gutters align-items-center">
                            <div className="col-auto">
                              <i className="fa fa-search h4 text-body" />
                            </div>
                            <div className="col">
                              <input
                                className="form-control form-control-lg form-control-borderless"
                                id="search"
                                type="search"
                                placeholder="Search repositories"
                                onChange={this.onChange}
                              />
                            </div>
                            <div className="col-auto">
                              <button
                                className="btn btn-lg btn-success"
                                type="submit"
                              >
                                <Spinner />
                                <span>Search</span>
                              </button>
                            </div>
                          </div>
                        </form>
                        <div className="repo-container mt-3">
                          <form>
                            <ul className="list-group" id="repos">
                              {showRepos.length > 0 ? (
                                showRepos.map(repo => (
                                  <UserRepo
                                    updateRepoStatus={this.updateRepoStatus}
                                    repo={repo}
                                    key={repo.id}
                                  />
                                ))
                              ) : (
                                <div>No Repos Found</div>
                              )}
                            </ul>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div role="tabpanel" className="tab-pane fade" id="settings">
                  <h2>No Content</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userPublishedRepos: state.userPublishedRepos,
  userGithubRepos: state.userGithubRepos
});

export default connect(
  mapStateToProps,
  {
    fetchUserRepos,
    fetchUserGithubRepos,
    publishRepo
  }
)(Profile);
