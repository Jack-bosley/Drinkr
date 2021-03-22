
var socket;

$(document).ready(function() {
    // Connect to the Socket.IO server.
    socket = io();
    
    // When told to redirect by the server: do it
    socket.on('redirect', function (msg, cb) {
        window.location = msg['url'];
    });
    
    socket.on('ping', function (msg, cb) {
        socket.emit('pong', 'pong_user', sessionStorage['drinkr_id']);
    })

    // When somebody joins / leaves
    socket.on('receive_game_data', function(msg, cb) {
        players = {};
        msg['players'].forEach(player => {
            players[player.id] = player;
        });

        console.log(players);

        if (sessionStorage['drinkr_id'] in players) {
            updateGameData(msg);

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
    });

    console.log("START");
});

function kickRequest(data) {
    socket.emit('leave', {
        'room_key': sessionStorage['room_key'],
        'leaving_id': data.replace("player_", ""),
    });
}