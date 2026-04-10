let state = "NOT_READY"
let confidence = 0


const BUILD = 1.5
const DECAY = 0.92
const THRESHOLD = 3

// ---------- HELPERS ----------

function visible(lm) {
    return lm.visibility === undefined || lm.visibility > 0.3
}

function inFrame(lm) {
    return [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]
        .every(i => visible(lm[i]))
}

function angle(a, b, c) {
    const radians =
        Math.atan2(c.y - b.y, c.x - b.x) -
        Math.atan2(a.y - b.y, a.x - b.x)

    let ang = Math.abs(radians * 180 / Math.PI)
    if (ang > 180) ang = 360 - ang
    return ang
}



// Mountain
function checkMountain(lm) {
    const feedback = []

    const left = angle(lm[11], lm[23], lm[27])
    const right = angle(lm[12], lm[24], lm[28])

    if (left < 160 || right < 160) {
        feedback.push("Stand up straight")
    }

    const armsDown =
        lm[15].y > lm[13].y &&
        lm[16].y > lm[14].y

    if (!armsDown) {
        feedback.push("Lower your arms")
    }

    const vertical =
        Math.abs(lm[11].x - lm[27].x) < 0.2 &&
        Math.abs(lm[12].x - lm[28].x) < 0.2

    if (!vertical) {
        feedback.push("Align your body vertically")
    }

    const notWide = 
        Math.abs(lm[27].x - lm[28].x) < 0.15

    if (!notWide) {
        feedback.push("Bring your feet closer together")
    }

    return {
        detected: feedback.length === 0,
        feedback
    }
}

// Tree 
function checkTree(lm) {
    const feedback = []

    const leftKnee = angle(lm[23], lm[25], lm[27])
    const rightKnee = angle(lm[24], lm[26], lm[28])

    const leftBent = leftKnee < 130
    const rightBent = rightKnee < 130

    const oneLegBent = leftBent !== rightBent

    if (!oneLegBent) {
        feedback.push("Bend one leg")
    }

    const footHigh =
        lm[27].y < lm[26].y ||
        lm[28].y < lm[25].y

    if (!footHigh) {
        feedback.push("Lift your foot higher")
    }

    const standingLegStraight =
        (leftBent && angle(lm[24], lm[26], lm[28]) > 160) ||
        (rightBent && angle(lm[23], lm[25], lm[27]) > 160)

    if (!standingLegStraight) {
        feedback.push("Keep your standing leg straight")
    }

    return {
        detected: oneLegBent && footHigh && standingLegStraight,
        feedback
    }
}

// Warrior
function checkWarrior(lm) {
    const feedback = []

    const stanceWide =
        Math.abs(lm[27].x - lm[28].x) > 0.18

    if (!stanceWide) {
        feedback.push("Step your feet wider apart")
    }

    const armsStraight =
        angle(lm[11], lm[13], lm[15]) > 160 &&
        angle(lm[12], lm[14], lm[16]) > 160

    if (!armsStraight) {
        feedback.push("Straighten your arms")
    }

    const armsLevel =
        Math.abs(lm[15].y - lm[11].y) < 0.12 &&
        Math.abs(lm[16].y - lm[12].y) < 0.12

    if (!armsLevel) {
        feedback.push("Raise your arms to shoulder height")
    }

    const notMountain = !checkMountain(lm).detected;

    return {
        detected: stanceWide && armsStraight && armsLevel && notMountain,
        feedback
    }
}
// Chair

function checkChair(lm) {
    const feedback = [];

    const kneeAngle =
        angle(lm[23], lm[25], lm[27]);

    const bent = kneeAngle < 130;

    if (!bent) feedback.push("Bend your knees more");

    const armsUp =
        lm[15].y < lm[11].y &&
        lm[16].y < lm[12].y;

    if (!armsUp) feedback.push("Raise your arms overhead");

    return {
        detected: bent && armsUp,
        feedback
    };
}

//Triangle

function checkTriangle(lm) {
    const feedback = [];

    const stanceWide =
        Math.abs(lm[27].x - lm[28].x) > 0.25;

    if (!stanceWide) {
        feedback.push("Step your feet wider apart");
    }

    const torsoTilt =
        Math.abs(lm[11].y - lm[23].y) > 0.08;

    if (!torsoTilt) {
        feedback.push("Lean your torso sideways");
    }

    const oneArmUp =
        lm[15].y < lm[11].y || lm[16].y < lm[12].y;

    const oneArmDown =
        lm[15].y > lm[23].y || lm[16].y > lm[24].y;

    if (!(oneArmUp && oneArmDown)) {
        feedback.push("Reach one arm up and one down");
    }

    return {
        detected: stanceWide && torsoTilt && oneArmUp && oneArmDown,
        feedback
    };
}

//Lunge

function checkLunge(lm) {
    const feedback = [];

    const leftKnee = angle(lm[23], lm[25], lm[27]);
    const rightKnee = angle(lm[24], lm[26], lm[28]);

    const leftBent = leftKnee < 120;
    const rightBent = rightKnee < 120;

    const oneBent = leftBent !== rightBent;

    if (!oneBent) {
        feedback.push("Bend one knee into a lunge");
    }

    const backLegStraight =
        (leftBent && rightKnee > 160) ||
        (rightBent && leftKnee > 160);

    if (!backLegStraight) {
        feedback.push("Keep your back leg straight");
    }

    const stanceWide =
        Math.abs(lm[27].x - lm[28].x) > 0.2;

    if (!stanceWide) {
        feedback.push("Step your feet further apart");
    }

    return {
        detected: oneBent && backLegStraight && stanceWide,
        feedback
    };
}

//Half Moon

function checkHalfMoon(lm) {
    const feedback = [];

    const leftLegLifted =
        lm[27].y < lm[23].y;

    const rightLegLifted =
        lm[28].y < lm[24].y;

    const oneLegLifted = leftLegLifted !== rightLegLifted;

    if (!oneLegLifted) {
        feedback.push("Lift one leg off the ground");
    }

    const standingLegStraight =
        (leftLegLifted && angle(lm[24], lm[26], lm[28]) > 160) ||
        (rightLegLifted && angle(lm[23], lm[25], lm[27]) > 160);

    if (!standingLegStraight) {
        feedback.push("Keep your standing leg straight");
    }

    const torsoTilt =
        Math.abs(lm[11].y - lm[23].y) > 0.1;

    if (!torsoTilt) {
        feedback.push("Tilt your torso sideways");
    }

    return {
        detected: oneLegLifted && standingLegStraight && torsoTilt,
        feedback
    };
}

//Pistol Squat

function checkPistol(lm) {
    const feedback = [];

    const leftKnee = angle(lm[23], lm[25], lm[27]);
    const rightKnee = angle(lm[24], lm[26], lm[28]);

    const leftDeep = leftKnee < 100;
    const rightDeep = rightKnee < 100;

    const oneLegSquat = leftDeep !== rightDeep;

    if (!oneLegSquat) {
        feedback.push("Squat down on one leg");
    }

    const otherLegForward =
        (leftDeep && lm[28].x > lm[24].x + 0.1) ||
        (rightDeep && lm[27].x > lm[23].x + 0.1);

    if (!otherLegForward) {
        feedback.push("Extend your other leg forward");
    }

    const balance =
        Math.abs(lm[11].x - lm[23].x) < 0.2;

    if (!balance) {
        feedback.push("Keep your balance centered");
    }

    return {
        detected: oneLegSquat && otherLegForward && balance,
        feedback
    };
}

//Warrior 3

function checkWarrior3(lm) {
    const feedback = [];

    const torsoFlat =
        Math.abs(lm[11].y - lm[23].y) < 0.05;

    if (!torsoFlat) feedback.push("Lean forward");

    const legLifted =
        lm[27].y < lm[23].y;

    if (!legLifted) feedback.push("Lift your back leg");

    return {
        detected: torsoFlat && legLifted,
        feedback
    };
}



// ---------- ENGINE ----------

export default function yogaEngine(landmarks, targetPose) {

    if (!landmarks || !inFrame(landmarks)) {
        state = "NOT_READY"
        confidence *= 0.8
        //return { state, detected: false, feedback: [] }
    }

    const checks = {
        Mountain: checkMountain(landmarks),
        Tree: checkTree(landmarks),
        Warrior: checkWarrior(landmarks),
        Chair: checkChair(landmarks),
        Triangle: checkTriangle(landmarks),
        Lunge: checkLunge(landmarks),
        Warrior3: checkWarrior3(landmarks),
        HalfMoon: checkHalfMoon(landmarks),
        Pistol: checkPistol(landmarks)
    };

    if (targetPose !== "Mountain") {
        checks.Mountain.detected = false;
    }

    const detectedPose = Object.entries(checks)
        .find(([_, val]) => val.detected)?.[0] || null;

    console.log({
        Mountain: checks.Mountain.detected,
        Tree: checks.Tree.detected,
        Warrior: checks.Warrior.detected,
        detectedPose,
        targetPose
    });

    const correct = detectedPose === targetPose;

    const result = checks[targetPose] || { detected: false, feedback: [] };

    //CONFIDENCE
    if (correct) {
        confidence += BUILD;
        confidence = Math.min(confidence, 10);
    } else {
        confidence *= DECAY; // ALWAYS decay if not correct
    }

    if (confidence < 0.01) confidence = 0;

    // STATE
    state = confidence >= THRESHOLD ? "HOLDING" : "SEARCHING";

    return {
        state,
        detectedPose,
        targetPose,
        confidence,
        feedback: result.feedback || []
    }
}