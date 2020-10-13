'use strict';

/**
 * this file deals with files that look like this:
 * 
 * {
 *     "zoom": 0.909,
 *     "movement": [-50, 0],
 *     "stars": [
 *         {
 *             "mass": 100,
 *             "pos": [0, 0],
 *             "vel": [0, -0.04],
 *             "color": "rgba(0, 100, 250, 0.35)"
 *         },
 *         {
 *             "mass": 1,
 *             "pos": [300, 0],
 *             "vel": [0, 4],
 *             "color": "rgba(250, 250, 200, 0.35)"
 *         }
 *     ]
 * }
 */

function load_snapshot(json_string) {
    // todo some validation checking...

    const snapshot = JSON.parse(json_string);

    universe.stars = snapshot.stars.map(
        specs => new Star(specs)
    );

    camera.zoom_level = snapshot.zoom;
    
    camera.movement = new Vec(...snapshot.movement);
}


function create_snapshot() {

    const beginning = `{
    "zoom": ${camera.zoom_level},
    "movement": [${camera.movement.x}, ${camera.movement.y}],
    `;

    let stars_builder = [];
    for (const star of universe.stars) {
        stars_builder.push(`
        {
            "mass": ${star.mass},
            "pos": [${star.pos.x}, ${star.pos.y}],
            "vel": [${star.vel.x}, ${star.vel.y}],
            "color": "${star.color}"
        }`);
    }
    const stars_repr = `"stars": [ ${stars_builder.join(',')}
    ]`;

    return `${beginning}${stars_repr}\n}`;
}