'use strict';

function repo_escape(){
    if(!core_menu_open
      || webgl_character_level() < 0){
        return;
    }

    const ui = {
      'jump-height': 3,
      'level': 0,
      'level-xp': 3,
      'lives': 0,
      'speed': 3,
      'turn-speed': 3,
    };
    for(const element in ui){
        ui[element] = core_number_format({
          'decimals-max': ui[element],
          'number': webgl_characters[webgl_character_id][element],
        });
    }
    core_ui_update({
      'class': true,
      'ids': {
        ...ui,
        'level-goal': core_number_format({
            'decimals-max': 0,
            'number': Math.floor(webgl_characters[webgl_character_id]['level'] + 1) * 1e3,
          }),
      },
    });
    webgl_uniform_update();
}

function repo_init(){
    core_repo_init({
      'beforeunload': {
        'todo': function(){
            if(!core_menu_lock
              && core_storage_data['beforeunload-warning']){
                return 'Exit?';
            }
        },
      },
      'events': {
        'character-random': {
          'onclick': function(){
              if(core_menu_lock
                || globalThis.confirm('Load new character?')){
                  core_menu_lock = false;
                  webgl_level_unload();
                  webgl_level_load({
                    'character': 2,
                  });
                  webgl_character_init({
                    'collides': true,
                    'controls': 'rpg',
                    'gravity': 1,
                    'level': 0,
                    'lives': 1,
                    'randomize': true,
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
                  webgl_level_unload();
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
                        document.title = webgl_properties['title']
                          ? webgl_properties['title'] + ' - ' + core_repo_title
                          : core_repo_title;

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
              const level_json = JSON.parse(document.getElementById('level-textarea').value);
              webgl_level_load({
                'character': 0,
                'json': level_json,
              });
              document.title = level_json['title']
                ? level_json['title'] + ' - ' + core_repo_title
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
              webgl_characters[webgl_character_id]['automove'] = !webgl_characters[webgl_character_id]['automove'];
          },
        },
      },
      'menu-lock': true,
      'mousebinds': {
        'contextmenu': {
          'preventDefault': true,
        },
        'mousemove': {
          'todo': function(event){
              webgl_controls_mouse(webgl_character_id);
          },
        },
        'mouseup': {
          'todo': webgl_pick_entity,
        },
        'wheel': {
          'todo': function(event){
              webgl_controls_wheel(
                webgl_character_id,
                event.deltaY
              );
          },
        },
      },
      'storage': {
        'beforeunload-warning': true,
      },
      'storage-menu': '<table><tr><td><input id=beforeunload-warning type=checkbox><td>beforeunload Warning</table>',
      'tabs': {
        'load': {
          'content': '<button id=character-random type=button>Create Random Character</button><br>'
            + '<input id=character-json type=file><button id=character-load type=button>Load Character from File</button><hr>'
            + '<input id=level-file type=file><button id=level-load-file type=button>Load Level from File</button><br>'
            + '<button id=level-load-textarea type=button>Load Level from Textarea</button><br><textarea id=level-textarea>{}</textarea>',
          'default': true,
          'group': 'core-menu',
          'label': 'Load Characters/Levels',
        },
      },
      'title': 'Multiverse.htm',
      'ui': 'Life: <span id=life></span>/<span id=life-max></span>',
    });
}

function repo_logic(){
    core_ui_update({
      'class': true,
      'ids': {
        'life': webgl_characters[webgl_character_id]['life'],
        'life-max': webgl_characters[webgl_character_id]['life-max'],
      },
    });
}
