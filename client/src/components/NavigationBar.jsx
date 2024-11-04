import React from 'react';
import { Navbar, Nav, Dropdown, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

export function NavigationBar(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  const handleToggle = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  return (
    <Navbar variant="dark" expand="lg" className="custom-navbar">
      <Navbar.Brand as={Link} to="/" onClick={handleClose}>
        Kiruna
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle} />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto"> {/* Right-align everything */}
          {props.role === 'Urban Planner' ? (
            <div className="d-flex align-items-center">
              {/* Welcome text */}
              <i className="bi bi-person-circle text-white me-2"></i>
              <h5 className="text-white mt-1 welcome-text me-2">
                Welcome, {props.username}
              </h5>

              {/* Single Dropdown Menu for navigation actions */}
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-white" id="dropdown-basic" className="btn-dark">
                  Menu
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end">
                  <Dropdown.Item onClick={() => { navigate('/map'); handleClose(); }}>
                    <i className="bi bi-map me-2"></i> Map
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => { navigate('/documents'); handleClose(); }}>
                    <i className="bi bi-file-earmark-plus me-2"></i> Add Document
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => { navigate('/documents/links'); handleClose(); }}>
                    <i className="bi bi-link-45deg me-2"></i> Add Link
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  {location.pathname !== '/' && (
                    <Dropdown.Item onClick={() => { navigate('/'); handleClose(); }}>
                      <i className="bi bi-house-door"></i> Home
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item onClick={() => { props.handleLogout(); handleClose(); }} className="text-danger">
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : (
            // If the user is not an Urban Planner, show login or home button
            location.pathname === '/login' ? (
              <Button
                variant="outline-light"
                className="ms-3"
                onClick={() => { navigate('/'); handleClose(); }}
              >
                Home
              </Button>
            ) : (
              <Button
                variant="outline-light"
                className="ms-3"
                onClick={() => { navigate('/login'); handleClose(); }}
              >
                Login
              </Button>
            )
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
