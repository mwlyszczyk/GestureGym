let state = "NOT_READY"
let reps = 0
let form = "GOOD"

let smoothedLeft = 180
let smoothedRight = 180

const SMOOTHING = 0.5

const DOWN_ANGLE = 105
const UP_ANGLE = 150


let downFrames = 0
let upFrames = 0
const REQUIRED_FRAMES = 3

//Is user in frame?


function visible(lm) {
    return lm.visibility === undefined || lm.visibility > 0.3
}

function userInFrame(lm) {
  const required = [11,13,15,12,14,16]; // arms only
  return required.every(i => visible(lm[i]));
}

//find angle of line a,b,c
function angle(a, b, c) {
    const radians =
        Math.atan2(c.y - b.y, c.x - b.x) -
        Math.atan2(a.y - b.y, a.x - b.x)

    let ang = Math.abs(radians * 180 / Math.PI)

    if (ang > 180) ang = 360 - ang

    return ang
}


//avoids mediaPipe jitters
function smooth(prev, current) {
    return prev * SMOOTHING + current * (1 - SMOOTHING)
}


//prevents cheating by standing up
function bodyHorizontal(lm) {

    const shoulderY = (lm[11].y + lm[12].y) / 2
    const hipY = (lm[23].y + lm[24].y) / 2

    return Math.abs(shoulderY - hipY) < 0.15
}


//threshold for rep to count
function goodDepth(leftAngle, rightAngle) {
    return (
    (leftAngle < 105 && rightAngle < 115) ||
        (rightAngle < 105 && leftAngle < 115)
    )
}


export default function pushupEngine(landmarks) {

    form = bodyHorizontal(landmarks) ? "GOOD" : "BAD"

    if (!landmarks || landmarks.length === 0) {
        state = "NOT_READY"
        return { state, reps, form }
    }

    if (!userInFrame(landmarks)) {
        if (state === "NOT_READY" || state === "READY") {
            state = "NOT_READY"
        }
        return { state, reps, form }
    }


    const leftAngle = angle(
        landmarks[11],
        landmarks[13],
        landmarks[15]
    )

    const rightAngle = angle(
        landmarks[12],
        landmarks[14],
        landmarks[16]
    )

    smoothedLeft = smooth(smoothedLeft, leftAngle)
    smoothedRight = smooth(smoothedRight, rightAngle)

    const avgAngle = (smoothedLeft + smoothedRight) / 2

    if (avgAngle < DOWN_ANGLE) {
        downFrames++
    } else {
        downFrames = 0
    }

    if (avgAngle > UP_ANGLE) {
        upFrames++
    } else {
        upFrames = 0
    }
    // READY detection
    if (upFrames >= REQUIRED_FRAMES && state === "NOT_READY") {
        state = "READY"
    }

    // Going down
    if (downFrames >= REQUIRED_FRAMES && state === "READY") {
        state = "DOWN"
    }

    // Coming back up (rep complete)
    if (upFrames >= REQUIRED_FRAMES && state === "DOWN") {
        reps++
        state = "READY"
        return { state: "REP_COMPLETE", reps }
    }
    return { state, reps, form }
}