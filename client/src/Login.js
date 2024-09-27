import React, { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/homepage");
    } catch (error) {
      if (error.response.status === 403) {
        alert("You are blocked. Sorry, you cannot enter.");
      } else {
        alert("Invalid login..! Try again.");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <Form
        onSubmit={handleLogin}
        className="mb-3 p-4 border"
        style={{ borderRadius: "10px" }}
      >
        <h2>
          <strong>Login Here</strong>
        </h2>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>User Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <p>
          Don't have an account? <a href="/">Register now</a>{" "}
        </p>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </div>
  );
}

export default Login;
