import React from "react";
import { connect } from "react-redux";
import { getRepos } from "../../actions";
import { Link } from "react-router-dom";
import RepoContainer from "../partials/RepoContainer";
import { UserRef, RepoRef } from "../../interface";
import "./style.css";

type ExploreProps = {
  user: UserRef;
  getRepos: any;
  repos: RepoRef[];
};

class Explore extends React.Component<ExploreProps> {
  componentDidMount() {
    this.props.getRepos();
  }

  renderRepos = (repos: RepoRef[]) => {
    if (repos.length === 0) {
      return (
        <p className="biggest flex-item-center h2-like txtcenter">
          No Project Found
        </p>
      );
    }

    return repos.map((repo: RepoRef) => (
      <RepoContainer key={repo.id} repo={repo} />
    ));
  };

  render() {
    const { user, repos } = this.props;
    return (
      <div>
        <div className="page-wrap">
          <section className="menu-section ">
            <div className="menu-section-container">
              <span className="biggest flex-item-center txtcenter">
                <Link className="homepage-link" to="/">
                  Looking For Maintainers
                </Link>
              </span>
            </div>
          </section>
        </div>
        <div className="repositories-container">
          <div className="body-row">
            <div className="repositories-grid">
              <div className="grid-container grid-row">
                {this.renderRepos(repos)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return { repos: state.repos };
};

export default connect(mapStateToProps, { getRepos })(Explore);
