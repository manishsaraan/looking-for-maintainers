import React from "react";

const Header = (props: any) => {

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <a
          href="https://github.com/manishsaraan/looking-for-maintainers"
          rel="noopener noreferrer"
          target="_blank"
          className="navbar-brand"
        >
          <div className="logo-text">
            <h4>LFM</h4>
          </div>
        </a>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0" />
          {props.user ? (
            <ul className="navbar-nav ">
              <li className="nav-item dropdown">
                <a
                  href="#"
                  className="nav-link dropdown-toggle"
                  id="navDropDownLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {props.user.username}
                </a>
                <div
                  className="dropdown-menu"
                  aria-labelledby="navDropDownLink"
                >
                  <a className="dropdown-item" href="/profile">
                    Profile
                  </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="/logout">
                    Logout
                  </a>
                </div>
              </li>
            </ul>
          ) : (
              <a
                href="/login/github"
                rel="noopener noreferrer"
                className="btn btn-light language-filter shadowed"
              >
                <i className="fa fa-github mr-1" /> Login
            </a>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
