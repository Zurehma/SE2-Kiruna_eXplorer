import React from 'react';
import { Navbar, Nav, Dropdown, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

export function NavigationBar(props) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Navbar variant="dark" expand="lg" className="custom-navbar">
      <Navbar.Brand as={Link} to="/">
      Kiruna
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          {props.loggedIn ? (
            <div className="d-flex align-items-center">
              <i className="bi bi-person-circle text-white me-2 my-icons"></i>
              <h5 className="text-white mt-1">Welcome, {props.username}</h5>
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-custom-navbar"
                  className="my-arrow-dropdown"
                />
                <Dropdown.Menu className="dropdown-menu-end me-2">
                  {location.pathname !== '/' && (
                    <Dropdown.Item onClick={() => navigate('/')}>
                      <i className="bi bi-house-door"></i> Home
                    </Dropdown.Item>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={props.handleLogout} className="text-danger">
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : (
            <>
              {/* If user is not logged in and on the /login page, show Home button */}
              {location.pathname === '/login' ? (
                <Button
                  variant="outline-light"
                  className="ms-3"
                  onClick={() => navigate('/')}
                >
                  Home
                </Button>
              ) : (
                /* Show Login button on pages other than /login */
                <Button
                  variant="outline-light"
                  className="ms-3"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              )}
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
