import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center my-5">
      <h1 className="display-4">Access Denied</h1>
      <p className="lead">Oops! You don't have permission to access this page.</p>
      <img 
        src="/error.webp" 
        alt="Access Denied" 
        style={{ maxWidth: '300px' }}
        />
      <p>
        Please log in to continue.       </p>
      <Button variant="secondary" onClick={() => navigate('/')}>
        Return to Home
      </Button>
    </Container>
  );
};

export default AccessDenied;
