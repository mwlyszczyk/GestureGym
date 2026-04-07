import React, { useState } from "react";
import axios from "axios";

export default function ScoreTest() {
    const [score, setScore] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("You must be logged in first");
            return;
        }

        try {
            await axios.post(
                "http://localhost:8000/api/submit-score/",
                { score: parseInt(score) },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage("Score submitted!");
            setScore("");
        } catch (err) {
            console.log(err.response);
            setMessage(
                "Error: " +
                (err.response?.data?.detail || "Could not submit score")
            );
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
            <h2 style={{color: "white"} }>Submit Score</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Enter score"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    required
                    style={{ width: "100%", padding: "10px", margin: "10px 0" }}
                />

                <button type="submit" style={{ padding: "10px 20px" }}>
                    Submit Score
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}