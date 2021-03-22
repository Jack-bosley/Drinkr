
function generateTile(id, name, left, top, width, height) {
    tile = $(document.getElementById('tileTemplate').content.cloneNode(true)).contents();
    tile.attr("id", id);

    tile.css("left", left);
    tile.css("top", top);
    tile.css("width", width);
    tile.css("height", height);
    tile.find("#tileName").text(name);

    return tile;
}

function generatePlayer(id, name, isHost, isActive, isSelf, canKick) {
    player = $(document.getElementById('playerListTemplate').content.cloneNode(true)).contents();
    player.attr("id", id);

    player.append(name);


    if (isActive)
    {
        player.addClass('player player-active');
    }

    if (isHost) 
    {
        player.addClass('player player-host');
        player.append("<img class='host-icon'> </img>");
    }

    if (isSelf)
    {
        player.addClass('player player-self');
    }


    if (canKick && !isSelf) {
        player.find("#kickIcon").attr("onClick", 'kickRequest("' + id + '")');
    } else {
        player.find("#kickIcon").remove();
    }

    return player;
}