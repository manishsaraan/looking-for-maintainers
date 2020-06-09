import React, { useContext, memo } from 'react';
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import GitHubSvg from '../../../assets/images/github-brands.svg';
import AuthContext from '../../../context/authContext';
import { clientId } from '../../../config';
import './Header.css';

const Header: React.FunctionComponent<{}> = (props) => {
  const user: any = useContext(AuthContext);

  return (
    <div className="header">
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
        <Link className="navbar-brand" to="/">
          Looking For Maintainers
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto"></Nav>
          <Nav>
            <Link className="nav-link" to="/explore">
              Explore
            </Link>
            {user ? (
              <NavDropdown title={user.login} id="collasible-nav-dropdown">
                <Link className="dropdown-item" to="/profile">
                  <FontAwesomeIcon icon={faUser} /> Profile
                </Link>
                <Link className="dropdown-item" to="/logout">
                  {' '}
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </Link>
              </NavDropdown>
            ) : (
              <Nav.Link
                className="publish-button"
                href={`https://github.com/login/oauth/authorize?client_id=${clientId}`}
              >
                <img className="header-svg" src={GitHubSvg} alt="test" />
                Publish
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default memo(Header);
