import React, { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles/Navbar.css';

const NavigationBar = ({ setLoggedIn, loggedIn, setCurrentUser, currentUser }) => {
  const [showNavbar, setShowNavbar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3001/api/sessions/logout', { method: 'DELETE' });
      setLoggedIn(false); // Update loggedIn state in your app
      setCurrentUser(''); // Clear the current user
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

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
          {loggedIn ? (
            <>
              <Nav.Link disabled>{currentUser}</Nav.Link> {/* Display username */}
              <Nav.Link onClick={handleLogout}>
                <span><i className="bi bi-box-arrow-left me-2"></i> Logout</span>
              </Nav.Link>
            </>
          ) : (
            <Nav.Link onClick={handleNavigation}>
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
