import { useEffect, useRef } from "react";
import {
    FilesetResolver,
    FaceLandmarker,
} from "@mediapipe/tasks-vision";

export default function FaceMeshCamera() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        let faceLandmarker;
        let animationFrameId;

        async function setup() {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );

            faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                },
                outputFaceBlendshapes: false,
                runningMode: "VIDEO",
                numFaces: 1,
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
            const ctx = canvas.getContext("2d");

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const now = performance.now();
            const results = faceLandmarker.detectForVideo(video, now);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (results.faceLandmarks) {
                for (const landmarks of results.faceLandmarks) {
                    for (const point of landmarks) {
                        ctx.beginPath();
                        ctx.arc(
                            point.x * canvas.width,
                            point.y * canvas.height,
                            2,
                            0,
                            2 * Math.PI
                        );
                        ctx.fillStyle = "lime";
                        ctx.fill();
                    }
                }
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
                maxWidth: "500px",
            }}
        >
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                    width: "100%",
                    transform: "scaleX(-1)",
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
                    transform: "scaleX(-1)",
                }}
            />
        </div>
    );
}