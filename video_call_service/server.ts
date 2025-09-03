import express from 'express';
import cors from 'cors';
import {Server} from 'socket.io'
import SocketServer from './socketHandle';
import { connectDB } from './config/dbConfig';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(cookieParser());
connectDB();

let server;
const PORT = process.env.PORT || 5009;
server = app.listen(PORT, () => console.log("Server started on port " + PORT));

let io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: '*'
    }
})

io.on('connection', (socket)=> {
    console.log("Socket connected Successfully", socket.id);
    SocketServer(socket, io);
})

