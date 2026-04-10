import { useState, useRef, useEffect } from "react";
import Camera from "../camera.jsx";
import yogaEngine from "../logic/yogaLogic.jsx";


const levels = {
    beginner: ["Mountain", "Tree", "Warrior"],
    intermediate: ["Chair", "Triangle", "Lunge"],
    advanced: ["Warrior3", "HalfMoon", "Pistol"]
};

//const flow = ["Mountain", "Warrior", "Tree"];

export default function Yoga() {

    const [step, setStep] = useState(0);
    const [state, setState] = useState("");
    const [detected, setDetected] = useState("");
    const [time, setTime] = useState(0);
    const [confidence, setConfidence] = useState(0)
    const [feedback, setFeedback] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [locked, setLocked] = useState(false);
    const [debug, setDebug] = useState({});
    const [level, setLevel] = useState("beginner");
    
    


    const startRef = useRef(null);
    const lockedRef = useRef(false);
    
    

    const targetPose = levels[level][step];

    const targetPoseRef = useRef(targetPose);

    function nextPose() {
        if (step < levels[level].length - 1) {
            setStep(step + 1);
        } else {
            // move to next level
            if (level === "beginner") {
                setLevel("intermediate");
            } else if (level === "intermediate") {
                setLevel("advanced");
            }
            else if (level === "advanced") {
                setStep(9);
                return;
            }

            setStep(0);
        }
    }

    const poseDifficulty = {
        Mountain: "easy",
        Tree: "easy",
        Warrior: "easy",

        Chair: "medium",
        Triangle: "medium",
        Lunge: "medium",

        Warrior3: "hard",
        HalfMoon: "hard",
        Pistol: "hard"
    };

    useEffect(() => {
        targetPoseRef.current = targetPose;
    }, [targetPose]);

    function handlePose(landmarks) {
        const currentTarget = targetPoseRef.current;
        const difficulty = poseDifficulty[currentTarget];

        const result = yogaEngine(landmarks, currentTarget);

        setCompleted(true);

        setState(result.state);
        setDetected(result.detectedPose);
        setConfidence(result.confidence);
        setFeedback(result.feedback);

        setDebug({
            detectedPose: result.detectedPose,
            ref: targetPoseRef.current,
            targetPose: result.targetPose,
            confidence: result.confidence,
            state: result.state,
            feedback: result.feedback

        });
       

        const isLocked = lockedRef.current;

        // 1. LOST POSE
        if (isLocked && result.state !== "HOLDING") {
            console.log("LOST POSE");

            lockedRef.current = false;
            setLocked(false);

            startRef.current = null;
            setTime(0);
        }

        // 2. LOCK POSE
        if (!isLocked && result.state === "HOLDING") {
            console.log("LOCKED");

            lockedRef.current = true;
            setLocked(true);

            startRef.current = Date.now();
        }

        // 3. TIMER
        if (lockedRef.current && startRef.current) {
            const duration = Math.floor(
                (Date.now() - startRef.current) / 1000
            );

            setTime(duration);

            if (duration >= 30 && !completed) {
                console.log("COMPLETED");
                setCompleted(true);
            }
        }
    }

   if (step === 9) {
        return <h2>Workout Complete</h2>;
   }

    

    return (
        <div>
            <h2>Yoga Trainer</h2>

            <h3>Target Pose: {targetPose}</h3>
            <h3>Detected Pose: {detected || "None"}</h3>

            <h3>State: {state}</h3>
            <h3>Hold Time: {time}s</h3>

            <h3>Status:
                {!locked && "Get into position"}
                {locked && !completed && "Hold the pose..."}
                {completed && "Pose Complete "}
            </h3>

            {/*netx pose button*/}
            {completed && (
                <button
                    onClick={() => {
                        nextPose();

                        // reset state
                        setLocked(false);
                        setCompleted(false);
                        setTime(0);
                        startRef.current = null;
                    }}
                >
                    Next Pose
                </button>
            )}

            <p>{completed ? "You can move on whenever you're ready" : `${5 - time}s remaining`}</p>

            {/* feedback to improve form 

            {feedback && feedback.length > 0 && (
                <div style={{
                    background: "black",
                    color: "white",
                    padding: "10px",
                    marginTop: "10px"
                }}>
                    <h4>Fix your form:</h4>
                    {feedback.map((f, i) => (
                        <p key={i}>• {f}</p>
                    ))}
                </div>
            )} 
            */}
            

            {/* confidence bar */}

            <div style={{
                width: "100%",
                height: "20px",
                background: "gray"
            }}>
                <div style={{
                    width: `${Math.min(confidence * 25, 100)}%`,
                    height: "100%",
                    background: "green"
                }} />
            </div>

            <Camera onPose={handlePose} />

             <div style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                background: "black",
                color: "lime",
                padding: "10px",
                fontSize: "12px",
                zIndex: 9999
            }}>
                <div>State: {debug.state}</div>
                <div>Detected: {debug.detectedPose}</div>
                <div>Ref: {debug.ref}</div>
                <div>Target: {debug.targetPose}</div>
                <div>Confidence: {debug.confidence?.toFixed(2)}</div>

                <div>Feedback:</div>
                {debug.feedback?.map((f, i) => (
                    <div key={i}>• {f}</div>
                ))}
            </div>
            
        </div>
    );
}