'use strict';

function logic(){
    let inventory = '';
    for(let item in webgl_character['inventory']){
        inventory += '<li>' + item + ': ' + webgl_character['inventory'][item];
    }

    core_ui_update({
      'ids': {
        'experience': webgl_character['experience'],
        'health-current': webgl_character['health-current'],
        'health-max': webgl_character['health-max'],
        'inventory': inventory,
        'jump-height': webgl_character['jump-height'],
        'level': webgl_character['level'],
        'speed': webgl_character['speed'],
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
        'load_character': {
          'onclick': function(){
              if(webgl_character_level() < 0
                || window.confirm('Load new character?')){
                  webgl_load_level({
                    'character': 1,
                    'json': document.getElementById('character_json').files[0] || false,
                  });
              }
          },
        },
        'load_level': {
          'onclick': function(){
              webgl_load_level({
                'character': 0,
                'json': document.getElementById('level_json').files[0] || false,
              });
          },
        },
        'load_prebuilt': {
          'onclick': function(){
              ajax_level(document.getElementById('level_select').value);
          },
        },
      },
      'info': '<table><tr><td>Level: <span id=ui-level></span> (<span id=ui-experience></span>)'
        + '<td rowspan=2>Inventory: <ul id=ui-inventory></ul>'
        + '<tr><td>Jump Height: <span id=ui-jump-height></span><br>'
        + 'Speed: <span id=ui-speed></span></table>'
        + '<hr><table><tr><td><input id=character_json type=file><td><input id=load_character type=button value="Load Character From File">'
        + '<tr><td><input id=level_json type=file><td><input id=load_level type=button value="Load Level From File">'
        + '<tr><td><select id=level_select></select><td><input id=load_prebuilt type=button value="Load Prebuilt Level"></table>',
      'keybinds': {
        32: {},
        67: {},
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
      },
      'storage-menu': '<table><tr><td><input id=beforeunload-warning type=checkbox><td>beforeunload Warning</table>',
      'title': 'Multiverse.htm',
      'ui': 'Health: <span id=ui-health-current></span>/<span id=ui-health-max></span><br>',
    });

    // Populate prebuilt level select if multiverselevels defined.
    if('multiverselevels' in window){
        let level_select = '';
        for(let level in multiverselevels){
            level_select += '<option value="' + level + '">' + multiverselevels[level] + '</option>';
        }
        document.getElementById('level_select').innerHTML = level_select;
    }

    // Create character export tab.
    core_tab_create({
      'content': '<input id=update_json type=button value="Update Character JSON"><br><textarea id=exported></textarea>',
      'group': 'core-menu',
      'id': 'export',
      'label': 'Export Character',
    });
    core_events_bind({
      'elements': {
        'update_json': {
          'onclick': function(){
              webgl_json_export();
          },
        },
      },
    });
}
