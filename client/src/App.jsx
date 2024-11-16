import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import {Container,Alert } from 'react-bootstrap';

import Links from './components/Links.jsx';
import { Login } from './components/Login';
import Home from './components/Home';
import Documents from './components/Documents.jsx';
import { NavigationBar } from './components/NavigationBar.jsx';
import Map2 from '../src/components/Map2.jsx';
import API from '../API.js';
import FilteringDocuments from './components/FilteringDocuments.jsx';


function App() {
    const [currentUser, setCurrentUser] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loggedinError, setloggedinError] = useState(null)
    const [loggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState('');
    const [newDoc, setNewDoc] = useState('');
    const [hideDocBar, sethideDocBar] = useState(false);
    const navigate = useNavigate();
    
    
    const handleLogin = async (credentials) => {
        try {
            // Attempt to log in with provided credentials
            const response = await API.logIn(credentials);
            
            // Check if the login was successful
            if (!response.ok) {
                throw new Error("Login failed. Please check your credentials.");
            }
    
            // After successful login, fetch user information
            const user = await API.getUserInfo();
            setCurrentUser(user);
            setLoggedIn(true);
            setRole(user.role)
            navigate('/');
            
        } catch (error) {
            // Handle errors (either from login or fetching user info)
            setloggedinError(error.message || "Login failed. Please check your credentials.");
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
    useEffect(() => {
      if (error) {
          const timer = setTimeout(() => {
              setloggedinError(null); // Clear the error after 5 seconds
          }, 3000);
          return () => clearTimeout(timer); // Cleanup timer on component unmount
      }
  }, [error]);
    
    return (
        <div className="min-vh-100 d-flex flex-column">
          <NavigationBar loggedIn={loggedIn} username={username} handleLogout={handleLogout} role={role} sethideDocBar= {sethideDocBar} hideDocBar ={sethideDocBar}/>
          <Container fluid className="flex-grow-1 d-flex flex-column px-0">
            {error && (
                <Alert variant="danger" className="fixed-top mt-3" style={{zIndex:1500}} dismissible onClose={() => setError(null)}>
                <p>{error.message}</p>
                </Alert>
            )}
            <Routes>
              <Route path="/" element={<Home setError={setError} />} />
              <Route path="/login" element={<Login handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} setRole={setRole} loggedinError={loggedinError} setloggedinError={setloggedinError}/>}/>
              <Route path="/map" element={<Map2 setError={setError} loggedIn={loggedIn}/>}/>
              <Route path="/documents" element={<Documents newDoc={newDoc} setNewDoc={setNewDoc} setError={setError}/>}/>
              <Route path="/documents/links" element={<Links newDoc={newDoc} setNewDoc={setNewDoc}  />}/>
              <Route path="/documents/all" element={<FilteringDocuments loggedIn={loggedIn}/>}/>
              </Routes>
          </Container>
        </div>
    );
}

export default App;
