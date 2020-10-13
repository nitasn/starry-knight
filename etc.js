'use strict';


const velcities_checkbox =
    document.getElementById('draw-velocities-checkbox');

const play_pause_button =
    document.getElementById('play-pause-btn');

const traces_slider =
    document.getElementById('traces-length-input');


let is_paused;
pause();

function pause() {
    is_paused = true;
    play_pause_button.innerText = '▶️ Play';
}

function play() {
    is_paused = false;
    play_pause_button.innerText = '⏸️ Pause';
}

function on_play_pause_click() {
    if (star_being_created === null) {
        is_paused ? play() : pause();
    }
    else {
        alert('play-pause clicked when star_being_created !== null... fix bug');
    }
}


function round(num, decimal_places = 0) {

    const integer = Math.round(
        (num + Number.EPSILON) * 10 ** decimal_places);

    return integer / 10 ** decimal_places;
}

function ceil(num, closest_multiple_of = 1) {

    return Math.ceil(num / closest_multiple_of) * closest_multiple_of;
}

function force_fit_range(min, x, max) {
    return Math.max(min, Math.min(x, max));
}


function clear_all() {
    if (star_being_created !== null) {
        alert('sorry! please finish creating that star first!'); // todo needed?
        return;
    }
    if (confirm('are you sure you want to clear everything?')) {
        universe.stars = [];
        camera.reset_zoom_and_movement();
    }
}


function current_datetime() {
    const dateobj = new Date();
    return dateobj.getDate() + "."
        + (dateobj.getMonth() + 1) + "."
        + dateobj.getFullYear() + "@"
        + dateobj.getHours() + "_"
        + dateobj.getMinutes();
}

function download(filename, text) {
    // thanks Matěj Pokorný from stack overflow

    const a = document.createElement('a');
    const href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
    a.setAttribute('href', href);
    a.setAttribute('download', filename);
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


function read_file(file, onsuccess, onerror) {

    const reader = new FileReader();

    reader.readAsText(file, "UTF-8");

    reader.onload = (evt) => {
        const text = evt.target.result;
        onsuccess(text);
    };

    reader.onerror = onerror;
}


on_file_dragged(file => {

    const onReadSuccess = (text) => {
        try {
            // todo parse first, then confirm('load snapshot? it will replace and delete the current state')
            load_snapshot(text);
            // todo some success message
        }
        catch (err) {
            alert('sorry! your file could not be parsed! \n' + 'additional info: ' + err);
        }
    };

    const onReadFailure = () => {
        alert('sorry! your file could not be read! :(');
    };

    read_file(file, onReadSuccess, onReadFailure);
});


function download_snapshot() {
    download(current_datetime() + '.json', create_snapshot());
}

on_mouse_wheel(plusOrMinus => {
    if (plusOrMinus > 0) {
        camera.decrease_zoom();
    }
    else {
        camera.increase_zoom();
    }
});


(function move_around_closure() {

    let last_vec;

    on_mouse_drag(LEFT_MOUSE_BUTTON,

        function mousedown(vec) {
            last_vec = vec;
        },

        function mousemove(vec) {
            const delta = vec.subtract(last_vec);
            camera.move_X(+delta.x);
            camera.move_Y(-delta.y);
            last_vec = vec;
        },

        function mouseup() { }
    );
})();


function radnom_color() {
    const r = 100 + Math.floor(Math.random() * 100);
    const g = 100 + Math.floor(Math.random() * 100);
    const b = 100 + Math.floor(Math.random() * 100);
    return `rgb(${r}, ${g}, ${b})`;
}

// function in_drawn_star(canvas_coords, star) {
//     return camera.to_screen_coordiantes(star.pos).subtract(canvas_coords).length <= drawn_radius(star.mass);
// }

