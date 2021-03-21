
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