
function generateTile(id, name, left, top, width, height, params) {
    doubleHeight = params.includes('dh,');
    if (doubleHeight) {
        height = height * 2;
    }

    tile = $(document.getElementById('tileTemplate').content.cloneNode(true)).contents();
    tile.attr("id", id);

    tile.css("left", left + "px");
    tile.css("top", top + "px");
    tile.css("width", width + "px");
    tile.css("height", height + "px");
    tile.find("#tileName").text(name);
    tile.find("#tileName").css("height", "100%");

    if (doubleHeight) {
        tile.find("#tileName").addClass("tileVerticalCenter");
        tile.css("border-radius", "100% 0% 0% 100%");
    }
    return tile;
}

function generatePlayer(id, name, icon, isHost, isActive, isSelf, canKick) {

    player = $(document.getElementById('playerListTemplate').content.cloneNode(true)).contents();
    player.attr("id", id);

    player.find("#playerName").append(name);


    if (isActive)
    {
        player.addClass('player player-active');
    }

    if (isHost) 
    {
        player.addClass('player player-host');
        player.find("#playerName").append("<img class='host-icon'> </img>");
    }

    if (isSelf)
    {
        player.addClass('player player-self');
    }


    player.find('.player-icon').attr('src', '../static/images/icons/' + icon + ".png");

    if (canKick && !isSelf) {
        player.find(".kick-icon").attr("onClick", 'kickRequest("' + id + '")');
    } else {
        player.find(".kick-icon").remove();
    }

    return player;
}

function generatePlayerMarker(id, name, icon) {
    player = $(document.getElementById('playerMarkerTemplate').content.cloneNode(true)).contents();
    player.attr("id", id);

    player.find('.player-icon').attr('src', '../static/images/icons/' + icon + ".png");

    return player;

}