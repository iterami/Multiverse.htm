'use strict';

function ajax_level(level){
    core_ajax({
      'todo': function(responseText){
          webgl_load_level({
            'character': 0,
            'json': responseText,
          });
      },
      'url': '../MultiverseLevels.htm/json/' + level + '.json',
    });
}
