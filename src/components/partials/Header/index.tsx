import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserRef } from "../../../interface";

const Header: React.FunctionComponent<{ user: UserRef }> = (props) => {
  const [showDropdrown, updateShowDropdown] = useState(false);

  const updateMenuDropDown = () => {
    updateShowDropdown(!showDropdrown);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <button
          onClick={updateMenuDropDown}
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

        <div
          className={
            showDropdrown ? "navbar-collapse" : "collapse navbar-collapse"
          }
          id="navbarTogglerDemo01"
        >
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0" />
          {props.user ? (
            <ul className="navbar-nav ">
              <li className="nav-item dropdown">
                <span
                  onClick={updateMenuDropDown}
                  className="nav-link dropdown-toggle"
                  id="navDropDownLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {props.user.login}
                </span>
                <div
                  className={
                    showDropdrown ? "dropdown-menu show" : "dropdown-menu"
                  }
                  aria-labelledby="navDropDownLink"
                >
                  <Link to="/profile" className="dropdown-item">
                    Profile
                  </Link>
                  <div className="dropdown-divider" />
                  <Link to="/logout" className="dropdown-item">
                    Logout
                  </Link>
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
