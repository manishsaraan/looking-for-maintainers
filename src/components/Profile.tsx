import React from "react";
import { connect } from "react-redux";
import Header from "./partials/Header";
import UserRepo from "./partials/UserRepo";
import {
  fetchUserRepos,
  fetchUserGithubRepos,
  publishRepo,
  unpublishRepo
} from "../actions/index";
import Spinner from "./partials/Spinner";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

type ProfileProps = {
  fetchUserRepos: any,
  fetchUserGithubRepos: any,
  user: any,
  publishRepo: any,
  unpublishRepo: any,
  userPublishedRepos: any,
  userGithubRepos: any,
  successMessage: any
}

type ProfileState = {
  search: string
}

type Notification = {
  current: any
}

class Profile extends React.Component<ProfileProps, ProfileState> {
  private notificationDOMRef: Notification;

  constructor(props: any) {
    super(props);
    this.notificationDOMRef = React.createRef();
    this.state = {
      search: ""
    };
  }

  componentDidMount() {
    this.props.fetchUserRepos(this.props.user.id);
  }

  onChange = (event: any) => {
    this.setState({
      search: event.target.value
    });
  };

  findRepos = (event: any) => {
    event.preventDefault();
    const { search } = this.state;
    this.props.fetchUserGithubRepos(this.props.user.login, search);
  };

  updateRepoStatus = (repo: any, status: any) => {
    const { user: { id } } = this.props;

    status
      ? this.props.publishRepo({ ...repo, userId: id })
      : this.props.unpublishRepo(repo.name, repo._id);
  };

  showToaster = ({ repo, msg }: { repo: any, msg: any }) => {
    this.notificationDOMRef.current.addNotification({
      title: repo,
      message: msg,
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    });
  };

  render() {
    const {
      user,
      userPublishedRepos,
      userGithubRepos,
      successMessage
    } = this.props;
    let showRepos = [...userPublishedRepos];

    if (!!userGithubRepos.length) {
      showRepos = [...userGithubRepos];
    }

    if (!!Object.keys(successMessage).length) {
      this.showToaster(successMessage);
    }

    console.log("----------this.props, proifile", this.props)
    return (
      <div>
        <div className="page-wrap">
          <ReactNotification ref={this.notificationDOMRef} />
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
                                    isChecked={repo.isChecked}
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

const mapStateToProps = (state: any) => ({
  userPublishedRepos: state.userPublishedRepos,
  userGithubRepos: state.userGithubRepos,
  successMessage: state.successMessage
});

export default connect(
  mapStateToProps,
  {
    fetchUserRepos,
    fetchUserGithubRepos,
    publishRepo,
    unpublishRepo
  }
)(Profile);
