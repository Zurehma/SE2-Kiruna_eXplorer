import React, { useEffect } from "react";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import "../styles/Login.css";
import { Form, Button, Alert } from "react-bootstrap";

const Login = ({
  isLoginOpen,
  closeLoginPane,
  username,
  password,
  setUsername,
  setPassword,
  handleLogin,
  loggedinError,
  setloggedinError,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { username, password };
    await handleLogin(credentials);
    // closeLoginPane();
  };
  useEffect(() => {
    if (loggedinError) {
      const timer = setTimeout(() => {
        setloggedinError(null); // Clear the error after 5 seconds
      }, 5000);
      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [loggedinError, setloggedinError]);

  return (
    <SlidingPane
      className="login-pane"
      isOpen={isLoginOpen}
      title="Login"
      from="right"
      width="400px"
      onRequestClose={closeLoginPane}
    >
      <Form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>

        <Form.Group className="form-group" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            placeholder="Example: admin"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            placeholder="Enter your password."
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </Form.Group>
        <Button className="login-button" type="submit">
          Login
        </Button>
        {loggedinError && (
          <div className="error-message d-flex align-items-center mb-3 p-2 bg-danger bg-opacity-10 border border-danger rounded">
            <i
              className="bi bi-exclamation-triangle-fill text-danger me-2"
              style={{ fontSize: "1.5rem" }}
            ></i>
            <span className="text-danger">{loggedinError}</span>
          </div>
        )}
      </Form>
    </SlidingPane>
  );
};

export default Login;
