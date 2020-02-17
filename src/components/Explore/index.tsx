import React from "react";
import { connect } from "react-redux";
import { getRepos } from "../../actions/index";
import { Link } from 'react-router-dom';
import RepoContainer from "../partials/RepoContainer";
import './style.css';

type ExploreProps = {
  user: any,
  getRepos: any
  repos: any
}

class Explore extends React.Component<ExploreProps> {
  componentDidMount() {
    this.props.getRepos();
  }

  renderRepos = (repos: any) => {
    if (repos.length === 0) {
      return (<p className="biggest flex-item-center h2-like txtcenter">No Project Found</p>)
    }

    return repos.map((repo: any) => (<RepoContainer repo={repo} key={repo.id} />))
  }

  render() {
    console.log(this.props);
    const { user, repos } = this.props;
    return (
      <div>
        <div className="page-wrap">
          <section className="menu-section ">
            <div className="menu-section-container">
              <span className="biggest flex-item-center txtcenter">
                <Link className="homepage-link" to="/">Looking For Maintainers</Link>
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

export default connect(
  mapStateToProps,
  { getRepos }
)(Explore);
