'use strict';

window.addEventListener('keydown', (e) => {

    switch (e.keyCode) {

        case 37: // Left arrow
            camera.move_X(-50);
            break;

        case 38: // Up arrow
            camera.move_Y(+50);
            break;

        case 39:// Right arrow
            camera.move_X(+50);
            break;

        case 40: // Down arrow
            camera.move_Y(-50);
            break;

        case 65: // 'A' key
            camera.reset_zoom_and_movement();
            break;

        case 107: // '+' of numpad
        case 187: // '=' above letters
            camera.increase_zoom();
            break;

        case 109: // '-' of numpad
        case 189: // '-' above letters
            camera.decrease_zoom();
            break;

        case 80: // 'P' key
            on_play_pause_click();
            break;
        
        case 86: // 'V' key
            velcities_checkbox.checked = !velcities_checkbox.checked;
            break;

        default: 
            // alert(`keycode ${e.keyCode}`);
            break;
    }
});