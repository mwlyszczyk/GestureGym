import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import Camera from "../camera.jsx";
import createPushupEngine from "../logic/pushupLogic.jsx";
import axios from "axios";
import Navbar from "../components/Navbar";

const ErrPopup = ({ err }) => {
    if (!err) return null;

    return (
        <div className="bg-red-500/20 text-red-300 text-sm px-3 py-2 rounded mb-3 text-center">
            {err}
        </div>
    );
};





let prevState = "";
let prevForm = "";

export default function Pushup() {
    const [reps, setReps] = useState(0);
    const [error, setError] = useState("");
    const [form, setForm] = useState("");
    const [message, setMessage] = useState("");

    const engineRef = useRef(null);

 
   

    function handlePose(landmarks) {

        if (!engineRef.current) {
            engineRef.current = createPushupEngine();
        }

        const result = engineRef.current(landmarks);

        if (prevState !== result.state) {
            switch (result.state) {
                case "NOT_READY":
                    setError("Step into frame");
                    break;
                case "READY":
                    setError("Start pushups");
                    break;
                case "DOWN":
                    setError("DOWN");
                    break;
                case "UP":
                    setError("UP");
                    break;
                case "REP_COMPLETE":
                    setError("Good");
                    break;
                default:
                    setError("");
            }
            prevState = result.state;
        }

        if (result.form !== prevForm) {
            setForm(result.form);
            prevForm = result.form;
        }

        if (result.state === "REP_COMPLETE") {
            setReps(result.reps);
        }
    }

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("You must be logged in first");
            return;
        }

        try {
            await axios.post(
                "https://backend10232002.ngrok.app/api/submit-score/",
                { score: parseInt(reps) },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage("Score submitted!");
            //setReps(0);
            navigate("/Leaderboard");
        } catch (err) {
            setMessage(
                "Error: " +
                (err.response?.data?.detail || "Could not submit score")
            );
        }
    };

    return (
        <div className="bg-black min-h-screen text-white flex justify-center">
            <div className="w-full max-w-[1000px]">

                {/* Navbar */}
                <div className="hidden md:block">
                <Navbar />
                </div>

                {/* Header */}
                <div className="text-center pt-6 pb-4">
                    <h1 className="text-2xl font-semibold tracking-tight">Pushups</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Real-time rep tracking
                    </p>
                </div>

                {/* Content */}
                <div className="px-4 grid md:grid-cols-2 gap-6">

                    {/* Camera Section */}
                    <div className="bg-zinc-900 rounded-xl p-3 flex flex-col items-center">
                        <Camera onPose={handlePose} />
                    </div>

                    {/* Stats Panel */}
                    <div className="flex flex-col justify-between">

                        {/* Rep Counter */}
                        <div className="bg-zinc-900 rounded-xl p-5 mb-4 text-center">
                            <p className="text-gray-400 text-sm mb-1">Reps</p>
                            <h2 className="text-4xl font-bold">{reps}</h2>
                        </div>

                        {/* Form Indicator */}
                        <div className="bg-zinc-900 rounded-xl p-5 mb-4 text-center">
                            <p className="text-gray-400 text-sm mb-1">Form</p>
                            <h2
                                className={`text-xl font-semibold ${form === "GOOD"
                                        ? "text-green-400"
                                        : form === "BAD"
                                            ? "text-red-400"
                                            : "text-gray-400"
                                    }`}
                            >
                                {form || "—"}
                            </h2>
                        </div>

                        {/* Error Message */}
                        <ErrPopup err={error} />

                        {/* Submit */}
                        <form onSubmit={handleSubmit} className="mt-4">
                            <button
                                type="submit"
                                className="w-full py-3 bg-white text-black rounded-lg font-medium hover:opacity-90 transition"
                            >
                                Submit Score
                            </button>
                        </form>

                        {/* Status Message */}
                        {message && (
                            <p className="text-center text-sm text-gray-400 mt-3">
                                {message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}