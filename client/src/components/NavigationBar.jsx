import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export function NavigationBar(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false); // Track navbar expansion state
  const navRef = useRef(null);

  const handleLoginClick = () => {
    if (location.pathname !== "/") {
      navigate("/"); 
    }
    props.toggleLoginPane();
    setExpanded(false); // Close the navbar if open
  };

  const handleNewUserClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }
    props.toggleAddUserPane();
    setExpanded(false); 
  };

  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    props.handleLogout();
    props.closeAddUserPane();
    props.closeLoginPane();
    navigate("/");
    setExpanded(false);
  };

  const handleCloseSliding = () => {
    props.closeAddUserPane();
    props.closeLoginPane();
    setExpanded(false);
  };

  // Handle clicks outside of the Navbar to close it when expanded
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expanded && navRef.current && !navRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    if (expanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expanded]);

  return (
    <Navbar
      expand="lg"
      className={`custom-navbar ${scrolled ? "scrolled" : ""}`}
      expanded={expanded}
      ref={navRef}
    >
      <Navbar.Brand as={Link} onClick={handleCloseSliding} to="/" className="navbar-brand">
        Kiruna eXplorer
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          {props.loggedIn ? (
            <>
              <Nav.Link
                as={Link}
                onClick={handleCloseSliding}
                to="/map"
                className={`nav-link ${location.pathname === "/map" ? "active" : ""}`}
              >
                Map
              </Nav.Link>
              <Nav.Link
                as={Link}
                onClick={handleCloseSliding}
                to="/graph"
                className={`nav-link ${location.pathname === "/graph" ? "active" : ""}`}
              >
                Diagram
              </Nav.Link>
              <Nav.Link
                as={Link}
                onClick={handleCloseSliding}
                to="/documents/all"
                className={`nav-link ${location.pathname === "/documents/all" ? "active" : ""}`}
              >
                Documents List
              </Nav.Link>
              <Nav.Link
                as={Link}
                onClick={handleCloseSliding}
                to="/documents"
                className={`nav-link ${location.pathname === "/documents" ? "active" : ""}`}
              >
                New Document
              </Nav.Link>
              <Nav.Link
                as={Link}
                onClick={handleCloseSliding}
                to="/documents/links"
                className={`nav-link ${location.pathname === "/documents/links" ? "active" : ""}`}
              >
                New Connection
              </Nav.Link>
              {props.role !== "admin" && (
                <Nav.Link onClick={handleNewUserClick} className="nav-link">
                  New User
                </Nav.Link>
              )}
              <Nav.Link onClick={handleLogout} className="nav-link">
                Logout
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link
                as={Link}
                to="/map"
                onClick={handleCloseSliding}
                className={`nav-link ${location.pathname === "/map" ? "active" : ""}`}
              >
                Map
              </Nav.Link>
              <Nav.Link
                as={Link}
                onClick={handleCloseSliding}
                to="/graph"
                className={`nav-link ${location.pathname === "/graph" ? "active" : ""}`}
              >
                Diagram
              </Nav.Link>
              <Nav.Link onClick={handleLoginClick} className="nav-link">
                Login
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
