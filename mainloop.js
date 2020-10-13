'use strict';


// sun and planet (prefect circle)
// new Star(100, new Vec(0, 0), new Vec(0, -0.04), 'rgba(255, 12, 50, 0.35)'),
// new Star(1, new Vec(320, 0), new Vec(0, 5), 'rgba(12, 200, 30, 0.35)'),

const perfect_two_stars = `{
    "zoom": 1.1,
    "movement": [-150, 0],
    "stars": [
        {
            "mass": 100,
            "pos": [0, 0],
            "vel": [0, -0.04],
            "color": "rgba(0, 100, 250, 0.35)"
        },
        {
            "mass": 1,
            "pos": [320, 0],
            "vel": [0, 5],
            "color": "rgba(250, 250, 200, 0.35)"
        }
    ]
}`;


foreach_frame(function() {

    draw_grid_lines();

    universe.stars.forEach(draw_trace);
    draw_stars();

    if (velcities_checkbox.checked)
        universe.stars.forEach(draw_velocity_arrow);

    draw_marks_size();

    if (star_being_created !== null) 
        draw_future_trace();

    if (!is_paused) {
        universe.next_frame();
        universe.stars.forEach(add_pos_to_future_trace);
    }
});


const two_stars = `{
    "zoom": 0.909,
    "movement": [-150, 0],
    "stars": [
        {
            "mass": 100,
            "pos": [0, 0],
            "vel": [0, -0.04],
            "color": "rgb(0, 100, 250)"
        },
        {
            "mass": 1,
            "pos": [300, 0],
            "vel": [0, 4],
            "color": "rgb(250, 250, 200)"
        }
    ]
}`;

const three_stars = `{
    "zoom": 0.012,
    "movement": [20550, 0],
    "stars": [
        {
            "mass": 1000000,
            "pos": [-30000, 0],
            "vel": [0, 0],
            "color": "rgba(250, 250, 30, 0.35)"
        },
        {
            "mass": 100,
            "pos": [0, 0],
            "vel": [0, 51.599778],
            "color": "rgba(0, 100, 250, 0.35)"
        },
        {
            "mass": 1,
            "pos": [320, 0],
            "vel": [0, 56.639778],
            "color": "rgba(250, 250, 200, 0.35)"
        }
    ]
}`;

const one_star = `{
    "zoom": 1,
    "movement": [0, 0],
    "stars": [
        {
            "mass": 100,
            "pos": [-464, 0],
            "vel": [0, 0],
            "color": "rgba(0, 100, 250, 0.35)"
        }
    ]
}`;

load_snapshot(two_stars);