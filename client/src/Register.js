import React, { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
      });
      navigate("/login");
    } catch (error) {
      alert("This user is already exists");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <Form
        onSubmit={handleRegister}
        className="mb-3 p-4 border"
        style={{ borderRadius: "10px" }}
      >
        <h2>
          <strong>Register Here</strong>
        </h2>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </div>
  );
}

export default Register;
