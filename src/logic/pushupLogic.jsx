// helper functions (stay OUTSIDE)
function visible(lm) {
    return lm.visibility === undefined || lm.visibility > 0.3;
}

function userInFrame(lm) {
    const required = [11, 13, 15, 12, 14, 16];
    return required.every(i => visible(lm[i]));
}

function angle(a, b, c) {
    const radians =
        Math.atan2(c.y - b.y, c.x - b.x) -
        Math.atan2(a.y - b.y, a.x - b.x);

    let ang = Math.abs((radians * 180) / Math.PI);
    if (ang > 180) ang = 360 - ang;

    return ang;
}

function smooth(prev, current) {
    const SMOOTHING = 0.5;
    return prev * SMOOTHING + current * (1 - SMOOTHING);
}

function bodyHorizontal(lm) {
    const shoulderY = (lm[11].y + lm[12].y) / 2;
    const hipY = (lm[23].y + lm[24].y) / 2;
    return Math.abs(shoulderY - hipY) < 0.15;
}

export default function createPushupEngine() {
    let state = "NOT_READY"
    let reps = 0
    let form = "GOOD"

    let smoothedLeft = 180
    let smoothedRight = 180

    let downFrames = 0
    let upFrames = 0

    const DOWN_ANGLE = 105
    const UP_ANGLE = 150
    const REQUIRED_FRAMES = 3


    return function pushupEngine(landmarks) {
        

        if (!landmarks || landmarks.length === 0) {
            state = "NOT_READY"
            return { state, reps, form }
        }

        form = bodyHorizontal(landmarks) ? "GOOD" : "BAD"

        if (!userInFrame(landmarks)) {
            if (state === "NOT_READY" || state === "READY") {
                state = "NOT_READY"
            }
            return { state, reps, form }
        }

        const leftAngle = angle(landmarks[11], landmarks[13], landmarks[15])
        const rightAngle = angle(landmarks[12], landmarks[14], landmarks[16])

        smoothedLeft = smooth(smoothedLeft, leftAngle)
        smoothedRight = smooth(smoothedRight, rightAngle)

        const avgAngle = (smoothedLeft + smoothedRight) / 2

        if (avgAngle < DOWN_ANGLE) downFrames++
        else downFrames = 0

        if (avgAngle > UP_ANGLE) upFrames++
        else upFrames = 0

        if (upFrames >= REQUIRED_FRAMES && state === "NOT_READY") {
            state = "READY"
        }

        if (downFrames >= REQUIRED_FRAMES && state === "READY") {
            state = "DOWN"
        }

        if (upFrames >= REQUIRED_FRAMES && state === "DOWN") {
            reps++
            state = "READY"
            return { state: "REP_COMPLETE", reps, form }
        }

        return { state, reps, form }
    }
}