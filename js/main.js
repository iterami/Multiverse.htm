'use strict';

function repo_escape(){
    if(webgl_character_level() < 0){
        return;
    }

    if(core_menu_open){
        charactersheet_update();

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
              if(webgl_character_level() < 0
                || globalThis.confirm('Load new character?')){
                  webgl_level_unload();
                  webgl_level_load({
                    'character': 1,
                    'json': document.getElementById('character-json').files[0] || false,
                  });
              }
          },
        },
        'home': {
          'onclick': function(){
              if(webgl_character_level() > -1){
                  webgl_character_home();
                  core_escape();
              }
          },
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
                || globalThis.confirm('Load new character?')){
                  webgl_level_unload();
                  ajax_level(
                    document.getElementById('character-select').value,
                    1
                  );
              }
          },
        },
        'prebuilt-load-level': {
          'onclick': function(){
              if(webgl_character_level() > -1){
                  ajax_level(
                    document.getElementById('level-select').value,
                    0
                  );
              }
          },
        },
        'update-json': {
          'onclick': function(){
              document.getElementById('exported').value = webgl_json_export();
          },
        },
      },
      'info': '<table><tr><td>Level: <span id=level></span> (<span id=experience></span>)<br>'
        + 'Health: <span class=health-current></span>/<span class=health-max></span>'
        + '<td>Jump Height: <span id=jump-height></span> (x<span id=multiplier-jump></span>)<br>'
        + 'Speed: <span id=speed></span> (x<span id=multiplier-speed></span>)'
        + '<tr><td colspan=2><span id=character-tabs></span><div id=character-tabcontent></div></table>'
        + '<input id=home value="Return Home" type=button>',
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
        'mousewheel': {
          'todo': webgl_camera_zoom,
        },
      },
      'storage': {
        'beforeunload-warning': true,
        'shoot': 70,
      },
      'storage-menu': '<table><tr><td><input id=beforeunload-warning type=checkbox><td>beforeunload Warning'
        + '<tr><td><input class=mini id=shoot><td>Shoot</table>',
      'tabs': {
        'export': {
          'content': '<input id=update-json type=button value="Update Character JSON"><br><textarea id=exported></textarea>',
          'group': 'core-menu',
          'label': 'Export Character',
        },
        'inventory': {
          'content': '<table id=inventory></table>',
          'default': true,
          'group': 'character',
          'label': 'inventory',
        },
        'load': {
          'content': '<table><tr>'
              + '<td>'
              + '<td><input id=character-random type=button value="Create Random Character">'
            + '<tr>'
              + '<td><input id=character-json type=file>'
              + '<td><input id=character-load type=button value="Load Character From File">'
            + '<tr>'
              + '<td><select id=character-select></select>'
              + '<td><input id=prebuilt-load-character type=button value="Load Prebuilt Character">'
            + '<tr>'
              + '<td><input id=level-json type=file>'
              + '<td><input id=level-load type=button value="Load Level From File">'
            + '<tr>'
              + '<td><select id=level-select></select>'
              + '<td><input id=prebuilt-load-level type=button value="Load Prebuilt Level"></table>',
          'default': true,
          'group': 'core-menu',
          'label': 'Load Characters/Levels',
        },
      },
      'title': 'Multiverse.htm',
      'ui': 'Health: <span id=health-current></span>/<span id=health-max></span>'
        + '<div id=npc></div><div id=npc-talk></div><div id=npc-trade></div>',
    });
    webgl_settings_init();

    // Populate prebuilt character/level selects if defined.
    if('multiversecharacters' in globalThis){
        let character_select = '';
        for(const character in multiversecharacters){
            character_select += '<option value="' + character + '">' + multiversecharacters[character] + '</option>';
        }
        document.getElementById('character-select').innerHTML = character_select;
    }
    if('multiverselevels' in globalThis){
        let level_select = '';
        for(const level in multiverselevels){
            level_select += '<option value="' + level + '">' + multiverselevels[level] + '</option>';
        }
        document.getElementById('level-select').innerHTML = level_select;
    }

    // Handle prebuilt character/level url args.
    const level_arg = globalThis.location.search.substring(1);
    if(level_arg.length > 0){
        ajax_level(
          level_arg,
          2
        );
    }
}

function repo_logic(){
    let inventory = webgl_characters[webgl_character_id]['inventory'];
    for(const item in inventory){
        if(!inventory[item]['equipped']){
            continue;
        }

        if(core_keys[core_storage_data['shoot']]['state']
          && webgl_characters[webgl_character_id]['health-current'] > 0
          && inventory[item]['spell'] !== false){
            const properties = {};
            Object.assign(
              properties,
              inventory[item]['spell']
            );
            properties['parent'] = webgl_characters[webgl_character_id];
            webgl_particles_create(properties);
        }
    }

    core_ui_update({
      'ids': {
        'health-current': webgl_characters[webgl_character_id]['health-current'],
      },
    });
}
