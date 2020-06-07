import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { getRepos } from '../../actions';
import { Link } from 'react-router-dom';
import RepoContainer from '../partials/RepoContainer';
import RepoList from '../partials/Repo-List';
import Spinner from '../partials/Spinner';
import Filters from '../partials/Filters';
import Footer from '../partials/Footer';
import Header from '../partials/Header';
import { UserRef, RepoRef, projectsInitialStateType } from '../../interface';
import './style.css';

type ExploreProps = {
  user: UserRef;
  getRepos: (lang?: string, page?: number) => any;
  projects: RepoRef[];
  loading: boolean;
  selectedLanguage: string;
  next: boolean;
};

class Explore extends React.Component<ExploreProps> {
  state = {
    showProject: 'grid',
    selectedLang: this.props.selectedLanguage,
    page: 1,
  };

  componentDidMount() {
    const { projects, selectedLanguage } = this.props;

    // Only load if there are no projects in store
    if (projects.length === 0 && !selectedLanguage) {
      this.props.getRepos();
    }

    // // Detect when scrolled to bottom.
    window.addEventListener('scroll', this.paginationOnScroll);
  }

  paginationOnScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      // you're at the bottom of the page
      console.log('at botom');
      const { page, selectedLang } = this.state;
      const nextPage = page + 1;
      const { loading } = this.props;

      if (!loading) {
        this.props.getRepos(selectedLang, nextPage);
        this.setState({ page: nextPage });
      }
    }
  };

  componentDidUpdate(prevProps: ExploreProps) {
    console.log(this.props.next);
    if (!this.props.next) {
      window.removeEventListener('scroll', this.paginationOnScroll);
    }
  }

  handleSelectedLanguage = (lang: string) => {
    //this.setState({ selectedLang: lang });
    this.props.getRepos(lang);
  };

  renderProjects = (showProject: string, projects: RepoRef[]) => {
    return projects.map((repo: RepoRef) => {
      return showProject === 'grid' ? (
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
    <div className="repositories-grid">
      <div className={`grid-container grid-${showProject}`}>
        {this.renderProjects(showProject, projects)}
      </div>
    </div>
  );

  renderNoContent = () => (
    <p
      style={{ height: '100vh' }}
      className="biggest flex-item-center h2-like txtcenter"
    >
      No Project Found
    </p>
  );

  render() {
    const { projects, loading, selectedLanguage } = this.props;
    const { showProject } = this.state;
    let content: any;

    if (loading) {
      if (projects.length === 0) {
        content = this.projectsSpinner();
      } else {
        content = (
          <Fragment>
            {this.renderContent(showProject, projects)}
            {this.projectsSpinner()}
          </Fragment>
        );
      }
    } else {
      if (projects.length === 0) {
        content = this.renderNoContent();
      } else {
        content = this.renderContent(showProject, projects);
      }
    }
    // const content =
    //   projects.length === 0
    //     ? this.renderNoContent()
    //     : this.renderContent(showProject, projects);

    return (
      <Fragment>
        <Header />
        {/* <div className="page-wrap">
          <section className="menu-section ">
            <div className="menu-section-container">
              <span className="biggest flex-item-center txtcenter">
                <Link className="homepage-link" to="/">
                  Looking For Maintainers
                </Link>
              </span>
            </div>
          </section>
        </div> */}
        <div className="repositories-container">
          <div className="body-row">
            <div className="filters">
              <Filters
                handleSelectedLanguage={this.handleSelectedLanguage}
                selectedLanguage={selectedLanguage}
                updateViewFn={this.updateView}
              />
            </div>
            {content}
            <Footer />
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  projects,
  repos,
}: {
  projects: projectsInitialStateType;
  repos: any;
}) => ({
  projects: projects.projects,
  loading: projects.loading,
  selectedLanguage: repos.selectedLanguage,
  next: projects.next,
});

export default connect(mapStateToProps, { getRepos })(Explore);
