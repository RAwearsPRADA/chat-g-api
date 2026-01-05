import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import { SocketAddress } from 'net';
import { v1 } from 'uuid';

const users = []
const rooms = []

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling']
});


io.on('connection', (socket) => {
    socket.emit('welcome', {
        message: 'Welcome',
        yourId: socket.id
    })
    socket.on('join-room', (roomId) => {
        socket.join(roomId)

        socket.to(roomId).emit('user-joined', {
            userId: socket.id,
            timestamp: new Date()
        })
    })
    socket.on('send-message', ({roomId, text}) => {
        socket.to(roomId).emit('new-message', {
            from: socket.id,
            text,
            time: new Date()
        })
    })
})
app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => {
    res.json({
        status: `It's okay`
    });
});

app.get('/api/users', (_, res) => {
    res.json({
        users
    })
})

app.get('/api/generate-room-id', (_, res) => {
    res.json({
        roomId: v1()
    })
})

app.post('/api/new-user', (req, res) => {
    if ('name' in req.body) {
    const {name} = req.body
    users.push(name)
    res.json({
        status: 'ok',
        message: 'User was successfully added',
        users: users
    })
}
    else{
        res.json({
            status: 'rejected',
            message: 'Request must have name'
        })
    }
})

app.post('/api/join-room/:id', (req, res) => {
    const roomId = req.params.id
    if (roomId in rooms) {
        1 + 1
    }
})

const PORT = 3001;

server.listen(PORT, () => {
    console.log(`Server started on ${PORT} PORT`);
});