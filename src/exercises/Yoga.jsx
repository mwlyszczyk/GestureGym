import { useState, useRef, useEffect } from "react";
import Camera from "../camera.jsx";
import yogaEngine from "../logic/yogaLogic.jsx";
import Navbar from "../components/Navbar";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const flow = [
    "Mountain",
    "Tree",
    "Warrior",
    "Chair",
    "Triangle",
    "Lunge",
    "Warrior3",
    "HalfMoon",
    "Pistol"
];

export default function Yoga() {
    const [step, setStep] = useState(0);
    const [state, setState] = useState("");
    const [detected, setDetected] = useState("");
    const [time, setTime] = useState(0);
    const [confidence, setConfidence] = useState(0);
    const [feedback, setFeedback] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [locked, setLocked] = useState(false);
    const [level, setLevel] = useState("beginner");
    const [phase, setPhase] = useState("POSE");

    const startRef = useRef(null);
    const lockedRef = useRef(false);
    const lostFramesRef = useRef(0);
    const completedRef = useRef(false);
    const phaseRef = useRef("POSE");
    const transitionStartRef = useRef(null);
    const targetPoseRef = useRef(flow[0]);

    const targetPose = flow[step];
    const next = step < flow.length - 1 ? flow[step + 1] : null;

    function nextPose() {
        setStep(prev => {
            const nextStep = prev + 1;

            if (nextStep >= flow.length) {
                setPhase("DONE");
                return prev;
            }
            return nextStep < flow.length ? nextStep : prev;
        });
    }

    

    useEffect(() => {
        targetPoseRef.current = flow[step];
    }, [step]);

    function handlePose(landmarks) {

        // HANDLE TRANSITION PHASE
        if (phaseRef.current === "TRANSITION") {
            const elapsed = Date.now() - transitionStartRef.current;

            if (elapsed > 1500) {
                // Move to next pose
                nextPose();

                // Reset everything
                phaseRef.current = "POSE";
                setPhase("POSE");

                lockedRef.current = false;
                setLocked(false);

                completedRef.current = false;
                setCompleted(false);

                setTime(0);
                startRef.current = null;
                transitionStartRef.current = null;

                setConfidence(0);

                return; // IMPORTANT: stop further processing
            }

            return; // still transitioning, do nothing else
        }

        const result = yogaEngine(landmarks, targetPoseRef.current);

        setState(result.state);
        setDetected(result.detectedPose);
        setConfidence(result.confidence);
        setFeedback(result.feedback);

        // LOST POSE
        if (result.state !== "HOLDING") {
            lostFramesRef.current++;
        } else {
            lostFramesRef.current = 0;
        }

        if (lockedRef.current && lostFramesRef.current > 10) {
            lockedRef.current = false;
            setLocked(false);
            startRef.current = null;
            setTime(0);
        }

        // LOCK POSE
        if (!lockedRef.current && result.state === "HOLDING") {
            lockedRef.current = true;
            startRef.current = Date.now();
            setLocked(true);
        }

        // TIMER
        if (lockedRef.current && startRef.current) {
            const duration = Math.floor(
                (Date.now() - startRef.current) / 1000
            );

            setTime(duration);

            if (duration >= 10 && !completedRef.current) {
                completedRef.current = true;
                setCompleted(true);

                phaseRef.current = "TRANSITION";
                setPhase("TRANSITION");

                transitionStartRef.current = Date.now();
            }
        }
    }

    return (
        <div className="bg-black min-h-screen text-white flex justify-center">
            <div className="w-full max-w-[1100px]">

                {/* Navbar */}
                <Navbar />

                {/* <button onClick={() => {
                    nextPose();
                } }>Next pose</button> */}

                {/* Header */}
                <div className="text-center pt-6 pb-4">
                    <h1 className="text-2xl font-semibold">Yoga Trainer</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Follow guided poses and hold for 10 seconds
                    </p>
                </div>

                {/* Layout */}
                <div className="px-4 grid md:grid-cols-2 gap-6">

                    {/* Camera */}
                    <div className="bg-zinc-900 rounded-xl p-3 flex items-center justify-center">
                        <Camera onPose={handlePose} />
                    </div>

                    {/* Info Panel */}
                    <div className="flex flex-col gap-4">

                        {/* Current Pose */}
                        <div className="bg-zinc-900 rounded-xl p-5 text-center">
                            <p className="text-gray-400 text-sm">Target Pose</p>
                            <h2 className="text-xl font-semibold">{targetPose}</h2>

                            <p className="text-gray-500 text-xs mt-2">
                                Detected: {detected || "None"}
                            </p>
                        </div>

                        {/* Timer */}
                        <div className="bg-zinc-900 rounded-xl p-5 text-center">
                            <p className="text-gray-400 text-sm">Hold Time</p>
                            <h2 className="text-3xl font-bold">{time}s</h2>
                        </div>

                        {/* Status */}
                        <div className="bg-zinc-900 rounded-xl p-5 text-center">
                            <p className="text-gray-400 text-sm">Status</p>
                            <h2 className="text-sm">
                                {!locked && "Get into position"}
                                {locked && !completed && "Hold steady..."}
                                {completed && "Pose complete"}
                            </h2>
                        </div>

                        {/* Transition */}
                        {phase === "TRANSITION" && (
                            <div className="bg-yellow-400/20 text-yellow-300 text-sm px-4 py-3 rounded text-center">
                                Move to {next || "next pose"}
                            </div>
                        )}

                        {/* Feedback */}
                        {feedback.length > 0 && (
                            <div className="bg-red-500/20 text-red-300 text-sm px-4 py-3 rounded">
                                <p className="mb-2 font-medium">Fix your form:</p>
                                {feedback.map((f, i) => (
                                    <p key={i}>• {f}</p>
                                ))}
                            </div>
                        )}

                        {/* Confidence Bar */}
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Confidence</p>
                            <div className="w-full h-2 bg-gray-800 rounded">
                                <div
                                    className="h-full bg-green-400 rounded transition-all"
                                    style={{ width: `${Math.min(confidence * 25, 100)}%` }}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {phase === "DONE" && (
                <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
                    <div className="bg-zinc-900 p-8 rounded-xl text-center max-w-md w-full">

                        <h1 className="text-3xl font-bold text-green-400 mb-2">
                            Workout Complete 
                        </h1>

                        <p className="text-gray-400 text-sm mb-6">
                            Great job! You've finished the guided yoga section.
                        </p>

                        <div className="space-y-2 text-sm text-gray-300 mb-6">
                            <p>Time held last pose: {time}s</p>
                            <p>Confidence: {Math.round(confidence * 100)}%</p>
                        </div>
                        <div className = "flex gap-4 justify-center">
                        <button
                            onClick={() => {
                                setStep(0);
                                setPhase("POSE");
                                setCompleted(false);
                                setLocked(false);
                                setTime(0);
                                setConfidence(0);
                                setFeedback([]);
                                lockedRef.current = false;
                                completedRef.current = false;
                                phaseRef.current = "POSE";
                            }}
                            className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-lg font-semibold"
                        >
                            Restart Workout
                        </button>
                        
                            <Link to="/"><button className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-lg font-semibold">Home</button></Link>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}