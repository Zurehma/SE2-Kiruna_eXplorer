import { Navbar, Nav, Dropdown, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export function NavigationBar(props) {
  const location = useLocation(); // Per ottenere il percorso corrente
  const navigate = useNavigate();

  const handleLogout = () => {
    props.handleLogout();
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Navbar.Brand as={Link} to="/" className="navbar-brand">
        Kiruna
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
                View All
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
                as={Link}
                to="/login"
                className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
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
