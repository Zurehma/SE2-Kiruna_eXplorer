import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import { Login } from './components/Login';
import Home from './components/Home';
import Documents from './components/Documents';




  function App() {
    const [error, setError] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false)
    const [currentUser, setCurrentUser] = useState('')
    console.log(currentUser);
    
    return (
      
        <div className="min-vh-100 d-flex flex-column">
          <NavigationBar setLoggedIn={setLoggedIn} loggedIn={loggedIn} currentUser={currentUser} setCurrentUser ={setCurrentUser}/>
          <div className="flex-grow-1 d-flex flex-column">
            {error && (
              <Alert variant="danger" className="fixed-bottom mt-3" dismissible onClose={() => setError(null)}>
                <p>{error.message}</p>
              </Alert>
            )}
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setCurrentUser={setCurrentUser}/>} /> 
              <Route path="/doc" element={<Documents/>} /> 
            </Routes>
          </div>
        </div>
    );
  }

  export default App;
