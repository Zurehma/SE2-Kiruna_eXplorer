import React, { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles/Navbar.css';

const NavigationBar = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = () => {
    // Navigate to Home if on Login page, or Login if on Home page
    if (location.pathname === '/login') {
      navigate('/');
    } else {
      navigate('/login');
    }
    setShowNavbar(false); // Close the navbar on navigation
  };

  const handleToggle = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <Navbar variant="dark" expand="lg" className="bg-dark fixed-top">
      <Navbar.Brand onClick={() => navigate('/')}>
        Kiruna
      </Navbar.Brand>

      {/* Toggle button for smaller screens */}
      <Navbar.Toggle aria-controls="navbar-content" onClick={handleToggle} />

      <Navbar.Collapse in={showNavbar} id="navbar-content">
        <Nav className="ms-auto">
          {/* Conditionally show either "Home" or "Login" based on current page */}
          <Nav.Link onClick={handleNavigation} onClickCapture={() => setShowNavbar(false)}>
            {location.pathname === '/login' ? (
              <span><i className="bi bi-house-door me-2"></i> Home</span>
            ) : (
              <span><i className="bi bi-box-arrow-right me-2"></i> Login</span>
            )}
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
