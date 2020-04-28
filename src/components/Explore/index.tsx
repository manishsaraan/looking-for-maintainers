import React, { Fragment } from "react";
import { connect } from "react-redux";
import { getRepos } from "../../actions";
import { Link } from "react-router-dom";
import RepoContainer from "../partials/RepoContainer";
import RepoList from "../partials/Repo-List";
import Spinner from "../partials/Spinner";
import Filters from "../partials/Filters";
import { UserRef, RepoRef, projectsInitialStateType } from "../../interface";
import "./style.css";

type ExploreProps = {
  user: UserRef;
  getRepos: () => any;
  projects: RepoRef[];
  loading: boolean;
};

class Explore extends React.Component<ExploreProps> {
  state = {
    showProject: "grid",
  };

  componentDidMount() {
    const { projects } = this.props;

    // Only load if there are no projects in store
    if (projects.length === 0) {
      this.props.getRepos();
    }
  }

  renderProjects = (showProject: string, projects: RepoRef[]) => {
    return projects.map((repo: RepoRef) => {
      return showProject === "grid" ? (
        <RepoContainer key={repo._id} repo={repo} />
      ) : (
        <RepoList key={repo._id} repo={repo} />
      );
    });
  };

  projectsSpinner = () => (
    <Spinner>
      <span className="projects-spinner">Loading Projects</span>
    </Spinner>
  );

  updateView = (viewType: string) => {
    this.setState({ showProject: viewType });
  };

  renderContent = (showProject: string, projects: RepoRef[]) => (
    <Fragment>
      <div className="filters">
        <Filters updateViewFn={this.updateView} />
      </div>
      <div className="repositories-grid">
        <div className={`grid-container grid-${showProject}`}>
          {this.renderProjects(showProject, projects)}
        </div>
      </div>
    </Fragment>
  );

  renderNoContent = () => (
    <p
      style={{ height: "100vh" }}
      className="biggest flex-item-center h2-like txtcenter"
    >
      No Project Found
    </p>
  );

  render() {
    const { projects, loading } = this.props;
    const { showProject } = this.state;
    const content =
      projects.length === 0
        ? this.renderNoContent()
        : this.renderContent(showProject, projects);

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
            {loading ? this.projectsSpinner() : content}
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
