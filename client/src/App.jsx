import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import { Login } from './Login';
import Home from './Home';
  



  function App() {
    return (
      
        <div className="min-vh-100 d-flex flex-column">
          <NavigationBar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Home/>} /> 
              <Route path="/login" element={<Login />} /> 
            </Routes>
          </div>
        </div>
    );
  }

  export default App;
