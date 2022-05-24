'use strict';

function ajax_level(level, character){
    if(character === void 0){
        character = level in multiversecharacters
          ? 1
          : 0;
    }

    if(webgl_levelcache['id'] === level){
        if(character === 2){
            webgl_character_random({
              'id': '_me',
            });
        }

        webgl_level_load({
          'character': character,
          'json': webgl_levelcache['json'],
        });

        return;
    }

    core_ajax({
      'todo': function(responseText){
          if(character === 2){
              webgl_character_random({
                'id': '_me',
              });
          }

          webgl_level_load({
            'cache': level,
            'character': character,
            'json': responseText,
          });
      },
      'url': '../MultiverseLevels.htm/json/' + level + '.json',
    });
}

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
