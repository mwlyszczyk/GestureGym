import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const API_URL = "https://untroubled-meg-unflinchingly.ngrok-free.dev";
   

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios({
                method: "post",
                url: "http://localhost:8000/api/login/",
                data: {
                    username: username.trim(),
                    password: password.trim(),
                },
                headers: {
                    "Content-Type": "application/json",
                },
            });

            localStorage.setItem("token", res.data.access);
            alert("Logged in!");
            navigate("/")
        } catch (err) {
            alert("ERROR: " + JSON.stringify(err.response?.data));
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
            <h2 style={{color: "white"} }>Login</h2>

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
                    Login
                </button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}