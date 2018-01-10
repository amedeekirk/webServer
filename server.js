const express = require('express');
const app = express();
const socket = require('socket.io');
const port = process.env.PORT || 4000;
const words = require('./words');

//App setup
const server = app.listen(port, function(){
    console.log('listening for requests on port ' + port);
});

//Socket setup & pass server
const io = socket(server);

var clients = [];
var line_history = [];
var randomWord;

//Connection handler
io.on('connection', function (socket) {

    //Store socket information and assign role
    console.log('Made connection with: ', socket.id);
    clients.push(socket);
    initialUserRole();
    sendCurrentDrawing();

    //Give previously drawn content to new socket
    function sendCurrentDrawing() {
        for (var i in line_history) {
            socket.emit('drawing_s', line_history[i]);
        }
    }

    //When line comes in from drawer, store and send to other clients
    socket.on('drawing_c', function(data){
        line_history.push(data);
        socket.broadcast.emit('drawing_s', data)
    });

    //If client sends a clear signal, tell all clients to clear canvas
    socket.on('clear_c', function () {
        //also empty line history
        line_history=[];
        io.emit('clear_s')
    });

    socket.on('guess_c', function (guess) {
        //Reduce word and user guess to single word lower-case strings
        var original = randomWord.toLowerCase().toString().replace(/\s/g,'');
        var userGuess = guess.toLowerCase().toString().replace(/\s/g,'');
        if(original == userGuess){
            socket.emit('guess_s', true);
            randomWord = words[Math.floor(Math.random() * words.length)];
            console.log('New word is: ' + randomWord);
            line_history = [];
            io.emit('clear_s');
            io.emit('drawer', randomWord);
            socket.broadcast.emit('guesser');
        }
        else{
            socket.emit('guess_s', false);
        }
    });

    //disconnect handler
    socket.on('disconnect', function () {
        console.log('client %s has disconnected', socket.id);
        var i = clients.indexOf(socket);
        clients.splice(i, 1);
        initialUserRole();
    });

    function initialUserRole() {
        //If only user, generate random word and assign him as 'drawer'
        if(clients.length == 1){
            randomWord = words[Math.floor(Math.random() * words.length)];
            console.log('New word is: ' + randomWord);
            var onlyUser = clients[0].id;
            line_history = [];
            io.emit('clear_s');
            io.to(onlyUser).emit('drawer', randomWord);
        }
        //Otherwise assign 'guesser' role
        else {
            console.log(clients.length);
            socket.emit('guesser');
        }
    }
});
