import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import UserRepo from '../partials/Repo';
import Wrapper from '../Wrapper';
import PublishModal from '../partials/PublishModal';
import {
  fetchUserRepos,
  fetchUserGithubRepos,
  publishRepo,
  resetNotifications,
  unpublishRepo,
} from '../../actions';
import Spinner from '../partials/Spinner';
import { UserRef, RepoRef } from '../../interface';

import './Profile.css';

import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

type ProfileProps = {
  fetchUserRepos: (userId: number, props: any) => any;
  fetchUserGithubRepos: (userName: string, repoName: string) => any;
  user: UserRef;
  publishRepo: (repo: RepoRef) => any;
  unpublishRepo: (repoName: string, repoId: number) => any;
  resetNotifications: () => void;
  userPublishedRepos: any;
  userGithubRepos: any;
  successMessage: any;
  errors: any;
  history: any;
};

type ProfileState = {
  intialLoad: boolean;
  showModal: boolean;
};

type Notification = {
  current: any;
};

class Profile extends React.Component<ProfileProps, ProfileState> {
  private notificationDOMRef: Notification = React.createRef();

  state = {
    intialLoad: true,
    showModal: false,
  };

  componentDidMount() {
    this.reloadRepos();
  }

  reloadRepos = () =>
    this.props.fetchUserRepos(this.props.user.id, {
      push: this.props.history.push,
    });

  findRepos = (search: string) => {
    this.setState({ intialLoad: false });
    this.props.fetchUserGithubRepos(this.props.user.login, search);
  };

  updateRepoStatus = (repo: RepoRef, status: boolean) => {
    const {
      user: { id },
    } = this.props;

    status
      ? this.props.publishRepo({ ...repo, userId: id })
      : this.props.unpublishRepo(repo.name, repo._id);
  };

  showToaster = ({ repo, msg }: { repo: RepoRef; msg: any }) => {
    this.notificationDOMRef.current.addNotification({
      title: repo,
      message: msg,
      type: 'success',
      insert: 'top',
      container: 'top-right',
      animationIn: ['animated', 'fadeIn'],
      animationOut: ['animated', 'fadeOut'],
      dismiss: { duration: 2000 },
      dismissable: { click: true },
    });
  };

  userUserReposIdsIfAlreadyPublished = (
    userPublishedRepos: RepoRef[],
    userGithubRepos: RepoRef[]
  ) => {
    if (userGithubRepos.length === 0) {
      return userGithubRepos;
    }

    return userGithubRepos.filter((repo: RepoRef) => {
      const publishedRepo: any = userPublishedRepos.find(
        (publihsedRepo: RepoRef) => publihsedRepo.github_id === repo.github_id
      );

      return publishedRepo === undefined;
    });
  };

  handlePopupClose = () => {
    this.setState({ showModal: false, intialLoad: true });
    this.reloadRepos();
  };

  handlePopupOpen = () => {
    this.props.resetNotifications();
    this.setState({ showModal: true });
  };

  render() {
    const {
      user,
      userPublishedRepos,
      successMessage,
      userGithubRepos,
    } = this.props;

    if (!!Object.keys(successMessage).length) {
      this.showToaster(successMessage);
    }

    const updatedUserGitHubRepos = this.state.intialLoad
      ? []
      : this.userUserReposIdsIfAlreadyPublished(
          userPublishedRepos.userPublishedRepos,
          userGithubRepos.repos
        );

    return (
      <Wrapper>
        <Header />
        <PublishModal
          show={this.state.showModal}
          handleClose={this.handlePopupClose}
          findRepos={this.findRepos}
          userGithubRepos={{
            ...userGithubRepos,
            repos: updatedUserGitHubRepos,
          }}
          updateRepoStatus={this.updateRepoStatus}
          intialLoad={this.state.intialLoad}
        />
        <div className="page-wrap">
          <ReactNotification ref={this.notificationDOMRef} />
        </div>
        <div
          style={{ minHeight: '400px' }}
          className="container bootstrap snippet mt-5"
        >
          <div className="row">
            <div className="col-sm-3">
              <div className="text-left">
                <div className="user-profile">
                  <img
                    src={user.avatar_url}
                    className="avatar rounded-circle img-thumbnail"
                    alt="avatar"
                  />
                </div>
                <div className="user-name-main">
                  <h2 className="user-name">{user.name}</h2>
                </div>
                <div>
                  <h4 className="user-bio">{user.bio || 'N/A'}</h4>
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
              </ul>

              <div className="tab-content">
                <div
                  role="tabpanel"
                  className="tab-pane in active"
                  id="repositories"
                >
                  <div className="container">
                    <br />
                    <div className="row">
                      <div className="col-12 col-md-12 col-lg-12 no-padding">
                        <div className="repo-container-header">
                          <b>
                            {userPublishedRepos.userPublishedRepos.length}{' '}
                            Records
                          </b>
                          <div className="action-buttons">
                            <button
                              onClick={this.handlePopupOpen}
                              className="btn btn-sm publish-btn-small"
                            >
                              <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fab"
                                data-icon="github"
                                className="svg-inline--fa fa-github fa-w-16"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 496 512"
                              >
                                <path
                                  fill="currentColor"
                                  d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                                ></path>
                              </svg>
                              Publish
                            </button>
                            <button
                              onClick={this.reloadRepos}
                              className="btn btn-sm publish-btn-small refresh-repo-button"
                              disabled={userPublishedRepos.loading}
                            >
                              <svg
                                width="13"
                                height="12"
                                viewBox="0 0 13 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={classnames({
                                  'rotate-svg': userPublishedRepos.loading,
                                })}
                              >
                                <g opacity="0.5">
                                  <path
                                    d="M12 1.49881V4.49881H9"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>
                                  <path
                                    d="M1 10.4988V7.49881H4"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>
                                  <path
                                    d="M2.255 3.99882C2.50859 3.28221 2.93957 2.64152 3.50774 2.13653C4.07591 1.63153 4.76274 1.2787 5.50415 1.11095C6.24556 0.943193 7.01739 0.965988 7.74761 1.1772C8.47782 1.38842 9.14264 1.78118 9.68001 2.31882L12 4.49882M1 7.49883L3.32 9.67883C3.85738 10.2165 4.52219 10.6092 5.25241 10.8204C5.98263 11.0317 6.75446 11.0545 7.49587 10.8867C8.23728 10.7189 8.92411 10.3661 9.49228 9.86112C10.0604 9.35613 10.4914 8.71543 10.745 7.99883"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>
                                </g>
                              </svg>
                              Update
                            </button>
                          </div>
                        </div>
                        <div className="repo-container">
                          <form>
                            <ul className="list-group" id="repos">
                              <li className="list-group-item">
                                <div className="row">
                                  <div className="col-1">
                                    <i className="fa fa-book" />
                                    <b>Sr.</b>
                                  </div>
                                  <div className="col-3">
                                    <b>Name</b>
                                  </div>
                                  <div className="col-6">
                                    <b>Description</b>
                                  </div>
                                  <div className="col-2 align-center-horz">
                                    <b>Action</b>
                                  </div>
                                </div>
                              </li>
                              {userPublishedRepos.userPublishedRepos.length >
                              0 ? (
                                userPublishedRepos.userPublishedRepos.map(
                                  (repo: RepoRef, index: number) => (
                                    <UserRepo
                                      updateRepoStatus={this.updateRepoStatus}
                                      repo={repo}
                                      key={repo.id}
                                      isChecked={repo.isChecked}
                                      index={index + 1}
                                    />
                                  )
                                )
                              ) : (
                                <div className="no-repo-message">
                                  No Repos Published
                                </div>
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
        <Footer />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state: any) => ({
  userPublishedRepos: state.repos, // published on platform
  userGithubRepos: state.userGitHubRepos, // fetched from github
  successMessage: state.userGitHubRepos.successMessage,
});

export default connect(mapStateToProps, {
  fetchUserRepos,
  fetchUserGithubRepos,
  publishRepo,
  unpublishRepo,
  resetNotifications,
})(Profile);
