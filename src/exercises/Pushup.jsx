import { useState } from "react";
import Camera from "../camera.jsx";
import pushupEngine from "../logic/pushupLogic.jsx";

const ErrPopup = ({ err }) => {
    if (!err) return null;

    return (
        <div>
            <h2>{err}</h2>
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

    function handlePose(landmarks) {
        const result = pushupEngine(landmarks);
        if (prevState !== result.state) {
            switch (result.state) {

                case "NOT_READY":
                    setError("Step into frame");
                    prevState = result.state;
                    break;

                case "READY":
                    setError("Start pushups");
                    prevState = result.state;
                    break;

                case "DOWN":
                    setError("DOWN");
                    prevState = result.state;
                    break;

                case "UP":
                    setError("UP");
                    prevState = result.state;
                    break;

                case "REP_COMPLETE":
                    setError("Good");
                    prevState = result.state;
                    break;


                default:
                    setError("");
            }
        }

        if (result.form === "BAD" && prevForm != result.form) {
            setForm("BAD");
        } else if (result.form === "GOOD" && prevForm != result.form) {
            setForm("GOOD")
        }

        if (result.state === "REP_COMPLETE") {
            setReps(result.reps);
        }

        
    }

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
                { score: parseInt(reps) },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage("Score submitted!");
            setReps("");
        } catch (err) {
            console.log(err.response);
            alert(JSON.stringify(err.response?.data));
            setMessage(
                "Error: " +
                (err.response?.data?.detail || "Could not submit score")
            );
        }
    };

    return (
        <div>
            <h2>Pushups</h2>
            <h3>Reps: {reps}</h3>

            <ErrPopup err={error} />

            <h2>Form: {form}</h2>

            <Camera onPose={handlePose} />

            <form onSubmit={handleSubmit}>
            <button type="submit" style={{ padding: "10px 20px" }}>
                Submit Score
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}