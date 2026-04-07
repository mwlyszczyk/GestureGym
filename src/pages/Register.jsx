import React, { useState } from "react";
import axios from "axios";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:8000/api/register/", {
                username,
                password,
            });

            setMessage("Account created!");
            setUsername("");
            setPassword("");
        } catch (err) {
            setMessage("Error: " + (err.response?.data?.error || "Something went wrong"));
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
            <h2 style={{ color: "white" }}>Register</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: "100%", padding: "10px", margin: "10px 0" }}
                    />
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "10px", margin: "10px 0" }}
                    />
                </div>

                <button type="submit" style={{ padding: "10px 20px" }}>
                    Sign Up
                </button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}