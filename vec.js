'use strict';

class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    dot(other) {
        if (other instanceof Vec)
            return this.x * other.x + this.y * other.y;
        
        return new Vec(this.x * other, this.y * other);
    }

    add(vec) {
        return new Vec(this.x + vec.x, this.y + vec.y);
    }

    subtract(vec) {
        return new Vec(this.x - vec.x, this.y - vec.y);
    }

    toString() {
        return `[ ${this.x}, ${this.y} ]`;
    }

    static zeros() {
        return new Vec(0, 0);
    }

    get length() {
        return this.dot(this) ** 0.5;
    }

    normalized() {
        return this.dot(1 / this.length)
    }

    toArray() {
        return [this.x, this.y];
    }
}
