
var tileWidth = 100;
var tileHeight = 80;

function updateGameData(msg) {
    $('#room_key').text(msg['room_key']);
    updatePlayersList(msg['players']);
    updateRollData(msg['roll'], true);
}

function updatePlayersList(playerList) {
    $('#PlayerList').empty();
    
    console.log(playerList);
    playerList.forEach(element => {
        addPlayer(element['id'], element['username'], element['is_host'], false, element['id'] == sessionStorage['drinkr_id']);
    });
}

function addPlayer(id, username, isHost, isActive, isSelf) {
    canKick = isSelfHost();
    $('#PlayerList').append(generatePlayer("player_" + id, username, isHost, isActive, isSelf, canKick));
}

function kickPlayer(data) {
    console.log(kickPlayer);
}

function updateRollData(turn, isInnit = false) {
    player_count = Object.keys(players).length;
    sequence = turn['current_turn'] % player_count;
    current = getCurrentPlayer(sequence);
    showCurrentPlayer(current);

    if (turn['last_roller'] != "") {
        rollValue = turn['last_roll'];

        username = "[[Quitter]]";
        if (turn['last_roller'] in players) {
            username = players[turn['last_roller']].username;
            players[turn['last_roller']].current_tile += turn[username];
        }

        showRoll(username, rollValue);
        showPlayerPositions();
    }
    showRollForm(current, isInnit ? 0 : 1000);
}

function showCurrentPlayer(player) {
    for (p in players) { 
        $("#player_" + p).removeClass("player-active");
    }
    $("#player_" + player).addClass("player-active");
}

function showRoll(roller, val) {
    $('#roller').text(roller);
    $('#roll-value').text(val);
    $('#last-roll-value').text(val);
}

function showPlayerPositions() {

}

function showRollForm(player, delay = 1000) {
    // If the player is the new roller, show them the popup box
    if (player == sessionStorage['drinkr_id']) {
        $("#rollDiceSubmit").removeAttr('disabled');
        $('#roll-value').text("");
        $('#rollDicePopup').animate({
            top: '50%',
        }, 500);
    } else {
        // if they are not the roller, Slide the popup off screen in case they were the previous roller (after a short delay to read the contents)
        $('#rollDicePopup').delay(delay).animate({
            top: '-' + $('#rollDicePopup').height() + "px",
        }, 500);
    }
}



function updateBoardData(tileMapping, boardData, tileData) {
    $("#tiles").empty();
    
    map = parseTileMapping(tileMapping);
    boardData.forEach(function (element) {
        tile_id = map[element.sequence];
        tile = tileData.find(x => x.id == tile_id);

        tileLeft = (tileWidth * (element.pos_x + 1)) + "px";
        tileTop = (tileHeight * (element.pos_y + 1)) + "px";

        addTile({id:"tile_" + element.sequence, name:tile.name, left:tileLeft, top:tileTop, width:tileWidth + "px", height:tileHeight + "px"})
    });
}

function addTile(tile) {
    $("#tiles").append(generateTile(tile.id, tile.name, tile.left, tile.top, tile.width, tile.height));
}