'use strict';

function repo_escape(){
    if(webgl_character_level() < 0){
        return;
    }

    if(core_menu_open){
        let inventory = '';
        for(let item in webgl_characters[webgl_character_id]['inventory']){
            inventory += '<li>' + item + ': ' + webgl_characters[webgl_character_id]['inventory'][item];
        }
        core_ui_update({
          'ids': {
            'experience': webgl_characters[webgl_character_id]['experience'],
            'health-max': webgl_characters[webgl_character_id]['health-max'],
            'inventory': inventory,
            'jump-height': webgl_characters[webgl_character_id]['jump-height'],
            'level': webgl_characters[webgl_character_id]['level'],
            'multiplier-jump': webgl_properties['multiplier-jump'],
            'multiplier-speed': webgl_properties['multiplier-speed'],
            'speed': webgl_characters[webgl_character_id]['speed'],
          },
        });

    }else{
        core_ui_update({
          'ids': {
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
        'character-load': {
          'onclick': function(){
              if(webgl_character_level() < 0
                || window.confirm('Load new character?')){
                  webgl_level_load({
                    'character': 1,
                    'json': document.getElementById('character-json').files[0] || false,
                  });
              }
          },
        },
        'home': {
          'onclick': webgl_character_home,
        },
        'level-load': {
          'onclick': function(){
              webgl_level_load({
                'character': 0,
                'json': document.getElementById('level-json').files[0] || false,
              });
          },
        },
        'prebuilt-load-character': {
          'onclick': function(){
              if(webgl_character_level() < 0
                || window.confirm('Load new character?')){
                  ajax_level(
                    document.getElementById('character-select').value,
                    1
                  );
              }
          },
        },
        'prebuilt-load-level': {
          'onclick': function(){
              ajax_level(
                document.getElementById('level-select').value,
                0
              );
          },
        },
        'update-json': {
          'onclick': function(){
              webgl_json_export();
          },
        },
      },
      'info': '<table><tr><td>Level: <span id=level></span> (<span id=experience></span>)<br>'
        + 'Health: <span class=health-current></span>/<span class=health-max></span>'
        + '<td rowspan=2>Inventory: <ul id=inventory></ul>'
        + '<tr><td>Jump Height: <span id=jump-height></span> (x<span id=multiplier-jump></span>)<br>'
        + 'Speed: <span id=speed></span> (x<span id=multiplier-speed></span>)</table>'
        + '<input id=home value="Return Home" type=button>',
      'keybinds': {
        32: {},
        67: {},
        70: {},
      },
      'menu': true,
      'mousebinds': {
        'contextmenu': {
          'preventDefault': true,
        },
        'mousemove': {
          'preventDefault': true,
          'todo': webgl_camera_handle,
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
        + '<tr><td><input id=shoot><td>Shoot</table>',
      'tabs': {
        'export': {
          'content': '<input id=update-json type=button value="Update Character JSON"><br><textarea id=exported></textarea>',
          'group': 'core-menu',
          'label': 'Export Character',
        },
        'load': {
          'content': '<table><tr><td><input id=character-json type=file><td><input id=character-load type=button value="Load Character From File">'
            + '<tr><td><select id=character-select></select><td><input id=prebuilt-load-character type=button value="Load Prebuilt Character">'
            + '<tr><td><input id=level-json type=file><td><input id=level-load type=button value="Load Level From File">'
            + '<tr><td><select id=level-select></select><td><input id=prebuilt-load-level type=button value="Load Prebuilt Level"></table>',
          'default': true,
          'group': 'core-menu',
          'label': 'Load Characters/Levels',
        },
      },
      'title': 'Multiverse.htm',
      'ui': 'Health: <span id=health-current></span>/<span id=health-max></span><hr>'
        + '<div id=npc-talk></div>'
        + '<table id=npc-trade-div style=display:none></table>',
    });

    // Populate prebuilt character/level selects if defined.
    if('multiversecharacters' in window){
        let character_select = '';
        for(let character in multiversecharacters){
            character_select += '<option value="' + character + '">' + multiversecharacters[character] + '</option>';
        }
        document.getElementById('character-select').innerHTML = character_select;
    }
    if('multiverselevels' in window){
        let level_select = '';
        for(let level in multiverselevels){
            level_select += '<option value="' + level + '">' + multiverselevels[level] + '</option>';
        }
        document.getElementById('level-select').innerHTML = level_select;
    }
}

function repo_logic(){
    /*
    if(webgl_characters[webgl_character_id]['health-current'] > 0){
        if(core_keys[core_storage_data['shoot']]['state']){
            webgl_particles_create({
              'gravity': false,
              'translate-x': webgl_characters[webgl_character_id]['translate-x'],
              'translate-y': webgl_characters[webgl_character_id]['translate-y'],
              'translate-z': webgl_characters[webgl_character_id]['translate-z'],
            });
        }
    }
    */

    core_ui_update({
      'ids': {
        'health-current': webgl_characters[webgl_character_id]['health-current'],
      },
    });
}
