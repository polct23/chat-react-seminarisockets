import express from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

const app = express();

app.use(cors()); // Habilita CORS para permitir peticiones cross-origin

const server = createServer(app);

// Creamos el servidor de Socket.IO con recuperación de estado de conexión habilitada
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
    connectionStateRecovery: {},
});

// Tipamos el objeto que representa los datos del mensaje
interface MessageData {
    room: string;
    author: string;
    message: string;
    time: string;
}

io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("send_message", (data: MessageData) => {
        console.log(data);
        socket.to(data.room).emit("recieve_message", data);
    });

    socket.on("join_room", (roomId: string) => {
        socket.join(roomId);
        console.log(`User with ID: ${socket.id} joined room: ${roomId}`);
    });
});

server.listen(3001, () => {
    console.log("Server is running on port 3001");
});
