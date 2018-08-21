'use strict';

function repo_escape(){
    if(!core_menu_open
      || webgl_character_level() < -1){
        return;
    }

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
        'prebuilt-load': {
          'onclick': function(){
              ajax_level(document.getElementById('level-select').value);
          },
        },
      },
      'info': '<table><tr><td>Level: <span id=ui-level></span> (<span id=ui-experience></span>)<br>'
        + 'Health: <span class=ui-health-current></span>/<span class=ui-health-max></span>'
        + '<td rowspan=2>Inventory: <ul id=ui-inventory></ul>'
        + '<tr><td>Jump Height: <span id=ui-jump-height></span> (x<span id=ui-multiplier-jump></span>)<br>'
        + 'Speed: <span id=ui-speed></span> (x<span id=ui-multiplier-speed></span>)</table>'
        + '<input id=home value="Return Home" type=button>'
        + '<hr><table><tr><td><input id=character-json type=file><td><input id=character-load type=button value="Load Character From File">'
        + '<tr><td><input id=level-json type=file><td><input id=level-load type=button value="Load Level From File">'
        + '<tr><td><select id=level-select></select><td><input id=prebuilt-load type=button value="Load Prebuilt Level"></table>',
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
      'storage-menu': '<table><tr><td><input id=beforeunload-warning type=checkbox><td>beforeunload Warning<tr><td><input id=shoot><td>Shoot</table>',
      'title': 'Multiverse.htm',
      'ui': 'Health: <span id=ui-health-current></span>/<span id=ui-health-max></span><br>',
    });

    // Populate prebuilt level select if multiverselevels defined.
    if('multiverselevels' in window){
        let level_select = '';
        for(let level in multiverselevels){
            level_select += '<option value="' + level + '">' + multiverselevels[level] + '</option>';
        }
        document.getElementById('level-select').innerHTML = level_select;
    }

    // Create character export tab.
    core_tab_create({
      'content': '<input id=update-json type=button value="Update Character JSON"><br><textarea id=exported></textarea>',
      'group': 'core-menu',
      'id': 'export',
      'label': 'Export Character',
    });
    core_events_bind({
      'elements': {
        'update-json': {
          'onclick': function(){
              webgl_json_export();
          },
        },
      },
    });
}

function repo_level_load(){
    core_ui_update({
      'ids': {
        'health-max': webgl_characters[webgl_character_id]['health-max'],
      },
    });
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
