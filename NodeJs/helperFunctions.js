function printGrid(board) {
    board.forEach((row) => {
        let temp = [];
        row.forEach((element) => {
            temp.push(element + element);
        });
        console.log(temp.join(""));
    });
}

function fillGrid(board, fillChar) {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            board[y][x] = fillChar;
        }
    }
}

function getReflectedRay(lightRay, mirrorNormal) {
    componentOfLightNormalToMirror = lightRay.dot(mirrorNormal);
    return lightRay.subtract(
        mirrorNormal.scalerMultiply(componentOfLightNormalToMirror * 2)
    );
}

function clearScreen() {
    _ = process.stdout.write("\033c");
}

//

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { printGrid, fillGrid, getReflectedRay, clearScreen, sleep };
