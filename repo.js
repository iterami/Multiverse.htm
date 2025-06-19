'use strict';

function repo_init(){
    core_repo_init({
      'beforeunload': {
        'todo': function(event){
            if(webgl !== 0){
                event.preventDefault();
            }
        },
      },
      'events': {
        'character-random': {
          'onclick': function(){
              if(core_menu_lock
                || globalThis.confirm('Load new character?')){
                  core_menu_lock = false;
                  webgl_level_load({
                    'character': {
                      'camera-zoom': 25,
                      'collides': true,
                      'controls': 'rpg',
                      'gravity': 1,
                      'level': 0,
                      'lives': 1,
                      'model': {},
                    },
                  });
              }
          },
        },
        'character-load': {
          'onclick': function(){
              const element = document.getElementById('character-json');
              if(element.files.length === 0){
                  return;
              }
              if(core_menu_lock
                || globalThis.confirm('Load new character?')){
                  core_menu_lock = false;
                  if(!webgl_level_load({
                      'character': 1,
                      'json': element.files[0] || false,
                    })){
                      element.value = null;
                  }
              }
          },
        },
        'level-load-file': {
          'onclick': function(){
              if(!webgl_characters[webgl_character_id]){
                  return;
              }
              const element = document.getElementById('level-file');
              if(element.files.length === 0){
                  return;
              }
              core_file({
                'file': element.files[0],
                'todo': function(event){
                    if(webgl_level_load({
                        'character': 0,
                        'json': JSON.parse(event.target.result),
                      })){
                        document.title = (webgl_properties.title || element.files[0].name) +  ' - ' + core_repo_title;

                    }else{
                        element.value = null;
                    }
                },
                'type': 'readAsText',
              });
          },
        },
        'level-load-textarea': {
          'onclick': function(){
              if(!webgl_characters[webgl_character_id]){
                  return;
              }
              const text = document.getElementById('level-textarea').value.trim() || '{}';
              const level_json = JSON.parse(text[0] === "'"
                ? text.slice(1, -1)
                : text);
              webgl_level_load({
                'character': 0,
                'json': level_json,
              });
              document.title = level_json.title
                ? level_json.title + ' - ' + core_repo_title
                : core_repo_title;
          },
        },
        'screenshot': {
          'onclick': webgl_screenshot,
        },
      },
      'info': '<table><tr><td>Level<td><span id=level></span> (<span id=level-xp></span>/<span id=level-goal></span>)'
        + '<tr><td>Life<td><span class=life></span>/<span class=life-max></span>'
        + '<tr><td>Lives<td><span id=lives></span>'
        + '<tr><td>Jump Height<td><span id=jump-height></span>'
        + '<tr><td>Speed<td><span id=speed></span>'
        + '<tr><td>Turn Speed<td><span id=turn-speed></span>'
        + '</table><button id=screenshot type=button>Screenshot</button>',
      'keybinds': {
        'Backquote': {
          'todo': function(){
              webgl_characters[webgl_character_id].automove = !webgl_characters[webgl_character_id].automove;
          },
        },
      },
      'menu_lock': true,
      'pointerbinds': {
        'contextmenu': {
          'preventDefault': true,
        },
        'pointermove': {
          'todo': function(){
              webgl_controls_pointer();
          },
        },
        'pointerup': {
          'todo': webgl_pick_entity,
        },
        'wheel': {
          'todo': webgl_controls_wheel,
        },
      },
      'storage_controls': true,
      'tabs': {
        'load': {
          'content': '<button id=character-random type=button>Create Random Character</button><br>'
            + '<input id=character-json type=file><button id=character-load type=button>Load Character from File</button><br>'
            + '<input id=level-file type=file><button id=level-load-file type=button>Load Level from File</button><br>'
            + '<button id=level-load-textarea type=button>Load Level from Textarea</button><br><textarea id=level-textarea></textarea>',
          'default': true,
          'group': 'core_menu',
          'label': 'Load Characters/Levels',
        },
      },
      'title': 'Multiverse.htm',
      'ui': 'Life: <span id=life></span>/<span id=life-max></span>',
    });
}

function repo_level_load(){
    update_ui();
}

function repo_stat_modify(){
    update_ui();
}

function update_ui(){
    const ui = {
      'jump-height': 3,
      'level': 0,
      'level-xp': 3,
      'life': 0,
      'life-max': 0,
      'lives': 0,
      'speed': 3,
      'turn-speed': 3,
    };
    for(const element in ui){
        ui[element] = core_number_format({
          'decimals_max': ui[element],
          'decimals_min': 0,
          'number': webgl_characters[webgl_character_id][element],
        });
    }
    core_ui_update({
      'class': true,
      'ids': {
        ...ui,
        'level-goal': core_number_format({
            'decimals_max': 0,
            'decimals_min': 0,
            'number': Math.floor(webgl_characters[webgl_character_id].level + 1) * 1e3,
          }),
      },
    });
    webgl_uniform_update();
}
