import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AccessDenied = (props) => {
  const navigate = useNavigate();

  return (
    <Container className="text-center my-5">
      <h1 className="display-4">Access Denied</h1>
      <p className="lead">Oops! You don't have permission to access this page.</p>
      <img src="/error.webp" alt="Access Denied" style={{ maxWidth: "300px" }} />
      <p>Please log in to continue or return to the homepage. </p>
      <Button
        variant="primary"
        onClick={() => {
          navigate("/"); // Naviga verso la home
          props.toggleLoginPane(); // Apre la sliding pane
        }}
        className="me-2"
      >
        Go to Login
      </Button>

      <Button variant="secondary" onClick={() => navigate("/")}>
        Return to Home
      </Button>
    </Container>
  );
};

export default AccessDenied;
