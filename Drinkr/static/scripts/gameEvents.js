
var socket;
var players = {};
var boardData = {};
var mapData = {};
var tileData = {};
var connectionData = {};

$(document).ready(function() {
    // Connect to the Socket.IO server.
    socket = io();
    
    // When told to redirect by the server: do it
    socket.on('redirect', function (msg, cb) {
        window.location = msg['url'];
    });
    
    // When somebody joins / leaves
    socket.on('receive_game_data', function(msg, cb) {
        console.log('receive_game_data');
        console.log(msg);

        if (msg['players'] != null) 
        {
            players = {};
            msg['players'].forEach(player => {
                players[player.id] = player;
            });
        }
        if (msg['board_data'] != null)
        {
            boardData = msg['board_data'];
            mapData = parseTileMapping(msg['tile_mapping'][0].tile_sequence);
            tileData = msg['tile_data'];
            connectionData = msg['connection_data'];
        }


        if (sessionStorage['drinkr_id'] in players) {
            if (msg['board_data'] != null)
            {
                drawBoard();
            }
            
            updateGameData(msg);
            togglePersonalDetailsForm();

        } else {
            window.location = msg['redirect'];
        }
    });

    socket.on('receive_player_data', function(msg, cb){
        console.log('receive_player_data');
        console.log(msg);

        players = {};
        msg['players'].forEach(player => {
            players[player.id] = player;
        });

        updatePlayersList(msg['players']);
    });
    
    // When somebody has rolled
    socket.on('receive_roll_data', function(msg, cb) {
        console.log('receive_roll_data');
        console.log(msg);

        updateRollData(msg['roll']);
        moveRollingPlayer(msg['rollingPlayer']);
    });


    $('form#personalDetails').submit(function(event) {

        if ('icon' in players[sessionStorage['drinkr_id']]) {
            socket.emit('send_player_details', {
                'room_key': sessionStorage['room_key'],
                'id': sessionStorage['drinkr_id'],
                'icon': players[sessionStorage['drinkr_id']]['icon'],
            });
            $('#personalDetailsPopup').addClass("hidden");
            $('#rollDicePopup').removeClass("hidden");
        } else {
            console.log("No icon selected");
        }

        return false;
    });

    // When submitting the form to join or host a game room, a web socket must be emitted to update the server
    $('form#rollDice').submit(function(event) {
        // Prevent multiple submissions
        $("#rollDiceSubmit").attr('disabled','disabled');
        
        // Send off the request for the server to roll the dice
        socket.emit('request_roll_data', {
            'room_key': sessionStorage['room_key'],
            'rolling_id': sessionStorage['drinkr_id'],
        });
        
        return false;
    });


    socket.emit('request_game_data', {
        'room_key': sessionStorage['room_key'],
        'player_id': sessionStorage['drinkr_id'],
    });

    console.log("START");
});


window.onresize = drawBoard;

function kickRequest(data) {
    socket.emit('leave', {
        'room_key': sessionStorage['room_key'],
        'leaving_id': data.replace("player_", ""),
    });
}

function selectIcon(icon) {
    $(".icon-select").removeClass("selected-icon");
    $(icon).addClass("selected-icon");

    console.log("SELECTED" + $(icon).attr('alt'));
    players[sessionStorage['drinkr_id']]['icon'] = $(icon).attr('alt');
}