import React, { useState } from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const NavigationBar = ({ setLoggedIn, loggedIn, setCurrentUser, currentUser }) => {
  const [showNavbar, setShowNavbar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3001/api/sessions/logout', { method: 'DELETE' });
      setLoggedIn(false);
      setCurrentUser('');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleToggle = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <Navbar variant="dark" expand="lg" className="custom-navbar">
      <Navbar.Brand onClick={() => navigate('/')} className="navbar-brand">
        <i className="bi bi-envelope ms-2 me-2 text-white"></i> Kiruna
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-content" onClick={handleToggle} />

      <Navbar.Collapse in={showNavbar} id="navbar-content">
        <Nav className="ms-auto">
          {loggedIn ? (
            <div className="d-flex align-items-center">
              <i className="bi bi-person-circle text-white me-2 my-icons"></i>
              <h5 className="text-white mt-1">Welcome, {currentUser}</h5>
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-custom-navbar"
                  className="my-arrow-dropdown"
                ></Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end me-2">
                  {location.pathname !== '/' && (
                    <Dropdown.Item onClick={() => navigate('/')}>
                      <i className="bi bi-house-door"></i> Home
                    </Dropdown.Item>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : (
            <Nav.Link onClick={() => navigate(location.pathname === '/login' ? '/' : '/login')}>
              {location.pathname === '/login' ? (
                <span><i className="bi bi-house-door me-2"></i> Home</span>
              ) : (
                <span><i className="bi bi-box-arrow-right me-2"></i> Login</span>
              )}
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
