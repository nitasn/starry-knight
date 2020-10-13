'use strict';

// todo wrap it in a singleton 'canvas_tools'

const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

canvas.oncontextmenu = () => { return false; }; // disable left-click menu

window.onresize = (e) => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
};
window.onresize();


function draw_circle(ctr_x, ctr_y, radius, color) {
    c.beginPath();
    c.lineWidth = 0.2;
    const from_angle = 0, to_angle = Math.PI * 2;
    c.arc(ctr_x, ctr_y, radius, from_angle, to_angle);
    c.fillStyle = color;
    c.fill();
    c.strokeStyle = 'white';
    c.stroke();
}

function draw_line(fromX, fromY, toX, toY, color, width) {
    c.beginPath();
    c.moveTo(fromX, fromY);
    c.lineTo(toX, toY);
    c.strokeStyle = color;
    c.lineWidth = width;
    c.stroke();
}

function draw_arrow(fromx, fromy, tox, toy) {
    // based Titus Cieslewski's code from stack overflow

    const dx = tox - fromx;
    const dy = toy - fromy;

    const angle = Math.atan2(dy, dx);

    // const headlen = force_fit_range(3, new Vec(dx, dy).length * 0.4, 25);
    const headlen = Math.max(2, new Vec(dx, dy).length * 0.4);

    c.beginPath();
    c.lineWidth = 0.7;
    c.moveTo(fromx, fromy);
    c.lineTo(tox, toy);

    c.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6),
             toy - headlen * Math.sin(angle - Math.PI / 6));

    c.moveTo(tox, toy);

    c.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6),
             toy - headlen * Math.sin(angle + Math.PI / 6));
    
    c.strokeStyle = 'white';
    c.stroke();
}

function draw_marks_size() {
    
    const text = `minor gridline = ${round(minor_marks, 3)} units`
    
    const gray_level = 100;
    c.fillStyle = `rgb(${gray_level}, ${gray_level}, ${gray_level})`;

    c.font = '14px Courier New MS';

    const margin = 14;
    c.fillText(text, margin, canvas.height - margin);
}

let is_procssing_a_drag = false;

function foreach_frame(draw_frame) {
    requestAnimationFrame( () => foreach_frame(draw_frame) );

    c.clearRect(0, 0, canvas.width, canvas.height);
    draw_frame();

    if (is_procssing_a_drag) {
        draw_drop_here_effect();
    }
}

function draw_drop_here_effect() {
    c.fillStyle = 'rgba(0, 255, 0, 0.04)';
    c.fillRect(0, 0, canvas.scrollWidth, canvas.scrollHeight);
}

function on_file_dragged(handler) {
    
    function catchDrag(event) {
        is_procssing_a_drag = true;
        event.dataTransfer.dropEffect = "copy";
        event.preventDefault();
    }
    canvas.addEventListener("dragenter", catchDrag);
    canvas.addEventListener("dragover", catchDrag);

    const abort_drag = () => is_procssing_a_drag = false;

    canvas.addEventListener("dragleave", abort_drag);
    canvas.addEventListener("dragend", abort_drag);
    canvas.addEventListener("dragexit", abort_drag);

    canvas.addEventListener("drop", (event) => {
        is_procssing_a_drag = false;
        event.preventDefault();
        if(event.dataTransfer && event.dataTransfer.files)
            handler(event.dataTransfer.files[0]);
    });
}

function on_mouse_wheel(handler) {
    canvas.addEventListener("wheel", function(e) {
        const plusOrMinus = Math.sign(e.deltaY);
        handler(plusOrMinus);
        e.preventDefault();
    });
}


const LEFT_MOUSE_BUTTON = 1;
const RIGHT_MOUSE_BUTTON = 3;


function on_mouse_drag(mouse_button, mousedown, mousemove, mouseup) {
    /**
     * the argument passed to these function is new mouse pos (vec in canvas coordinate system)
     */

    let is_mouse_down = false;

    canvas.addEventListener('mousedown', (e) => {
        if (e.which === mouse_button && !does_mouse_desire_to_land) {
            is_mouse_down = true;
            mousedown( new Vec(e.offsetX, e.offsetY) );
        }
    });
    canvas.addEventListener('mousemove', (e) => {
        if (e.which === mouse_button && is_mouse_down && !does_mouse_desire_to_land) {
            mousemove( new Vec(e.offsetX, e.offsetY) );
        }
    });
    canvas.addEventListener('mouseup', (e) => {
        if (e.which === mouse_button && !does_mouse_desire_to_land) {
            is_mouse_down = false;
            mouseup( new Vec(e.offsetX, e.offsetY) );
        }
    });
}

let does_mouse_desire_to_land = false;

function mouse_desires_to_land(mouse_move, mouse_down) {
    /**
     * similar to 'on_mouse_drag' but there are two differences:
     * 1. any mouse button is good
     * 2. no need for mousedown event. we're assuming something already has started
     * also, when does_mouse_desire_to_land === true, all on_mouse_drag's event are not firing.
     */

    does_mouse_desire_to_land = true;

    const move_listener = (e) => mouse_move( new Vec(e.offsetX, e.offsetY) );

    const finish_listener = (e) => {
        canvas.removeEventListener('mousemove', move_listener);
        canvas.removeEventListener('mouseup', finish_listener);
        mouse_down( new Vec(e.offsetX, e.offsetY) );
        does_mouse_desire_to_land = false;
    };

    canvas.addEventListener('mousemove', move_listener);
    canvas.addEventListener('mouseup', finish_listener);
}