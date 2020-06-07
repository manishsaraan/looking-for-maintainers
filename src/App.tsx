import React, { Component } from 'react';
import { connect } from 'react-redux';
import { subscribe } from './actions';
import { Link } from 'react-router-dom';
import Subscribe from './components/partials/Subscribe';
import Footer from './components/partials/Footer';
import GitHubLogin from './lib';
import { clientId } from './config';

type AppProps = {
  history: any;
  user: any;
  articles: any;
  subscribe: (email: string, fname: string) => any;
};

type AppState = {
  [key: string]: string;
};

export class App extends Component<AppProps, AppState> {
  render() {
    return (
      <div className="page-content">
        <div className="page-content-container">
          <div className="home">
            <section className="hero-section ">
              <div className="wrapper w960p flex-container flex-container-v">
                <h1
                  data-testid="landing-heading"
                  className="xlbiggest flex-item-center txtcenter"
                >
                  Looking For Maintainers
                </h1>
                <GitHubLogin clientID={clientId} />
                <p
                  data-testid="landing-subheading"
                  className="biggest flex-item-center h2-like txtcenter"
                >
                  Web app to find projects to contribute
                </p>
                <p className="biggest flex-item-center h2-like txtcenter"></p>
                <div className="flex-item-center">
                  <div className="mtxl w150p"></div>
                  <Link
                    className="button-primary txtcenter main-cta"
                    to="/explore"
                  >
                    <button className="button-primary txtcenter main-cta">
                      Explore Projects
                    </button>
                  </Link>
                </div>
              </div>
            </section>
            <section className="explanation-section">
              <div className="wrapper w960p flex-container flex-container-v">
                <div className="separator w10"></div>
                <h1 className="xbiggest flex-item-center txtcenter mtxl">
                  Motivation
                </h1>
                <p className="flex-item-center h3-like txtcenter mts">
                  {' '}
                  Most projects on GitHub die because their authors can't find
                  new contributors.
                </p>
                <p className="flex-item-center h3-like txtcenter mts">
                  {' '}
                  &nbsp;{' '}
                </p>
                <p
                  data-testid="landing-text"
                  className="flex-item-center h3-like txtcenter mts"
                >
                  <strong>Looking For Maintainers</strong> will help
                  <strong> project</strong> owners to find
                  <strong> new contributors</strong> and contributors to find
                  exciting projects.
                </p>
                <p className="flex-item-center h3-like txtcenter mts">
                  {' '}
                  &nbsp;{' '}
                </p>
                <div className="flex-item-center">
                  <a
                    className=" button flex-item-center mtxl no-margin"
                    href="https://github.com/manishsaraan/looking-for-maintainers"
                  >
                    {' '}
                    View it on GitHub
                  </a>
                </div>
              </div>
            </section>
            <section className="contact-section mtxl no-margin">
              <div className="wrapper w960p flex-container flex-container-v">
                <div className="separator w10"></div>
                <h1 className="xbiggest flex-item-center txtcenter mtxl">
                  Subscribe Newsletter
                </h1>
                <p className="flex-item-center h3-like txtcenter mts">
                  If you want to get notifications about new projects, please
                  subscribe.
                </p>
                <p className="flex-item-center h3-like txtcenter mts">
                  Zero spam of course, unsubscribe any time.
                </p>
                <div className="contact-container mtxl">
                  <div className="first-page-email">
                    <div className="first-page-email-content">
                      <div className="first-page-email__input-container">
                        <Subscribe subscribe={this.props.subscribe} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({});
export default connect(mapStateToProps, { subscribe })(App);
