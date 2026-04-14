import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

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

    return (
        <div className="bg-black min-h-screen flex justify-center text-white">
            <div className="w-full max-w-[1000px]">

                <Navbar />

                {/* Header */}
                <div className="px-4 pt-6 pb-4 text-center">
                    <h1 className="text-2xl md:text-3xl font-semibold">Leaderboard</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Top performers in Daily Push-ups
                    </p>
                </div>

                {/* Content */}
                <div className="px-4 max-w-[700px] mx-auto">

                    {/* Action button */}
                    <div className="mb-4 text-left">
                        <Link to="/Pushup">
                            <button className="px-4 py-2 bg-white text-black rounded text-sm font-medium">
                                Start Pushups
                            </button>
                        </Link>
                    </div>

                    {/* Table */}
                    <div className="bg-gray-900 rounded-lg overflow-hidden">
                        {loading ? (
                            <p className="text-center py-6 text-gray-400">
                                Loading leaderboard...
                            </p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-800 text-gray-300">
                                    <tr>
                                        <th className="text-left px-4 py-3">#</th>
                                        <th className="text-left px-4 py-3">Username</th>
                                        <th className="text-left px-4 py-3">Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scores.map((entry, index) => (
                                        <tr
                                            key={index}
                                            className="border-t border-gray-800 hover:bg-gray-800/50 transition"
                                        >
                                            <td className="px-4 py-3">{index + 1}</td>
                                            <td className="px-4 py-3">{entry.username}</td>
                                            <td className="px-4 py-3 font-medium">
                                                {entry.score}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}