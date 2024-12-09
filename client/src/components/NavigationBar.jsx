import React, { useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export function NavigationBar(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    // Aggiungi l'ascoltatore dello scroll
    window.addEventListener("scroll", handleScroll);
    // Rimuovi l'ascoltatore quando il componente viene smontato
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    props.handleLogout();
    navigate("/");
  };

  return (
    <Navbar expand="lg" className={`custom-navbar ${scrolled ? "scrolled" : ""}`}>
      <Navbar.Brand as={Link} to="/" className="navbar-brand">
        Kiruna eXplorer
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          {props.loggedIn ? (
            <>
              <Nav.Link
                as={Link}
                to="/"
                className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/map"
                className={`nav-link ${location.pathname === "/map" ? "active" : ""}`}
              >
                Map
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/documents"
                className={`nav-link ${location.pathname === "/documents" ? "active" : ""}`}
              >
                Add Document
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/documents/links"
                className={`nav-link ${location.pathname === "/documents/links" ? "active" : ""}`}
              >
                Add Link
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/documents/all"
                className={`nav-link ${location.pathname === "/documents/all" ? "active" : ""}`}
              >
                All Documents
              </Nav.Link>
              <Nav.Link onClick={handleLogout} className="nav-link">
                Logout
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link
                as={Link}
                to="/"
                className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/map"
                className={`nav-link ${location.pathname === "/map" ? "active" : ""}`}
              >
                Map
              </Nav.Link>
              <Nav.Link
                onClick={props.toggleLoginPane}
                className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
              >
                Login
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
