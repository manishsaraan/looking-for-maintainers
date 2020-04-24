import React, { Fragment } from "react";
import { connect } from "react-redux";
import { getRepos } from "../../actions";
import { Link } from "react-router-dom";
import RepoContainer from "../partials/RepoContainer";
import Spinner from "../partials/Spinner";
import { UserRef, RepoRef, projectsInitialStateType } from "../../interface";
import "./style.css";

type ExploreProps = {
  user: UserRef;
  getRepos: () => any;
  projects: RepoRef[];
  loading: boolean;
};

const ProjectsSpinner = () => (
  <Spinner>
    <span className="projects-spinner">Loading Projects</span>
  </Spinner>
);

class Explore extends React.Component<ExploreProps> {
  componentDidMount() {
    this.props.getRepos();
  }

  renderProjects = (projects: RepoRef[]) => {
    if (projects.length === 0) {
      return (
        <p className="biggest flex-item-center h2-like txtcenter">
          No Project Found
        </p>
      );
    }

    return projects.map((repo: RepoRef) => (
      <RepoContainer key={repo._id} repo={repo} />
    ));
  };

  render() {
    const { projects, loading } = this.props;
    console.log(projects);
    return (
      <Fragment>
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
                {loading ? <ProjectsSpinner /> : this.renderProjects(projects)}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  projects,
}: {
  projects: projectsInitialStateType;
}) => ({
  projects: projects.projects,
  loading: projects.loading,
});

export default connect(mapStateToProps, { getRepos })(Explore);
