'use strict';


let star_being_created = null;


const NEW_STAR_MIN_RADIUS_PIXELS = 8;

on_mouse_drag(RIGHT_MOUSE_BUTTON,

    function click_handler(canvas_pos) {
        
        if (star_being_created !== null) {
            alert('something fishy has happend! star_being_created !== null')
            return; // todo create a star with command, not with left mouse...
        }

        star_being_created = new Star({

            mass: mass_given_drawn_radius(NEW_STAR_MIN_RADIUS_PIXELS),
            pos: camera.from_screen_coordiantes(canvas_pos),
            vel: Vec.zeros(),
            color: radnom_color(),
        });
        
        universe.stars.push(star_being_created);

        pause();
    },

    function move_handler(canvas_pos) {
        const world_diff = camera.from_screen_coordiantes(canvas_pos).subtract(star_being_created.pos);
        let new_radius = camera.linear_mapping_to_screen_coordinates(world_diff).length;
        new_radius = Math.max(NEW_STAR_MIN_RADIUS_PIXELS, new_radius);
        star_being_created.mass = mass_given_drawn_radius(new_radius);
    },

    function mouseup() {

        mouse_desires_to_land(
            function moved(canvas_pos) {

                velcities_checkbox.checked = true;

                const pixel_ctr = camera.to_screen_coordiantes(star_being_created.pos);
                const pixel_vec_from_ctr = canvas_pos.subtract(pixel_ctr);
                const pixel_dist_from_ctr = pixel_vec_from_ctr.length;

                const pixel_radius = drawn_radius(star_being_created.mass); // radius of star in pixels

                if (pixel_dist_from_ctr <= pixel_radius) {
                    star_being_created.vel = Vec.zeros();
                }
                else {
                    const part_in_star = pixel_vec_from_ctr.normalized().dot(pixel_radius);
                    const pixel_vel = pixel_vec_from_ctr.subtract(part_in_star)
                        .dot(1 / DRAWN_VELOCITY_SCALING_FACTOR); // todo that is hideous, have you heard of encapsulation?
                    star_being_created.vel = camera.linear_mapping_to_world_coordinates(pixel_vel);
                }
            },
            function landed(vec) {
                star_being_created = null;
            }
        );
    }
);




function draw_future_trace() {

    const num_steps_ahead = 150; // should be 300 but can it calculate it???

    if (star_being_created === null)
        throw new Error('cannot draw_future_trace when star_being_created === null');
    
    const current_state = create_snapshot();
    const new_guy_index = universe.stars.indexOf(star_being_created);

    const next_positions = [];
    for (let i = 0; i < num_steps_ahead; i++) {
        universe.next_frame();

        const vec = camera.to_screen_coordiantes(star_being_created.pos);
        next_positions.push(vec.x);
        next_positions.push(vec.y);
    }

    load_snapshot(current_state);
    star_being_created = universe.stars[new_guy_index];

    // next_positions.forEach(vec => {
    //     draw_circle(vec.x, vec.y, 1, 'white');
    // });


    const pts = getCurvePoints(next_positions);
    
    c.strokeStyle = 'rgb(230, 244, 245)';
    
    c.beginPath();
    c.moveTo(pts[0], pts[1]);

    for (let i = 2; i < pts.length - 1; i += 2) {
        c.lineTo(pts[i], pts[i + 1]);
    }

    c.lineWidth = 0.2;
    c.stroke();
}