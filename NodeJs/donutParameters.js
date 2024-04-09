let { Vector, iCap } = require("./Vector");

let pi = Math.PI;

let inRadius = 1;
let crossSectionRadius = 1;
let outRadius = inRadius + 2 * crossSectionRadius;
let curvedAxisRadius = inRadius + crossSectionRadius;

let circleCenter = iCap.scalerMultiply(curvedAxisRadius);

let mainAngle = 0;
let theta = mainAngle;

let localAngle = 0;
let phi = localAngle;

let phiMaxSample = 200;
let thetaMaxSample = 400;

let dPhi = (2 * pi) / phiMaxSample;
let dTheta = (2 * pi) / thetaMaxSample;

module.exports = {
    inRadius,
    crossSectionRadius,
    outRadius,
    curvedAxisRadius,
    circleCenter,
    theta,
    phi,
    thetaMaxSample,
    phiMaxSample,
    dPhi,
    dTheta,
};
