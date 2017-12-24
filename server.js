var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(process.env.PORT || 4000, function(){
    console.log('listening for requests on port 4000,');
});

//Socket setup & pass server
var io = socket(server);

var clients = [];
var line_history = [];

// event-handler for new incoming connections
io.on('connection', function (socket) {
    console.log('made socket connection', socket.id);
    clients.push(socket);
    // first send the history to the new client
    for (var i in line_history) {
        socket.emit('draw_line', {line: line_history[i]});
    }

    // add handler for message type "draw_line".
    socket.on('draw_line', function (data) {
        //add received line to history
        line_history.push(data.line);
        //send line to all clients
        io.emit('draw_line', {line: data.line});
    });

    socket.on('clear', function (data) {
        console.log("clearing canvas...");
        //empty line history
        line_history = [];
        //indicate for client browsers to clear their canvas
        io.emit('clear canvas');
    });

    socket.on('disconnect', function () {
        console.log('client %s has disconnected', socket.id);
        var i = clients.indexOf(socket);
        clients.splice(i, 1);
    });
});