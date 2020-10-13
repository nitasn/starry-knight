'use strict';

function draw_stars() {

    universe.stars.forEach(star => {

        const star_ctr = camera.to_screen_coordiantes(star.pos); 

        draw_circle(
            star_ctr.x, star_ctr.y, 
            drawn_radius(star.mass), 
            star.color);
    });
}


const DRAWN_RADIUS_SCALING_FACTOT = 20;

function drawn_radius(mass) {

    return camera.zoom_level * DRAWN_RADIUS_SCALING_FACTOT * mass ** (1 / 3);
}

function mass_given_drawn_radius(r) {
    /** the inverse of 'drawn_radius' */
    return (r / camera.zoom_level / DRAWN_RADIUS_SCALING_FACTOT) ** 3;
}


const DRAWN_VELOCITY_SCALING_FACTOR = 12;

function draw_velocity_arrow(star) {

    if (star.vel.x || star.vel.y) {

        const vel_pixels = 
            camera.linear_mapping_to_screen_coordinates(star.vel);
        
        const ctr_pixels = camera.to_screen_coordiantes(star.pos);

        const star_edge =
            vel_pixels.dot( drawn_radius(star.mass) / vel_pixels.length ).add(ctr_pixels);
        
        const arrow_head = vel_pixels.dot(DRAWN_VELOCITY_SCALING_FACTOR).add(star_edge);

        draw_arrow(star_edge.x, star_edge.y, arrow_head.x, arrow_head.y);
    }
}

let minor_marks;

function draw_grid_lines() {

    /**
     * then find the lowest whole power that satisfy this:
     * zoom * (base ^ power) >= MinPixelGap
     * base ^ power >= MinPixelGap / zoom
     * log(MinPixelGap/zoom) / log(base) <= power
     * power = ceil( log(MinPixelGap/zoom) / log(base) )
     */
    const base = 2; // must be > 0
    const MinPixelGap = 25;
    const power = ceil( Math.log(MinPixelGap / camera.zoom_level) / Math.log(base) );

    minor_marks = base ** power; // in world units

    const major_marks = 5 * minor_marks; // every fifth line should be bold or something
    
    _draw_grid_lines_helper(minor_marks, 'rgb(56, 54, 54)', 1);
    _draw_grid_lines_helper(major_marks, 'rgb(61, 61, 66)', 1);
}

function _draw_grid_lines_helper(marks, color, width) {

    /**
     * draw a line every 'marks' world units.
     * or in other words, for all k values, draw the lines
     * x = k * marks
     * y = k * marks
     */

    const step = camera.zoom_level * marks;
    
    // lines parallel to x axis:

    let next_tick_x = camera.from_screen_coordiante_x(0);
    next_tick_x = ceil(next_tick_x, marks);
    next_tick_x = camera.to_screen_coordiante_x(next_tick_x);

    for (; next_tick_x <= canvas.scrollWidth; next_tick_x += step) {
        draw_line(next_tick_x, 0, next_tick_x, canvas.scrollHeight, color, width);
    }

    // lines parallel to y axis:

    let next_tick_y = camera.from_screen_coordiante_y(0);
    next_tick_y = ceil(next_tick_y, marks);
    next_tick_y = camera.to_screen_coordiante_y(next_tick_y);

    for (; next_tick_y <= canvas.scrollHeight; next_tick_y += step) {
        draw_line(0, next_tick_y, canvas.scrollWidth, next_tick_y, color, width);
    }
}