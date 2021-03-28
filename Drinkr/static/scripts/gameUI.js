
var tileWidth = 120;
var tileHeight = 85;

function updateGameData(msg) {
    $('#room_key').text(msg['room_key']);
    updatePlayersList(msg['players']);
    showPlayerMarkers();
    updateRollData(msg['roll'], true);
}

function updatePlayersList(playerList) {
    $('#PlayerList').empty();
    
    playerList.forEach(element => {
        addPlayer(element['id'], element['username'], element['icon'], element['is_host'], false, element['id'] == sessionStorage['drinkr_id']);
    });

    showPlayerMarkers();
}

function addPlayer(id, username, icon, isHost, isActive, isSelf) {
    canKick = isSelfHost();
    $('#PlayerList').append(generatePlayer("player_" + id, username, icon, isHost, isActive, isSelf, canKick));
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

function showPlayerMarkers() {
    $("#playerMarkers").empty();

    Object.keys(players).forEach(function(key) {
        playerMarker = generatePlayerMarker("playerMarker_" + players[key].id, players[key].username, players[key].icon);
        pos = getTilePosition(players[key].current_tile);
        $("#playerMarkers").append(playerMarker);
    });

    positionPlayerMarkers();
}

function positionPlayerMarkers() {

    Object.keys(players).forEach(function(key) {
        playerPos = getTilePosition(players[key].current_tile);
        playerTop = Math.floor(playerPos[0] + (tileHeight / 2));
        playerLeft = Math.floor(playerPos[1] + (tileWidth / 2));

        $("#playerMarker_" + players[key].id).css("top", playerTop + "px");
        $("#playerMarker_" + players[key].id).css("left", playerLeft + "px");
    });
}

function moveRollingPlayer(player) {
    players[player.id].current_tile = player.current_tile;
    positionPlayerMarkers();
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

function togglePersonalDetailsForm() {
    isInitial = players[sessionStorage['drinkr_id']]['icon'] == "";

    if (isInitial) {
        $('#personalDetailsPopup').removeClass("hidden");
        $('#rollDicePopup').addClass("hidden");
    } else {
        $('#personalDetailsPopup').addClass("hidden");
        $('#rollDicePopup').removeClass("hidden");
    }
}

function drawBoard() {
    $("#tiles").empty();

    tileTops = getTileTops();
    tileWidth = $("#GameBoard").width() / (getMaxX() + 3);
    tileHeight = $("#GameBoard").height() / (getMaxY() + 1);

    boardData.forEach(function (element) {
        tile_id = mapData[element.id];
        tile = tileData.find(x => x.id == tile_id);

        tileLeft = (tileWidth * (element.pos_x + 1));
        tileTop = (tileHeight * tileTops[element.pos_y]);

        addTile({id:"tile_" + element.id, name:tile.name, left:tileLeft, top:tileTop, width:tileWidth, height:tileHeight, params:element.parameters})
    });

    positionPlayerMarkers();
}

function addTile(tile) {
    $("#tiles").append(generateTile(tile.id, tile.name, tile.left, tile.top, tile.width, tile.height, tile.params));
}