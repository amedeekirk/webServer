const express = require('express');

const app = express();
const socket = require('socket.io');

const port = process.env.PORT || 4000;
const words = require('./words');


app.use(express.static(`${__dirname}/public`));

// App setup
const server = app.listen(port, () => {
  console.log(`listening for requests on port ${port}`);
});

// Socket setup & pass server
const io = socket(server);

const clients = [];
let lineHistory = [];
let randomWord;

// Connection handler
io.on('connection', (socket) => {
  function initialUserRole() {
    console.log(clients.length);
    // If only user, generate random word and assign him as 'drawer'
    if (clients.length === 1) {
      randomWord = words[Math.floor(Math.random() * words.length)];
      console.log(`   --New word is: ${randomWord}`);
      const onlyUser = clients[0].id;
      lineHistory = [];
      io.emit('serverEmitClear');
      io.to(onlyUser).emit('drawer', randomWord);
    }
    // Otherwise assign 'guesser' role
    else {
      socket.emit('guesser');
    }
  }

  // Give previously drawn content to new socket
  function sendCurrentDrawing() {
    Object.keys(lineHistory).forEach((key) => {
      socket.emit('serverEmitDrawing', lineHistory[key]);
    });
  }

  // Store socket information and assign role
  console.log('   --Made connection with: ', socket.id);
  clients.push(socket);
  initialUserRole();
  sendCurrentDrawing();

  console.log(`   --Current amount of players: ${clients.length}`);

  // When line comes in from drawer, store and send to other clients
  socket.on('clientEmitDrawing', (data) => {
    lineHistory.push(data);
    socket.broadcast.emit('serverEmitDrawing', data);
  });

  // If client sends a clear signal, tell all clients to clear canvas
  socket.on('clientEmitClear', () => {
    // also empty line history
    lineHistory = [];
    io.emit('serverEmitClear');
  });

  socket.on('clientEmitGuess', (guess) => {
    // Reduce word and user guess to single word lower-case strings
    const original = randomWord.toLowerCase().toString().replace(/\s/g, '');
    const userGuess = guess.toLowerCase().toString().replace(/\s/g, '');
    if (original === userGuess) {
      socket.emit('serverEmitGuess', true);
      randomWord = words[Math.floor(Math.random() * words.length)];
      console.log(`   --New word is: ${randomWord}`);
      lineHistory = [];
      io.emit('serverEmitClear');
      io.emit('drawer', randomWord);
      socket.broadcast.emit('guesser');
    } else {
      socket.emit('serverEmitGuess', false);
    }
  });

  // disconnect handler
  socket.on('disconnect', () => {
    console.log('   --client %s has disconnected', socket.id);
    const i = clients.indexOf(socket);
    clients.splice(i, 1);
    initialUserRole();
  });
});
