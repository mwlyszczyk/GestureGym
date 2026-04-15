import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post("https://backend10232002.ngrok.app/api/register/", {
        username: username.trim(),
        password: password.trim(),
      });

      setMessage("Account created successfully! You can sign in now.");
      setUsername("");
      setPassword("");
    } catch (err) {
      setMessage(
        "Registration failed. Make sure the backend is running and try a different username."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>
        <p className="auth-subtitle">Create your GestureGym account</p>

        <form onSubmit={handleSubmit}>
          <label className="auth-label">Username</label>
          <input
            className="auth-input"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="primary-btn">
            Sign Up
          </button>
        </form>

        {message && <div className="message-box">{message}</div>}

        <div className="auth-footer-link">
          Already have an account? <Link to="/Login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}