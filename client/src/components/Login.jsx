import React, { useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'

function Login({ setLoggedIn,setCurrentUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/sessions/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        setLoggedIn(true);
        setCurrentUser(username)
        navigate('/somewhereInThisPlanet');
        
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Invalid username or password');
        setShow(true);
      }
    } catch (error) {
      setErrorMessage('An error occurred during login');
      setShow(true);
    }
  };
  

  return (
    <div className="login-background">
      <Row className="justify-content-md-center">
        <Col md={12} className="login-container">
          <h1 className="pb-3">Login</h1>
          <Form onSubmit={handleSubmit}>
            <Alert
              dismissible
              show={show}
              onClose={() => setShow(false)}
              variant="danger"
            >
              {errorMessage}
            </Alert>
            <Form.Group className="mb-2" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                placeholder="Example: admin"
                onChange={(ev) => setUsername(ev.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                placeholder="Enter your password."
                onChange={(ev) => setPassword(ev.target.value)}
                required
                minLength={6}
              />
            </Form.Group>
            <Button className="mt-3 btn-black" type="submit">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export { Login };
