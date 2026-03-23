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

    return (
        <div>
            <h2>Pushups</h2>
            <h3>Reps: {reps}</h3>

            <ErrPopup err={error} />

            <h2>Form: {form}</h2>

            <Camera onPose={handlePose} />
        </div>
    );
}