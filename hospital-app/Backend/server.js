const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const db = require('./config/db');
const { Server } = require('socket.io');
const moment = require('moment');


const Doctor = require('./models/doctor');
const Patient = require('./models/patient');
const Consultation = require('./models/consultation');
const Image = require('./models/image');
const Chat = require('./models/Chat');
const Message = require('./models/Message');
const path = require('path');

dotenv.config();
const app = express();
app.use(bodyParser.json());
const PORT = 4000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],       
    },
});

module.exports.io = io;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join('uploads')));
app.use('/', routes);
// app.use('/', chatRoutes);

//Socket io
io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Listen for new messages
    socket.on('send-message', async (messageData) => {
        const { chatId, senderId, message } = messageData;
        const newMessage = await Message.create({
            chatId,
            senderId,
            message,
        });

        // Emit message to both participants
        io.to(chatId).emit('receive-message', newMessage);
    });

    // Listen for a user joining a specific chat room
    socket.on('join-chat', (chatId) => {
        socket.join(chatId);
        console.log(`User joined chat ${chatId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.set('io', io);

db.sync({ alter: true });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});