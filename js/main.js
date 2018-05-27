'use strict';

function logic(){
}

function repo_init(){
    core_repo_init({
      'events': {
        'load_character': {
          'onclick': function(){
              webgl_load_level({
                'json': document.getElementById('character_json').files[0] || false,
              });
          },
        },
        'load_level': {
          'onclick': function(){
              if(webgl_character_type() < 0){
                  return;
              }

              webgl_load_level({
                'json': document.getElementById('level_json').files[0] || false,
              });
          },
        },
        'load_prebuilt': {
          'onclick': function(){
              if(webgl_character_type() < 0){
                  return;
              }

              ajax_level(document.getElementById('level_select').value);
          },
        },
      },
      'info': '<table><tr><td><input id=character_json type=file><td><input id=load_character type=button value="Load Character From File">'
        + '<tr><td><input id=level_json type=file><td><input id=load_level type=button value="Load Level From File">'
        + '<tr><td><select id=level_select></select><td><input id=load_prebuilt type=button value="Load Prebuilt Level"></table>',
      'keybinds': {
        32: {},
        67: {},
      },
      'menu': true,
      'mousebinds': {
        'mousedown': {
          'todo': core_requestpointerlock,
        },
        'mousemove': {
          'todo': webgl_camera_first,
        },
      },
      'title': 'Multiverse.htm',
    });

    // Populate prebuilt level select if multiverselevels defined.
    if('multiverselevels' in window){
        var level_select = '';
        for(var level in multiverselevels){
            level_select += '<option value="' + level + '">' + multiverselevels[level] + '</option>';
        }
        document.getElementById('level_select').innerHTML = level_select;
    }
}
