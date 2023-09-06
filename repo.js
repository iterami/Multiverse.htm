'use strict';

function charactersheet_update(){
    core_ui_update({
      'class': true,
      'ids': {
        'experience': webgl_characters[webgl_character_id]['experience'],
        'health-max': webgl_characters[webgl_character_id]['health-max'],
        'jump-height': webgl_characters[webgl_character_id]['jump-height'],
        'level': webgl_characters[webgl_character_id]['level'],
        'speed': webgl_characters[webgl_character_id]['speed'],
      },
    });
}

function repo_escape(){
    if(webgl_character_level() < 0){
        return;
    }

    if(core_menu_open){
        charactersheet_update();
        webgl_uniform_update();

    }else{
        core_ui_update({
          'class': true,
          'ids': {
            'health-current': webgl_characters[webgl_character_id]['health-current'],
            'health-max': webgl_characters[webgl_character_id]['health-max'],
          },
        });
    }
}

function repo_init(){
    core_repo_init({
      'beforeunload': {
        'todo': function(){
            if(webgl_character_level() > -2
              && core_storage_data['beforeunload-warning']){
                return 'Exit?';
            }
        },
      },
      'events': {
        'character-random': {
          'onclick': function(){
              if(webgl_character_level() < 0
                || globalThis.confirm('Load new character?')){
                  webgl_level_unload();
                  webgl_level_load({
                    'character': 2,
                  });
                  webgl_character_random({
                    'id': '_me',
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
              if(webgl_character_level() < 0
                || globalThis.confirm('Load new character?')){
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
      },
      'info': '<table><tr><td>Level<td><span id=level></span> (<span id=experience></span>)'
        + '<tr><td>Health<td><span class=health-current></span>/<span class=health-max></span>'
        + '<tr><td>Jump Height<td><span id=jump-height></span>'
        + '<tr><td>Speed<td><span id=speed></span>'
        + '</table>',
      'keybinds': {
        70: {},
        192: {
          'todo': function(){
              webgl_characters[webgl_character_id]['automove'] = !webgl_characters[webgl_character_id]['automove'];
          },
        },
      },
      'menu': true,
      'mousebinds': {
        'contextmenu': {
          'preventDefault': true,
        },
        'mousedown': {
          'todo': webgl_camera_handle,
        },
        'mousemove': {
          'preventDefault': true,
          'todo': webgl_camera_handle,
        },
        'mouseup': {
          'todo': function(){
              if(webgl_character_level() < -1){
                  return;
              }
              webgl_pick_entity({
                'x': core_mouse['down-x'],
                'y': core_mouse['down-y'],
              });
          },
        },
        'mousewheel': {
          'todo': webgl_camera_zoom,
        },
      },
      'storage': {
        'beforeunload-warning': true,
        'shoot': 70,
      },
      'storage-menu': '<table><tr><td><input id=beforeunload-warning type=checkbox><td>beforeunload Warning'
        + '<tr><td><input class=mini id=shoot min=0 step=any type=number><td>Shoot</table>',
      'tabs': {
        'load': {
          'content': '<input id=character-random type=button value="Create Random Character"><br>'
            + '<input id=character-json type=file><input id=character-load type=button value="Load Character from File"><hr>'
            + '<input id=level-file type=file><input id=level-load-file type=button value="Load Level from File"><br>'
            + '<input id=level-load-textarea type=button value="Load Level from Textarea"><br><textarea id=level-textarea>{}</textarea>',
          'default': true,
          'group': 'core-menu',
          'label': 'Load Characters/Levels',
        },
      },
      'title': 'Multiverse.htm',
      'ui': 'Health: <span id=health-current></span>/<span id=health-max></span>',
    });
    webgl_storage_init();

    if('multiversecharacters' in globalThis){
        let character_select = '';
        for(const character in multiversecharacters){
            character_select += '<option value="' + character + '">' + multiversecharacters[character] + '</option>';
        }
        document.getElementById('character-select').innerHTML = character_select;
    }
}

function repo_logic(){
    core_ui_update({
      'ids': {
        'health-current': webgl_characters[webgl_character_id]['health-current'],
      },
    });
}
