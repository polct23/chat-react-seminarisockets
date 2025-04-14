const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express(); // express initializes app to be a function handles


app.use(cors()); // use cors middleware to allow cross-origin requests
const server = createServer(app); // we supply the app to the server
//HOW TO HANDLE DICONNECTS SO THAT THE USER DON'T MISS MESSAGES ON TEMPORARY DISCONNECTIONS
//                    CONNECTION STATE RECOVERY
const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000", // allow requests from this origin
        methods: ["GET", "POST"], // allow these methods
    },
    connectionStateRecovery: {}
}); // we create a socket server that uses the HTTP server;

io.on("connection", (socket) => { 
    console.log(`User connected: ${socket.id}`); // log to the console when a user connects

    socket.on("send_message", (data) => { 
        console.log(data); // log the message to the console
    // broadcast to send a message to everyone except the sender
        //socket.broadcast.emit("recieve_message", data); 
    // send mmessage to everyone in the room
        socket.to(data.room).emit("recieve_message", data);
    });

    socket.on("join_room", (data)=>{
        socket.join(data); // join the room
        console.log(`User with ID: ${socket.id} joined room: ${data}`); // log to the console when a user joins a room
    })

});

server.listen(3001, () => {
    console.log("Server is running on port 3001"); // log to the console when the server starts
});