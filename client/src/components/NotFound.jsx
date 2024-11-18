import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';


function NotFound() {
    return (
        <Container className="text-center mt-5">
            <Row>
                <Col>
                    <h1 className="display-1">404</h1>
                    <p className="lead">Not Found</p>
                    <p>The page you are looking for does not exist.</p>
                    <Button variant="primary" href="/home">Go Home</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default NotFound