
function updateGameData(msg) {
    $('#room_key').text(msg['room_key']);
    updatePlayersList(msg['players']);
    updateRollData(msg['roll'], true);
}

function updatePlayersList(playerList) {
    $('#PlayerList').empty();
    
    playerList.forEach(element => {
        addPlayer(element['id'], element['username'], element['is_host'], false, element['id'] == sessionStorage['drinkr_id']);
    });
}

function addPlayer(id, username, isHost, isActive, isSelf) {
    classes = "";
    classes += isHost == 1 ? "host" : "";
    classes += isActive == 1 ? " active" : "";
    classes += isSelf == 1 ? " self" : "";

    host_icon = isHost == 1 ? "<img class='host-icon'> </img>" : "";

    $('#PlayerList').append("<li class='" + classes + "' id='player_" + id + "'>" + username + " " + host_icon + "</li>");
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
        $("#player_" + p).removeClass("active");
    }
    $("#player_" + player).addClass("active");
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



function updateBoardData(boardData) {
    console.log(boardData);
}

function generateTile(id, name, left, top, width, height) {
    tile = $(document.getElementById('tileTemplate').content.cloneNode(true)).contents();
    console.log(tile.id);
    tile.attr("id", id);
    console.log(tile.id);

    tile.css("left", left);
    tile.css("top", top);
    tile.css("width", width);
    tile.css("height", height);
    tile.find("#tileName").text(name);

    return tile;
}

function addTile(tile) {
    $("#GameBoard").append(generateTile(tile.id, tile.name, tile.left, tile.top, tile.width, tile.height));
}