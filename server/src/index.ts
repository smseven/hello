import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  maxHttpBufferSize: 5 * 1024 * 1024, // 5MB
});

interface User {
  id: string;
  roomId: string;
}

const users: Record<string, User> = {};
const socketToRoom: Record<string, string> = {};

io.on('connection', (socket: Socket) => {
  console.log('User connected:', socket.id);

  socket.on('join room', (roomId: string) => {
    if (socketToRoom[socket.id]) {
      // already in a room? leave first
      socket.leave(socketToRoom[socket.id]);
    }
    socket.join(roomId);
    socketToRoom[socket.id] = roomId;
    users[socket.id] = { id: socket.id, roomId };

    // Get other users in the room
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    const otherUsers = clients.filter(id => id !== socket.id);

    // Send list of other users to the new user
    socket.emit('all users', otherUsers);

    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('sending signal', (payload: { userToSignal: string; callerID: string; signal: any }) => {
    io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
  });

  socket.on('returning signal', (payload: { callerID: string; signal: any; id: string }) => { // id is the server socket id of the receiver (which is the original caller)
    io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
  });

  socket.on('chat message', (payload: { roomId: string; message?: string; image?: string; type?: 'text' | 'image'; from: string }) => {
     io.to(payload.roomId).emit('chat message', payload);
  });

  socket.on('draw', (payload: { roomId: string; data: any }) => {
    socket.to(payload.roomId).emit('draw', payload.data);
  });

  socket.on('disconnect', () => {
    const roomId = socketToRoom[socket.id];
    if (roomId) {
        socket.to(roomId).emit('user left', socket.id);
    }
    delete users[socket.id];
    delete socketToRoom[socket.id];
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
