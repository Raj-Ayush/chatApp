const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000"
      }
});
const bodyParser = require('body-parser');

const users = new Map();

io.on('connection', (socket) => {
    console.log('user connected');

    const userId = (new Date()).getTime();


    users.set(userId, socket);
    io.emit('user_connected', userId);
    socket.on('disconnect', () => {
        console.log('User disconnected');

        users.delete(userId);
        io.emit('user_disconnected', userId);
    });


    socket.on('chat_message', (msg) => {
        io.emit('chat_message_received', {userId, msg});
    });
});

app.use(bodyParser.urlencoded({ extended: true }));
server.listen(5000, () => {
    console.log('server listening on port ' + 5000);
});
