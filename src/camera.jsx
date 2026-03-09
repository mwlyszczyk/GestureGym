import { useEffect, useRef, useState } from "react";
import {
    FilesetResolver,
    HandLandmarker,
    PoseLandmarker,
} from "@mediapipe/tasks-vision";

export default function Camera({ onPose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [reps, setReps] = useState(0);
    const exerciseStateRef = useRef({});
    const lastVideoTimeRef = useRef(-1);

    useEffect(() => {
        let handLandmarker;
        let poseLandmarker;
        let animationFrameId;

        async function setup() {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );

            // HANDS
            handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
                },
                runningMode: "VIDEO",
                numHands: 2,
            });

            // POSE
            poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
                },
                runningMode: "VIDEO",
            });

            startCamera();
        }

        async function startCamera() {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });

            const video = videoRef.current;
            video.srcObject = stream;

            video.onloadedmetadata = () => {
                video.play();
                detect();
            };
        }

        function detect() {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (!video || video.readyState < 2) {
                animationFrameId = requestAnimationFrame(detect);
                return;
            }

            if (video.currentTime === lastVideoTimeRef.current) {
                animationFrameId = requestAnimationFrame(detect);
                return;
            }

            lastVideoTimeRef.current = video.currentTime;

            const ctx = canvas.getContext("2d");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const now = performance.now();

            const poseResults = poseLandmarker.detectForVideo(video, now);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (poseResults.landmarks && poseResults.landmarks.length > 0) {
                const landmarks = poseResults.landmarks[0];

                if (onPose) {
                    onPose(landmarks);
                }
                poseResults.landmarks[0].forEach((point) => {
                    ctx.beginPath();
                    ctx.arc(
                        point.x * canvas.width,
                        point.y * canvas.height,
                        4,
                        0,
                        2 * Math.PI
                    );
                    ctx.fillStyle = "cyan";
                    ctx.fill();
                });
            }

            animationFrameId = requestAnimationFrame(detect);
        }


        setup();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                maxWidth: "600px",
            }}
        >
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                    width: "100%",
                    transform: "scaleX(-1)", // mirror front camera
                }}
            />

            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    transform: "scaleX(-1)", // mirror overlay
                }}
            />
        </div>
    );
}