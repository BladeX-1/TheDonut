let { Vector } = require("./Vector");

class Matrix {
    constructor(row1, row2, row3) {
        this.matrix = [row1, row2, row3];
        this.setRows();
    }

    setRows() {
        this.row1 = this.matrix[0];
        this.row2 = this.matrix[1];
        this.row3 = this.matrix[2];
    }

    multiply_MatVec(v) {
        let aList = [];
        let temp = 0;
        for (let maty = 0; maty < 3; maty++) {
            temp = 0;
            for (let matx = 0; matx < 3; matx++) {
                temp += this.matrix[maty][matx] * v.vector[matx];
            }

            aList.push(temp);
        }

        return new Vector(...aList);
    }

    multiply_MatMat(m) {
        // console.log("m", m);
        let cols = [];
        let row = [];
        let temp = 0;

        for (let ansy = 0; ansy < 3; ansy++) {
            row = [];
            for (let ansx = 0; ansx < 3; ansx++) {
                temp = 0;
                for (let i = 0; i < 3; i++) {
                    temp += this.matrix[ansy][i] * m.matrix[i][ansx];
                }
                row.push(temp);
            }
            cols.push(row);
        }

        return new Matrix(...cols);
    }

    det() {
        let temp = 0;

        for (let x = 0; x < 3; x++) {
            let tempPlus = 1;
            let tempMinus = 1;
            for (let i = 0; i < 3; i++) {
                tempPlus *= this.matrix[i][(x + i) % 3];
                tempMinus *= this.matrix[i][(x - i + 3) % 3];
            }
            temp += tempPlus - tempMinus;
        }
        return temp;
    }
    assertUnitDet() {
        let myDet = this.det();
        let statement =
            "determinant is NOT EQUAL to 1, and instead EQUAL TO " + myDet;
        if (myDet < 0.95 || myDet > 1.05) {
            throw statement;
        }
    }
}

function rotMatX(angle, cosAngle = null, sinAngle = null) {
    if (sinAngle === null) {
        cosAngle = Math.cos(angle);
        sinAngle = Math.sin(angle);
    }

    return new Matrix(
        [1, 0, 0],
        [0, cosAngle, -sinAngle],
        [0, sinAngle, cosAngle]
    );
}

function rotMatY(angle, cosAngle = null, sinAngle = null) {
    if (sinAngle === null) {
        cosAngle = Math.cos(angle);
        sinAngle = Math.sin(angle);
    }

    return new Matrix(
        ...[
            [cosAngle, 0, sinAngle],
            [0, 1, 0],
            [-sinAngle, 0, cosAngle],
        ]
    );
}

function rotMatZ(angle, cosAngle = null, sinAngle = null) {
    if (sinAngle === null) {
        cosAngle = Math.cos(angle);
        sinAngle = Math.sin(angle);
    }

    return new Matrix(
        ...[
            [cosAngle, -sinAngle, 0],
            [sinAngle, cosAngle, 0],
            [0, 0, 1],
        ]
    );
}

module.exports = { Matrix, rotMatX, rotMatY, rotMatZ };
