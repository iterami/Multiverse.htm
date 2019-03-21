'use strict';

function ajax_level(level, character){
    if(character === void 0){
        character = level in multiversecharacters
          ? 1
          : 0;
    }

    if(webgl_levelcache['id'] === level){
        webgl_level_load({
          'character': character,
          'json': webgl_levelcache['json'],
        });

    }else{
        core_ajax({
          'todo': function(responseText){
              webgl_level_load({
                'cache': level,
                'character': character,
                'json': responseText,
              });
          },
          'url': '../MultiverseLevels.htm/json/' + level + '.json',
        });
    }

    if(character === 2){
        webgl_character_random({
          'id': '_me',
        });
    }
}

function equip_item(item, equip){
    webgl_item_equip({
      'character': webgl_character_id,
      'equip': equip,
      'item': item,
    });

    charactersheet_update();
}

function charactersheet_update(){
    let inventory = '';
    for(let item in webgl_characters[webgl_character_id]['inventory']){
        inventory += '<tr><td>' + item
          + '<td>' + webgl_characters[webgl_character_id]['inventory'][item]['amount']
          + '<td><input type=button onclick="equip_item(\'' + item + '\',';

        inventory += webgl_characters[webgl_character_id]['inventory'][item]['equipped']
          ? 'false)" value=unequip>'
          : 'true)" value=equip>';
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
