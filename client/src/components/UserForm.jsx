import React, { useState, useEffect, useRef } from "react";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import "../styles/UserForm.css";
import { Form, Button, Alert } from "react-bootstrap";
import API from "../../API.js";

const UserForm = ({ isAddUserOpen, closeAddUserPane, onUserCreated }) => {
  const roles = ["Urban Planners", "Residents", "Urban Developers"];
  const [signinError, setsigninError] = useState(null);
  const [repPassword, setRepPassword] = useState("");
  const errorRef = useRef(null);
  const [newUser, setNewUser] = useState({
    name: "",
    surname: "",
    role: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    role: "",
    username: "",
    password: "",
    repPassword: "",
  });

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      try {
        const response = await API.signIn(newUser);
        if (!response.ok) {
          throw new Error("SignIn failed. Please check your information.");
        }
        onUserCreated();
        resetForm(); // Resetta il form
        closeAddUserPane(); // Chiude il pannello dopo aver registrato l'utente
      } catch (error) {
        setsigninError("Sign in failed. Please check your info.");
      }
    }
  };

  const resetForm = () => {
    setNewUser({
      name: "",
      surname: "",
      role: "",
      username: "",
      password: "",
    });
    setRepPassword("");
    setErrors({
      name: "",
      surname: "",
      role: "",
      username: "",
      password: "",
      repPassword: "",
    });
  };

  useEffect(() => {
    if (signinError) {
      errorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      const timer = setTimeout(() => {
        setsigninError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [signinError, setsigninError]);

  const validateStep = () => {
    const newErrors = {};
    if (!newUser.name || newUser.name.length < 2) {
      newErrors.name = "Name is required and cannot be empty.";
    }
    if (!newUser.surname || newUser.surname.length < 2) {
      newErrors.surname = "Surname is required and cannot be empty.";
    }
    if (!newUser.username || newUser.username.length < 2) {
      newErrors.username = "Username is required and cannot be empty.";
    }
    if (!newUser.role) {
      newErrors.role = "You must select a role.";
    }
    if (!newUser.password || newUser.password.length < 6) {
      newErrors.password = "Password is required and must be at least 6 characters long.";
    }
    if (!repPassword || repPassword !== newUser.password) {
      newErrors.repPassword = "Please repeat the same password.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <SlidingPane
      className="add-user-pane"
      isOpen={isAddUserOpen}
      title="Add New User"
      from="right"
      width="400px"
      onRequestClose={closeAddUserPane}
    >
      <Form className="add-user-form" onSubmit={handleSubmitUser}>
        <h2 className="add-user-title">Sign In</h2>
        <Form.Group className="form-group" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={newUser.name}
            placeholder="Enter the first name"
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="form-group" controlId="surname">
          <Form.Label>Surname</Form.Label>
          <Form.Control
            type="text"
            value={newUser.surname}
            placeholder="Enter the surname"
            onChange={(e) => setNewUser({ ...newUser, surname: e.target.value })}
            isInvalid={!!errors.surname}
          />
          <Form.Control.Feedback type="invalid">{errors.surname}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="form-group" controlId="role">
          <Form.Label>Role</Form.Label>
          <Form.Select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            isInvalid={!!errors.role}
          >
            <option value="">Select a role</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errors.role}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="form-group" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={newUser.username}
            placeholder="Enter a valid username"
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            isInvalid={!!errors.username}
          />
          <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="form-group" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={newUser.password}
            placeholder="Enter a password"
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="form-group" controlId="repPassword">
          <Form.Label>Repeat Password</Form.Label>
          <Form.Control
            type="password"
            value={repPassword}
            placeholder="Repeat the password"
            onChange={(e) => setRepPassword(e.target.value)}
            isInvalid={!!errors.repPassword}
          />
          <Form.Control.Feedback type="invalid">{errors.repPassword}</Form.Control.Feedback>
        </Form.Group>

        <Button className="add-user-button" type="submit">
          Add User
        </Button>

        {signinError && (
          <div
            ref={errorRef}
            className="error-message d-flex align-items-center mb-3 p-2 bg-danger bg-opacity-10 border border-danger rounded"
          >
            <i
              className="bi bi-exclamation-triangle-fill text-danger me-2"
              style={{ fontSize: "1.5rem" }}
            ></i>
            <span className="text-danger">{signinError}</span>
          </div>
        )}
      </Form>
    </SlidingPane>
  );
};

export default UserForm;
