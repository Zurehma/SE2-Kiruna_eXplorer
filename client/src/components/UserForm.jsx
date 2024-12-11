import React, { useState } from "react";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import "../styles/UserForm.css";
import { Form, Button } from "react-bootstrap";

const UserForm = ({ isAddUserOpen, closeAddUserPane }) => {
  const [newUser, setNewUser] = useState({
    nameu: "",
    surname: "",
    role: "",
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.updateUser(newUser);
      if (!response.ok) {
        throw new Error("Update new user failed. Please check the informations.");
      }
      setIsLoginOpen(false); // Chiude la finestra di login
    } catch (error) {
      setloggedinError(error.message || "Login failed. Please check your credentials.");
    }

    closeAddUserPane();
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
      <Form className="add-user-form" onSubmit={handleSubmit}>
        <h2 className="add-user-title">Add New User</h2>
        <Form.Group className="form-group" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={newUser.nameu}
            placeholder="Enter the first name"
            onChange={(e) => setNewUser({ ...newUser, nameu: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="form-group" controlId="surname">
          <Form.Label>Surname</Form.Label>
          <Form.Control
            type="text"
            value={newUser.surname}
            placeholder="Enter the surname"
            onChange={(e) => setNewUser({ ...newUser, surname: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="form-group" controlId="role">
          <Form.Label>Role</Form.Label>
          <Form.Control
            type="text"
            value={newUser.role}
            placeholder="Enter the role (e.g., user, admin)"
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="form-group" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={newUser.email}
            placeholder="Enter a valid email address"
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="form-group" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={newUser.password}
            placeholder="Enter a password"
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
            minLength={6}
          />
        </Form.Group>
        <Button className="add-user-button" type="submit">
          Add User
        </Button>
      </Form>
    </SlidingPane>
  );
};

export default UserForm;
