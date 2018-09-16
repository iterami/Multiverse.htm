'use strict';

function ajax_level(level, character){
    core_ajax({
      'todo': function(responseText){
          webgl_level_load({
            'character': character,
            'json': responseText,
          });
      },
      'url': '../MultiverseLevels.htm/json/' + level + '.json',
    });
}

function equip_item(item, equip){
    webgl_item_equip({
      'character': webgl_character_id,
      'equip': equip,
      'item': item,
    });

    inventory_update();
}

function inventory_update(){
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
        'inventory': inventory,
      },
    });
}
