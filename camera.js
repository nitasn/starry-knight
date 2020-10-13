'use strict';

const camera = {

    zoom_level: 1, /** how many pixels does a unit vector span */

    movement: Vec.zeros(),

    move_X (dx) {
        this.movement.x += dx / this.zoom_level;
    },

    move_Y (dy) {
        this.movement.y += dy / this.zoom_level;
    },

    increase_zoom() {
        this.zoom_level *= 1.1;
    },

    decrease_zoom() {
        this.zoom_level /= 1.1;
    },

    reset_zoom_and_movement() {
        this.movement.x = 0;
        this.movement.y = 0;
        this.zoom_level = 1;
    },

    to_screen_coordiante_x(x) {
        return (x + this.movement.x) * this.zoom_level + canvas.scrollWidth / 2;
    },

    to_screen_coordiante_y(y) {
        return canvas.scrollHeight / 2 - (y + this.movement.y) * this.zoom_level;
    },

    to_screen_coordiantes(vec) {
        /**
         * translate a vector from world coordinates, to the canvas coordinates.
         * 
         * everything is moved so that [0, 0] is at the canvas's center,
         * so DON'T MEASURE THE LENGTH OF THE RESULT VECTOR.
         * it will be the distance to the canvas's topleft corner,
         * which is (prbably) not what you're looking for.
         * see also `linear_mapping_to_screen_coordinates`
         */

        return new Vec( 
            this.to_screen_coordiante_x(vec.x),
            this.to_screen_coordiante_y(vec.y)
        );
    },

    from_screen_coordiante_x(x) {
        return (x - canvas.scrollWidth / 2) / this.zoom_level - this.movement.x;
    },

    from_screen_coordiante_y(y) {
        return (canvas.scrollHeight / 2 - y) / this.zoom_level - this.movement.y;
    },

    from_screen_coordiantes(vec) {

        return new Vec( 
            this.from_screen_coordiante_x(vec.x),
            this.from_screen_coordiante_y(vec.y)
        );
    },

    linear_mapping_to_screen_coordinates(vec) {
        // the same as `to_screen_coordiantes`, but with no translation;
        // here, the origin IS sent to [0, 0], and the mapping is indeed linear.
        // you can use this function to measure how many pixels a star is about to move
        // using `linear_mapping_to_screen_coordinates(star.vel)` and so on

        return new Vec(vec.x, -vec.y).dot(this.zoom_level);
    },

    linear_mapping_to_world_coordinates(vec) {
        /** the inverse of `linear_mapping_to_screen_coordinates` */

        return new Vec(vec.x, -vec.y).dot(1 / this.zoom_level);
    }
};
