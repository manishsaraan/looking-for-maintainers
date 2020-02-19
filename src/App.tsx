import React, { Component } from "react";
import GithubLogin from "./lib";
import { clientId } from "./config/index";
import "./all.css";

type AppProps = {
  history: any,
  user: any,
  articles: any
}

class App extends Component<AppProps> {
  logout = () => {
    localStorage.setItem("user", "");
    this.props.history.push("/");
  };

  render() {
    const { user, articles } = this.props;
    console.log("---user---", articles);

    return (
      <div className="page-content">
        <div className="page-content-container">
          <div className="home">
            <section className="hero-section ">
              <div className="wrapper w960p flex-container flex-container-v">
                <h1 className="xlbiggest flex-item-center txtcenter">Looking For Maintainers</h1>
                <p className="biggest flex-item-center h2-like txtcenter">Web app to find projects to contribute</p>
                <p className="biggest flex-item-center h2-like txtcenter"></p>
              </div>
            </section>
            <section className="explanation-section">
              <div className="wrapper w960p flex-container flex-container-v">
                <div className="separator w10"></div>
                <h1 className="xbiggest flex-item-center txtcenter mtxl">Motivation</h1>
                <p className="flex-item-center h3-like txtcenter mts"> Most projects on GitHub die because their authors can't find new contributors.</p>
                <p className="flex-item-center h3-like txtcenter mts"> &nbsp; </p>
                <p className="flex-item-center h3-like txtcenter mts">
                  <strong>Looking For Maintainers</strong> will help
              <strong>project</strong> owners to find
              <strong>new contributors</strong> and contributors to find exciting projects.</p>
                <p className="flex-item-center h3-like txtcenter mts"> &nbsp; </p>
                <div className="flex-item-center">
                  <a className=" button flex-item-center mtxl" href="https://github.com/manishsaraan/looking-for-maintainers"> View it on GitHub</a>
                </div>
              </div>
            </section>
            <section className="contact-section mtxl">
              <div className="wrapper w960p flex-container flex-container-v">
                <div className="separator w10"></div>
                <h1 className="xbiggest flex-item-center txtcenter mtxl">Let's keep in touch</h1>
                <p className="flex-item-center h3-like txtcenter mts">If you want to get notifications about new projects, please subscribe.</p>
                <p className="flex-item-center h3-like txtcenter mts">Zero spam of course, unsubscribe any time.</p>
                <div className="contact-container mtxl">
                  <div className="first-page-email">
                    <div className="first-page-email-content">
                      <div className="first-page-email__input-container">
                        <form className="load-email__form" id="contact-form">
                          <div className="load-email__form-item">
                            <input className="load-email-enter" placeholder="Enter your email :)" type="email" />
                          </div>
                          <div className="load-email__form-item txtcenter">
                            <button type="submit" className="load-email-button button-primary">Subscribe</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <footer className="footer-section mtxl">
              <div className="wrapper w960p flex-container flex-container-v txtcenter">
                <div className="h5-like pbs">
                  © Looking For Maintainers • 2020 •
            </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
