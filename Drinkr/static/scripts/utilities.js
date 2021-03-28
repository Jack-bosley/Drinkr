
function getCurrentPlayer(sequence) {
    for (p in players)
        if (players[p].sequence == sequence)
            return p;
    return null;
}

function isSelfHost(){
    return players[sessionStorage['drinkr_id']].is_host;
}

function parseTileMapping(mappingString) {
    tiles = {};

    var tileMaps = mappingString.split("|");
    tileMaps.forEach(function(element) {
        var map = element.split(":");

        var place = map[0];
        var tile = map[1];

        tiles[place] = tile;
    });

    return tiles;
}

function getMaxY() {
    maxY = 0;
    for (i = 0; i < boardData.length; i++) {
        maxY = Math.max(boardData[i].pos_y, maxY)
    }
    return maxY;
}

function getMaxX() {
    maxX = 0;
    for (i = 0; i < boardData.length; i++) {
        maxX = Math.max(boardData[i].pos_x, maxX)
    }
    return maxX;
}

function getTileTops() {
    maxY = getMaxY();

    tileTops = {};
    for (i = 0; i < boardData.length; i++) {
        tileTops[boardData[i].pos_y] = 1;
    }

    tileTops[0] = 1;
    for (i = 0; i <= maxY; i++) {
        if (i != 0) {
            if (i in tileTops)
                tileTops[i] = tileTops[i - 1] + tileTops[i];
            else 
                tileTops[i] = tileTops[i - 1] + 0.5;
        }
    }

    return tileTops;
}

function getTilePosition(tileId) {
    tileTop = parseFloat($("#tile_" + tileId).css('top').replace('px', ''));
    tileLeft = parseFloat($("#tile_" + tileId).css('left').replace('px', ''));
    return [tileTop, tileLeft];
}

function getNextTiles(current) {
    return connectionData.find(x => x.start == current);
}