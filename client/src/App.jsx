import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Alert, Container } from 'react-bootstrap';

import Links from './components/Links.jsx';
import { Login } from './components/Login';
import Home from './components/Home';
import Documents from './components/Documents.jsx';
import { NavigationBar } from './components/NavigationBar.jsx';
import {Map2} from '../src/components/Map2.jsx';
import { Map } from '../src/components/Map.jsx'
import API from '../API.js';


function App() {
    const [currentUser, setCurrentUser] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState('');
    const [newId, setnewId] = useState('');
    const navigate = useNavigate();
    
    const handleLogin = async (credentials) => {
        try {
            const response = await API.logIn(credentials); // Make sure API.logIn is defined to handle the login request
            if (response.ok) {
                await response.json(); // Assuming the API returns user data upon successful login
                setCurrentUser(username)
                setLoggedIn(true); // Update loggedIn state
                navigate('/'); // Redirect to the homepage or desired page after successful login
            } else {
                const errorData = await response.json();
                setError(errorData); // Set the error message from the response
            }
        } catch (error) {
            console.error("Login failed:", error);
            setError({ message: "An unexpected error occurred. Please try again." });
        }
    };
    
    
    const handleLogout = async () => {
        await API.logOut();
        setLoggedIn(false); 
        setUsername('');
        setCurrentUser('')
        navigate('/');
        setRole('')
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
          <NavigationBar loggedIn={loggedIn} username={username} handleLogout={handleLogout} />
          <Container fluid className="flex-grow-1 d-flex flex-column px-0">
            {error && (
              <Alert variant="danger" className="fixed-bottom mt-3" dismissible onClose={() => setError(null)}>
                <p>{error.message || "An error occurred"}</p>
              </Alert>
            )}
            <Routes>
              <Route path="/" element={<Home setError={setError} />} />
              <Route path="/login" element={<Login handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} setRole={setRole}/>}/>
              <Route path="/map" element={<Map2 handleLogin={handleLogin} username={username} setUsername={setUsername}/>}/>
              <Route path="/documents" element={<Documents newId={newId} setnewId={setnewId} />}/>
              <Route path="/documents/links" element={<Links newId={newId} setnewId={setnewId} />}/>
              </Routes>
          </Container>
        </div>
    );
}

export default App;
