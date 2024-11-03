import React, { useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import '../styles/Login.css';

function Login({ handleLogin,username,password, setUsername, setPassword,error, setError }) {



    const handleSubmit = async (event) => {
        event.preventDefault();
        const credentials = { username, password };
        await handleLogin(credentials); 
    };

    return (
        <div className="login-background">
            <Row className="justify-content-md-center">
                <Col md={12} className="login-container">
                    <h1 className="pb-3">Login</h1>
                    <Form onSubmit={handleSubmit}>
                    {error && (
                        <Alert variant="danger" dismissible onClose={() => setError(null)}>
                            {error}
                        </Alert>)}
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
