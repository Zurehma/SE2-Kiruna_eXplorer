import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import {Container } from 'react-bootstrap';

import Links from './components/Links.jsx';
import { Login } from './components/Login';
import Home from './components/Home';
import Documents from './components/Documents.jsx';
import { NavigationBar } from './components/NavigationBar.jsx';
import {Map2} from '../src/components/Map2.jsx';
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
            const response = await API.logIn(credentials); 
            if (response.ok) {
                await response.json(); 
                setCurrentUser(username)
                setLoggedIn(true); 
                navigate('/'); 
            } else {
                setError( "Login failed. Please check your credentials.");            }
        } catch (error) {
            setError("Login failed. Please check your credentials." );        }
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
              setError(null); // Clear the error after 5 seconds
          }, 3000);
          return () => clearTimeout(timer); // Cleanup timer on component unmount
      }
  }, [error]);
    
    return (
        <div className="min-vh-100 d-flex flex-column">
          <NavigationBar loggedIn={loggedIn} username={username} handleLogout={handleLogout} />
          <Container fluid className="flex-grow-1 d-flex flex-column px-0">
            <Routes>
              <Route path="/" element={<Home setError={setError} />} />
              <Route path="/login" element={<Login handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} setRole={setRole} error={error} setError={setError}/>}/>
              <Route path="/map" element={<Map2 handleLogin={handleLogin} username={username} setUsername={setUsername}/>}/>
              <Route path="/documents" element={<Documents newId={newId} setnewId={setnewId} />}/>
              <Route path="/documents/links" element={<Links newId={newId} setnewId={setnewId} />}/>
              </Routes>
          </Container>
        </div>
    );
}

export default App;
