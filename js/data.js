'use strict';

function ajax_level(level){
    core_ajax({
      'todo': load_prebuilt_level,
      'url': '../MultiverseLevels.htm/json/' + level + '.json',
    });
}

function load_prebuilt_level(responseText){
    webgl_load_level({
      'character': 0,
      'json': responseText,
    });
}
