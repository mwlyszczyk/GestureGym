import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios({
        method: "post",
        url: "https://backend10232002.ngrok.app/api/login/",
        data: {
          username: username.trim(),
          password: password.trim(),
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      localStorage.setItem("token", res.data.access);
      setMessage("Login successful!");
      setTimeout(() => navigate("/"), 700);
    } catch (err) {
      setMessage(
        "Login failed. Make sure the backend is running and your credentials are correct."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Sign In</h2>
        <p className="auth-subtitle">Welcome back to GestureGym</p>

        <form onSubmit={handleSubmit}>
          <label className="auth-label">Username</label>
          <input
            className="auth-input"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="primary-btn">
            Sign In
          </button>
        </form>

        {message && <div className="message-box">{message}</div>}

        <div className="auth-footer-link">
          Don’t have an account? <Link to="/Register">Register</Link>
        </div>
      </div>
    </div>
  );
}