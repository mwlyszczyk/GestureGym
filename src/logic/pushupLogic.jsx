function calculateAngle(a, b, c) {
    const radians =
        Math.atan2(c.y - b.y, c.x - b.x) -
        Math.atan2(a.y - b.y, a.x - b.x);

    let angle = Math.abs((radians * 180) / Math.PI);

    if (angle > 180) {
        angle = 360 - angle;
    }

    return angle;
}

let stage = "up";
let reps = 0;

export default function pushupLogic(landmarks) {

    const shoulder = landmarks[11];
    const elbow = landmarks[13];
    const wrist = landmarks[15];

    const elbowAngle = calculateAngle(shoulder, elbow, wrist);

    // DOWN position
    if (elbowAngle < 90) {
        stage = "down";
    }

    // UP position
    if (elbowAngle > 160 && stage === "down") {
        stage = "up";
        reps++;
        return { repComplete: true, reps };
    }

    return { repComplete: false, reps };
}