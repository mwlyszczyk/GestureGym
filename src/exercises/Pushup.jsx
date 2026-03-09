import { useState } from "react";
import Camera from "../camera.jsx";
import pushupLogic from "../logic/pushupLogic.jsx";


export default function Pushup() {

    const [reps, setReps] = useState(0);

    function handlePose(landmarks) {
        const result = pushupLogic(landmarks);

        if (result.repComplete) {
            setReps(result.reps);
        }
    };

    return (
        <div>
            <h2>Pushups</h2>
            <h3>Reps: {reps}</h3>

            <Camera onPose={handlePose} />
        </div>
    );
}