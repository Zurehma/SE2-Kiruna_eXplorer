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
      <Navbar.Collapse id="basic-navbar-nav" in={open}>
        <Nav className="ms-auto">
          {props.loggedIn ? (
            <div className="d-flex flex-column flex-lg-row align-items-center">
              <Button 
                variant='outline-black' 
                className="me-lg-2 mb-2 mb-lg-0 btn-dark" 
                onClick={() => { navigate('/documents'); handleClose(); }}
              >
                Add Document
              </Button>
              <Button 
                variant='outline-blue' 
                className="me-lg-2 mb-2 mb-lg-0 btn-dark" 
                onClick={() => { navigate('/link'); handleClose(); }}
              >
                Add Link
              </Button>
              <i className="bi bi-person-circle text-white me-2"></i>
              <h5 className="text-white mt-1 d-none d-lg-block welcome-text">
                Welcome, {props.username}
              </h5>
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-custom-navbar"
                  className="my-arrow-dropdown"
                />
                <Dropdown.Menu className="dropdown-menu-end me-2">
                  {location.pathname !== '/' && (
                    <Dropdown.Item onClick={() => { navigate('/'); handleClose(); }}>
                      <i className="bi bi-house-door"></i> Home
                    </Dropdown.Item>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => { props.handleLogout(); handleClose(); }} className="text-danger">
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : (
            <>
              {location.pathname === '/login' ? (
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
              )}
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
