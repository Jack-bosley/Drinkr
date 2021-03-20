
var socket;

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

        updateGameData(msg);
        updateBoardData(msg['board_data']);
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
    addTile({id:"tile_1", name:"Drink", left:"100px", top:"100px", width:"100px", height:"150px"})
});