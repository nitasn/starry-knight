'use strict';

`{
    "mass": 1,
    "pos": [300, 0],
    "vel": [0, 4],
    "color": "rgba(250, 250, 200, 0.35)"
}`

class Star {
    constructor({mass, pos, vel, color}) {
        /**
         * example invocation:
         * 
         * new Star({
         *     mass: 3, 
         *     pos: [3, 3], 
         *     vel: [1, 5], 
         *     color: 'red'
         * });
         */
        
        this.mass = mass;
        // radius is derived from the mass; some constant * mass^(1/3)
        this.pos = pos instanceof Vec ? pos : new Vec(...pos);
        this.vel = vel instanceof Vec ? vel : new Vec(...vel);
        this.color = color;
    }

    toString() {
        return `star [${this.color}] { m: ${this.mass}, r: ${this.radius}, p: ${this.pos}, v: ${this.vel} }`;
    }
}
