import React, { useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export function NavigationBar(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const handleLoginClick = () => {
    if (location.pathname !== "/") {
      navigate("/"); // Redirige solo se non sei già sulla home
    }
    props.toggleLoginPane(); // Apre la sliding pane
  };

  const handleNewUserClick = () => {
    if (location.pathname !== "/") {
      navigate("/"); // Redirige solo se non sei già sulla home
    }
    props.toggleAddUserPane(); // Apre la sliding pane
  };

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
    props.closeAddUserPane();
    props.closeLoginPane(); // Chiude il login pane quando viene effettuata una navigazione
    navigate("/");
  };

  const handleCloseSliding = () => {
    props.closeAddUserPane(); // Chiude il login pane quando viene effettuata una navigazione
    props.closeLoginPane(); // Chiude il login pane quando viene effettuata una navigazione
  };

  return (
    <Navbar expand="lg" className={`custom-navbar ${scrolled ? "scrolled" : ""}`}>
      <Navbar.Brand as={Link} onClick={handleCloseSliding} to="/" className="navbar-brand">
        Kiruna eXplorer
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
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
              {/* RICORDATI DI CAMBIARE !== CON === */}
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
