let { Vector, iCap, jCap, kCap } = require("./Vector.js");
let { Matrix, rotMatX, rotMatY, rotMatZ } = require("./Matrix.js");

const assert = require("assert");

let {
    clearScreen,
    sleep,
    printGrid,
    fillGrid,
    getReflectedRay,
} = require("./helperFunctions.js");

let {
    lightSource,
    sightDirectionUnit,
    asciiLuminocity,
    resolution,
    BLANK_CHAR,
    boardHeight,
    boardWidth,
    board,
    zBuffer,
    zOffSet,
    eyeDistance,
    magnificationAmount,
    getAsciiLongIndex,
} = require("./screenParameters.js");

let {
    inRadius,
    outRadius,
    crossSectionRadius,
    curvedAxisRadius,
    circleCenter,
    theta,
    phi,
    phiMaxSample,
    thetaMaxSample,
    dPhi,
    dTheta,
} = require("./donutParameters.js");

let floor = Math.floor;
let sin = Math.sin;
let cos = Math.cos;
let pi = Math.PI;

let print = console.log;

//

alternate = 0;
let dYRot = 0.1;

async function main() {
    for (let yRot = 0; true || yRot < 10 * pi; yRot += dYRot) {
        // yRot = 0;
        let zRot = yRot / 3;
        let tempz = rotMatZ(zRot, cos(zRot), sin(zRot));
        let tempy = rotMatY(yRot, cos(yRot), sin(yRot));

        let rotMatProdYZ = tempz.multiply_MatMat(tempy);

        rotMatProdYZ.assertUnitDet();

        // for the donut
        let phiCount;
        for (phi = 0, phiCount = 0; phi < 2 * pi; phi += dPhi, phiCount += 1) {
            // print("inside phi");
            let sinPhi = sin(phi);
            let cosPhi = cos(phi);

            let circlePoint = circleCenter.add(
                new Vector(cosPhi, 0, sinPhi).scalerMultiply(crossSectionRadius)
            );

            let floatingRadius = circlePoint.x;
            // print("floatingRadius", floatingRadius);
            let circleNormalUnit = circlePoint
                .subtract(circleCenter)
                .unitVector();

            // dTheta = (2 * pi) / ((thetaMaxSample * floatingRadius) / outRadius);
            let thetaCount;
            for (
                theta = 0, thetaCount = 0;
                theta < 2 * pi;
                theta += dTheta, thetaCount += 1
            ) {
                // print("inside theta");
                let cosTheta = cos(theta);
                let sinTheta = sin(theta);

                let rotMatProd = rotMatProdYZ.multiply_MatMat(
                    rotMatZ(theta, cosTheta, sinTheta)
                );

                let donutNormalUnit =
                    rotMatProd.multiply_MatVec(circleNormalUnit);
                let donutPoint = rotMatProd
                    .multiply_MatVec(circlePoint)
                    .add(kCap.scalerMultiply(zOffSet));

                let lightRayUnit = donutPoint
                    .subtract(lightSource)
                    .unitVector();

                let reflectedRayUnit = getReflectedRay(
                    lightRayUnit,
                    donutNormalUnit
                );
                reflectedRayUnit.assertUnit();

                let brightnessIndex1 =
                    (-donutNormalUnit.dot(sightDirectionUnit) - 0.001) *
                    asciiLuminocity.length;
                let brightnessIndex2 =
                    (reflectedRayUnit.dot(sightDirectionUnit.negative()) -
                        0.001) *
                    asciiLuminocity.length;

                // let brightnessIndex = (brightnessIndex1 + brightnessIndex2) / 2;
                let brightnessIndex = brightnessIndex1;
                // let brightnessIndex = brightnessIndex2;

                // brightnessIndex =
                //     (-lightRayUnit.dot(donutNormalUnit) - 0.001) *
                //     asciiLuminocity.length;

                assert(brightnessIndex < asciiLuminocity.length);

                // print("brightnessIndex", brightnessIndex);
                brightnessIndex = Math.floor(brightnessIndex * 0.8);
                if (brightnessIndex < 0) {
                    brightnessIndex = 0;
                }
                donutPoint.inPlaceMagnify(magnificationAmount);
                donutPoint.inPlaceProjectionScaling(eyeDistance);

                ix = floor((donutPoint.x + outRadius) * resolution);
                iy = floor((donutPoint.y + outRadius) * resolution);
                iz = floor((donutPoint.z + outRadius) * resolution);
                if (iy < boardHeight && ix < boardWidth && iy >= 0 && ix >= 0) {
                    // within bounds

                    if (zBuffer[iy][ix] > iz) {
                        // print("filling ascii to board");
                        // board[iy][ix] =
                        //     asciiLuminocity[asciiLuminocity.length - 1];
                        board[iy][ix] = asciiLuminocity[brightnessIndex];
                        // board[iy][ix] =
                        //     asciiLuminocity[
                        //         getAsciiLongIndex(
                        //             brightnessIndex / asciiLuminocity.length
                        //         )
                        //     ];
                        zBuffer[iy][ix] = iz;
                    }
                }
            } // end theta
        } // end phi
        // throw "err";
        clearScreen();
        // print(yRot);
        printGrid(board);
        print("yRot zRot", yRot, zRot);
        // printGrid(zBuffer);
        fillGrid(board, BLANK_CHAR);
        fillGrid(zBuffer, 100000);
        // await sleep(50);
    } // end yrot
} // end main

// used to prevent screen tearing when we Ctrl+C out of the program
async function main2() {
    try {
        await main();
    } catch (err) {
        clearScreen();
        printGrid(board);
        throw err;
    }
}
main2();
