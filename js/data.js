'use strict';

function charactersheet_update(){
    core_ui_update({
      'class': true,
      'ids': {
        'experience': webgl_characters[webgl_character_id]['experience'],
        'health-max': webgl_characters[webgl_character_id]['health-max'],
        'jump-height': webgl_characters[webgl_character_id]['jump-height'],
        'level': webgl_characters[webgl_character_id]['level'],
        'multiplier-jump': webgl_properties['multiplier-jump'],
        'multiplier-speed': webgl_properties['multiplier-speed'],
        'speed': webgl_characters[webgl_character_id]['speed'],
      },
    });
}
