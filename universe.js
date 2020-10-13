'use strict';

const universe = {

    G: 80, // to work with little masses and short distances

    stars: [],

    next_frame: function() {
        /**
         * missions of this function:
         *     1. calculate acceleration of each star (caused by the other stars)
         *     2. update the velocity of each star (vel += acc)
         *     3. update the position of each star (pos += vel)
         * 
         * to calculate acceleration of each star, we'll iterate over 
         * every pair of stars. say their masses are m1 and m2,
         * we can calculate the acceleration that they are causing to each other.
         * we'll sum up each star's acc in the array A (A[i] is sigma(acc) of Si)
         *
         * force length:  
         *     (G * m1 * m2) / dist^2  
         *  == (G * m1 * m2) / (D * D)
         * 
         * force direction:
         *     normalized(D)  
         *  == D * sqrt(D * D)
         * 
         * force vector:
         *     [force length] * [force direction]
         *  == (G * m1 * m2) / (D * D) * D * sqrt(D * D)
         *  == D * (G * m1 * m2) * (D * D)^-1.5 
         * 
         * acceleration vector (of the star whose mass is m1) is:
         *     [force vector] / m1  (because F = m a)
         *  == D * (G * m1 * m2) * (D * D)^-1.5 / m1
         *  == D * (G * m2) * (D * D)^-1.5
         * 
         * the latter equation is the acceleration of S1, caused by S2.
         * we have many stars, so for pair of stars, we'll calculate the
         * acceleration that they are causing to each other,
         * and add that to A (the array where A[i] is sigma(acc) of Si).
         */

        // sigma acceleration of each star (initiated as zero-vectors)
        const A = Array.from(Array(this.stars.length), Vec.zeros);

        for (let i = 0; i < this.stars.length - 1; i++) {   // iterating over all
            for (let j = i + 1; j < this.stars.length; j++) //  the pairs
            {
                const [Si, Sj] = [ this.stars[i], this.stars[j] ];

                const D = Sj.pos.subtract(Si.pos); // a VECTOR from Si to Sj

                const ai = D.dot( (this.G * Sj.mass) * D.dot(D) ** -1.5 );
                const aj = D.dot( (this.G * Si.mass) * D.dot(D) ** -1.5 );

                A[i] = A[i].add(ai); // A[i] is sigma(a) of Si
                A[j] = A[j].subtract(aj); // (minus because D is from Si to Sj)
            }
        }

        for (let i = 0; i < this.stars.length; i++) {

            this.stars[i].vel = this.stars[i].vel.add(A[i]); // todo plus_equals
            this.stars[i].pos = this.stars[i].pos.add(this.stars[i].vel);
        }
    }
};
