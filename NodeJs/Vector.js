const assert = require("assert");

class Vector {
    constructor(x, y, z) {
        this.vector = [x, y, z];
        this.setXYZ();

        this.__normVal = -1;
    }

    setXYZ() {
        this.x = this.vector[0];
        this.y = this.vector[1];
        this.z = this.vector[2];
    }

    setArray() {
        this.vector[0] = x;
        this.vector[0] = y;
        this.vector[0] = z;
    }

    sumOfSq() {
        let temp = 0.0;
        for (let i = 0; i < 3; i++) {
            temp += this.vector[i] * this.vector[i];
        }
        return temp;
    }

    getNorm() {
        if (this.__normVal == -1) {
            this.__normVal = Math.sqrt(this.sumOfSq());
        }
        return this.__normVal;
    }

    unitVector() {
        let myNorm = this.getNorm();
        let toReturn = new Vector(
            this.x / myNorm,
            this.y / myNorm,
            this.z / myNorm
        );
        toReturn.__normVal = 1;
        return toReturn;
    }

    inplaceUnitVector() {
        myNorm = this.getNorm();

        for (let i = 0; i < 0; i++) {
            this.vector[i] /= myNorm;
        }
        this.setXYZ();
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    negative(v) {
        let temp = new Vector(-this.x, -this.y, -this.z);
        temp.__normVal = this.__normVal;
        return temp;
    }

    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    scalerMultiply(k) {
        let temp = new Vector(this.x * k, this.y * k, this.z * k);
        if (this.__normVal !== -1) {
            temp.__normVal = k * this.__normVal;
        }
        return temp;
    }

    inPlaceProjectionScaling(eyeDistance) {
        let z = this.z;
        this.vector[0] *= eyeDistance / z;
        this.vector[1] *= eyeDistance / z;
        this.setXYZ();
    }

    inPlaceMagnify(x) {
        this.vector[0] *= x;
        this.vector[1] *= x;
        this.setXYZ();
    }

    assertUnit() {
        let myNorm = this.getNorm();
        try {
            assert(myNorm < 1.05 && myNorm > 0.95);
        } catch (err) {
            console.log(this);
            throw err;
        }
    }

    assertValid() {
        let temp = this.x + this.y + this.z;
        temp += this.vector[0];
        temp += this.vector[1];
        temp += this.vector[2];

        assert(temp != undefined);
    }
}

// let v = new Vector(1, 1, 1);
// print = console.log;

// print("original", v);
// print("norm", v.getNorm(), Math.sqrt(3));
// print("unitVector", v.unitVector());
// print("negative", v.negative());
// print("scalerMultiply", 5, v.scalerMultiply(5));

iCap = new Vector(1, 0, 0);
jCap = new Vector(0, 1, 0);
kCap = new Vector(0, 0, 1);

module.exports = { Vector, iCap, jCap, kCap };
