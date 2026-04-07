import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/leaderboard/");
                setScores(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return <p style={{ textAlign: "center" }}>Loading leaderboard...</p>;
    }

    return (
        <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center", color: "white" }}>
            <h2>Leaderboard</h2>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", color: "white" }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th> Username</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {scores.map((entry, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{entry.username}</td>
                            <td>{entry.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}