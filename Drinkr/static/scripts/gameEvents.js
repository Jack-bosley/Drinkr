
var socket;
var players = {};

$(document).ready(function() {
    // Connect to the Socket.IO server.
    socket = io();
    
    // When told to redirect by the server: do it
    socket.on('redirect', function (msg, cb) {
        window.location = msg['url'];
    });
    
    // When somebody joins / leaves
    socket.on('receive_game_data', function(msg, cb) {
        players = {};
        msg['players'].forEach(player => {
            players[player.id] = player;
        });

        console.log(players);

        if (sessionStorage['drinkr_id'] in players) {
            updateGameData(msg);
            togglePersonalDetailsForm(msg['personal_data']);

            if (msg['board_data'] != null)
                updateBoardData(msg['tile_mapping'][0].tile_sequence, msg['board_data'], msg['tile_data']);
        } else {
            window.location = msg['redirect'];
        }
    });
    
    // When somebody has rolled
    socket.on('receive_roll_data', function(msg, cb) {
        updateRollData(msg['roll']);
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

function kickRequest(data) {
    socket.emit('leave', {
        'room_key': sessionStorage['room_key'],
        'leaving_id': data.replace("player_", ""),
    });
}

function selectIcon(icon) {
    $(".icon-select").removeClass("selected-icon");
    $(icon).addClass("selected-icon");

    players[sessionStorage['drinkr_id']]['icon'] = $(icon).attr('alt');
}