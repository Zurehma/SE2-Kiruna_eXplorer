import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Container, Alert } from "react-bootstrap";

import Links from "./components/Links.jsx";
import Home from "./components/Home";
import Documents from "./components/Doc/Documents.jsx";
import { NavigationBar } from "./components/NavigationBar.jsx";
import MapNavigation from "./components/MapNavigation/MapNavigation.jsx";
import API from "../API.js";
import FilteringDocuments from "./components/FilteringDocuments.jsx";
import AccessDenied from "./components/AccessDenied.jsx";
import NotFound from "./components/NotFound.jsx";
import { SingleDocument } from "./components/SingleDocument.jsx";
import DocumentChartStatic from "./components/Graph/Graph.jsx";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loggedinError, setloggedinError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [newDoc, setNewDoc] = useState("");
  //const [editDoc, setEditDoc] = useState(""); //BOH
  const navigate = useNavigate();
  const [logging, setLogging] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);


  const handleLoginSuccess = () => {
    setShowLoginMessage(true);
    setTimeout(() => {
      setShowLoginMessage(false);
    }, 5000);
  };

  const toggleLoginPane = () => {
    setIsLoginOpen((prev) => !prev);
  };

  const closeLoginPane = () => {
    setIsLoginOpen(false);
  };

  const toggleAddUserPane = () => {
    setIsAddUserOpen((prev) => !prev);
  };

  const closeAddUserPane = () => {
    setIsAddUserOpen(false);
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await API.logIn(credentials);
      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }
      const user = await API.getUserInfo();
      setLoggedIn(true);
      setRole(user.role);
      handleLoginSuccess();
      setIsLoginOpen(false);
      setloggedinError(null);
    } catch (error) {
      setloggedinError("Login failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    setLogging(true);
    const checkLogin = async () => {
      try {
        // Check if the user is already logged in
        const user = await API.getUserInfo();
        setUsername(user.username);
        setLoggedIn(true);
        setRole(user.role);
      } catch (error) {
        // If the user is not logged in, an error will be thrown
        // We can ignore this error, it's normal React behaviour
      } finally {
        setLogging(false);
      }
    };
    checkLogin();
  }, []);

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUsername("");
    navigate("/");
    setRole("");
  };
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null); // Clear the error after 5 seconds
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [error]);

  return !logging ? (
    <div className="min-vh-100 d-flex flex-column">
      <NavigationBar
        loggedIn={loggedIn}
        username={username}
        handleLogout={handleLogout}
        role={role}
        toggleLoginPane={toggleLoginPane}
        isLoginOpen={isLoginOpen}
        closeLoginPane={closeLoginPane}
        toggleAddUserPane={toggleAddUserPane}
        isAddUserOpen={isAddUserOpen}
        closeAddUserPane={closeAddUserPane}
      />
      <Container fluid className="flex-grow-1 d-flex flex-column px-0">
        {error && (
          <Alert
            variant="danger"
            className="fixed-top mt-3"
            style={{ zIndex: 150000000000 }}
            dismissible
            onClose={() => setError(null)}
          >
            <p>{error}</p>
          </Alert>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <Home
                setError={setError}
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
                role={role}
                setRole={setRole}
                loggedinError={loggedinError}
                setloggedinError={setloggedinError}
                handleLogin={handleLogin}
                toggleLoginPane={toggleLoginPane}
                isLoginOpen={isLoginOpen}
                closeLoginPane={closeLoginPane}
                toggleAddUserPane={toggleAddUserPane}
                isAddUserOpen={isAddUserOpen}
                closeAddUserPane={closeAddUserPane}
                setShowLoginMessage={setShowLoginMessage}
                showLoginMessage={showLoginMessage}
                handleLoginSuccess={handleLoginSuccess}
              />
            }
          />

          <Route path="/map" element={<MapNavigation setError={setError} loggedIn={loggedIn} />} />
          <Route
            path="/documents"
            element={
              loggedIn ? (
                <Documents newDoc={newDoc} setNewDoc={setNewDoc} setError={setError} />
              ) : (
                <AccessDenied toggleLoginPane={toggleLoginPane} />
              )
            }
          />
          <Route
            path="/document/:id"
            element={<SingleDocument setError={setError} loggedIn={loggedIn} />}
          />
          <Route
            path="/documents/links"
            element={
              loggedIn ? (
                <Links newDoc={newDoc} setNewDoc={setNewDoc} />
              ) : (
                <AccessDenied toggleLoginPane={toggleLoginPane} />
              )
            }
          />

          <Route
            path="/documents/all"
            element={
              loggedIn ? (
                <FilteringDocuments loggedIn={loggedIn} />
              ) : (
                <AccessDenied toggleLoginPane={toggleLoginPane} />
              )
            }
          />

          <Route
            path="/documents/:id"
            element={
              loggedIn ? (
                <Documents newDoc={newDoc} setNewDoc={setNewDoc} setError={setError} />
              ) : (
                <AccessDenied toggleLoginPane={toggleLoginPane} />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
          <Route path="graph" element={<DocumentChartStatic role={role} loggedIn={loggedIn} />} />
        </Routes>
      </Container>
    </div>
  ) : (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default App;
