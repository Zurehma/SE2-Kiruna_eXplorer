import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

import NavigationBar from './components/NavigationBar';
import { Login } from './components/Login';
import Documents from './components/Documents';
import { Map2 } from './components/Map2';
import Home from './components/Home';
import Links from './components/Links';

function App() {
    const [error, setError] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState('');

    return (
        <div className="app-container">
            <NavigationBar
                setLoggedIn={setLoggedIn}
                loggedIn={loggedIn}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                className="navbar-overlay"
            />
            <div className="map-content">
                {error && (
                    <Alert
                        variant="danger"
                        className="fixed-bottom mt-3"
                        dismissible
                        onClose={() => setError(null)}
                    >
                        <p>{error.message}</p>
                    </Alert>
                )}
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setCurrentUser={setCurrentUser} />} />
                    <Route path="/document" element={<Documents />} />
                    <Route path='/map' element={<Map2 setError={setError} />} />
                    <Route path="/document/link" element={<Links/>} /> 
                </Routes>
            </div>
        </div>
    );
}

export default App;
