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
    const [phase, setPhase] = useState("POSE");
    const [transitionStart, setTransitionStart] = useState();
    const [holdTimeReached, setHoldTimeReached] = useState(false);
    
    
        
    


    const startRef = useRef(null);
    const lockedRef = useRef(false);
    const lostFramesRef = useRef(0);
    
    

    const targetPose = levels[level][step];
    const next = 
        step < levels[level].length - 1
            ? levels[level][step + 1]
            : null;

    const targetPoseRef = useRef(targetPose);
    const nextRef = useRef(next);

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

    const transitions = {
        Mountain: "Lift one foot for Tree pose",
        Tree: "Step back into Warrior",
        Warrior: "Stand tall for next pose"
    };

    useEffect(() => {
        targetPoseRef.current = targetPose;
    }, [targetPose]);

    // Transition functions

    function movingToTree(lm) {
        return (
            lm[27].y < lm[26].y || // foot lifting
            lm[28].y < lm[25].y
        );
    }

    function movingToWarrior(lm) {
        return Math.abs(lm[27].x - lm[28].x) > 0.2; // feet spreading
    }

    function movingToChair(lm) {
        return (
            lm[25].y > lm[23].y || // knees bending
            lm[26].y > lm[24].y
        );
    }


    function handlePose(landmarks) {
        const currentTarget = targetPoseRef.current;
        const difficulty = poseDifficulty[currentTarget];

        const result = yogaEngine(landmarks, currentTarget);

        

       

        setState(result.state);
        setDetected(result.detectedPose);
        setConfidence(result.confidence);
        setFeedback(result.feedback);

        

        const isLocked = lockedRef.current;

        //Transitions

        const transitionChecks = {
            Mountain: movingToTree,
            Tree: movingToWarrior,
            Warrior: movingToChair
        };

        if (phase === "TRANSITION") {
            const elapsed = Date.now() - transitionStart;

            const moveCheck = transitionChecks[currentTarget];

            const moving = moveCheck ? moveCheck(landmarks) : false;

            // allow early transition if movement detected
            if ((elapsed > 1000 && moving) || elapsed > 2500) {
                nextPose();
                setPhase("POSE");

                // reset tracking for next pose
                lockedRef.current = false;
                setLocked(false);
                setCompleted(false);
                setTime(0);
                startRef.current = null;
            }

            return;
        }

        

        // 1. LOST POSE
        if (result.state !== "HOLDING") {
            lostFramesRef.current++;
        } else {
            lostFramesRef.current = 0;
        }

        if (isLocked && lostFramesRef.current > 10) {
            console.log("LOST POSE");

            lockedRef.current = false;
            setLocked(false);

            startRef.current = null;
            setTime(0);
        }

        // 2. LOCK POSE
        if (!isLocked.current && result.state === "HOLDING") {
            console.log("LOCKED");

            lockedRef.current = true;
            setLocked(true);

            startRef.current = Date.now();
        }

        // 3. TIMER
        if (lockedRef.current && startRef.current !== null) {
            const duration = Math.floor(
                (Date.now() - startRef.current) / 1000
            );

            console.log("TIMER RUNNING:", duration);

            setTime(duration);

            if (duration >= 10 && !completed) {
                console.log("COMPLETED");

                setCompleted(true);
                setPhase("TRANSITION");
                setTransitionStart(Date.now());

                return;
            }
        }

        setDebug({
            detectedPose: result.detectedPose,
            ref: targetPoseRef.current,
            targetPose: result.targetPose,
            confidence: result.confidence,
            state: result.state,
            locked: lockedRef.current,
            phase,
            completed,
            feedback: result.feedback,
            time


        });


        
    }

   if (step === 9) {
        return <h2>Workout Complete</h2>;
   }

    

    return (
        <div>
            <h2>Yoga Trainer</h2>

            <h3>Target Pose: {targetPose}</h3>
            <h3>Detected Pose: {detected || "None"}</h3>

            {/*<h3>State: {state}</h3>*/}
            <h3>Hold Time: {time}s</h3>

            <h3>Phase: {phase}</h3>
            <h3>completed: {completed ? "true":"false"}</h3>

            {/* <h3>Status:
                {!locked && "Get into position"}
                {locked && !completed && "Hold the pose..."}
                {completed && "Pose Complete "}
            </h3>*/}

            {/*netx pose button
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

            */}

            {/* <p>{completed ? "You can move on whenever you're ready" : `${5 - time}s remaining`}</p> */}

            {/*  feedback to improve form 

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

            {/*transition instruction*/}

            {phase === "TRANSITION" && (
                <h2>{transitions[targetPose] || `Move to ${next}`}</h2>
            )}
            

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
               {/* <div>Detected: {debug.detectedPose}</div>
                <div>Ref: {debug.ref}</div> */}
                <div>Target: {debug.targetPose}</div>
                {/* <div>Confidence: {debug.confidence?.toFixed(2)}</div> */}
                <div>Locked: {debug.locked ? "true":"false"}</div>
                <div>Phase: {debug.phase}</div>
                <div>completed: {debug.completed ? "true":"false"}</div>
                <div>Duration: {debug.time}</div>

                
                {/*  {debug.feedback?.map((f, i) => (
                    <div key={i}>• {f}</div>
                ))} */}


        </div>
            
            
        </div>
    );
}