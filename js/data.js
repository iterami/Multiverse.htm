'use strict';

function ajax_level(level, character){
    core_ajax({
      'todo': function(responseText){
          webgl_level_load({
            'character': character,
            'json': responseText,
          });
      },
      'url': '../MultiverseLevels.htm/json/' + level + '.json',
    });
}
