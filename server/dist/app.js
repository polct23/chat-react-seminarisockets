"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // Habilita CORS para permitir peticiones cross-origin
const server = (0, node_http_1.createServer)(app);
// Creamos el servidor de Socket.IO con recuperación de estado de conexión habilitada
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
    connectionStateRecovery: {},
});
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on("send_message", (data) => {
        console.log(data);
        socket.to(data.room).emit("recieve_message", data);
    });
    socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.log(`User with ID: ${socket.id} joined room: ${roomId}`);
    });
});
server.listen(3001, () => {
    console.log("Server is running on port 3001");
});
