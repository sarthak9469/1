const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Create a chat session or return an existing one
exports.createChatSession = async (req, res) => {
    const { consultationId, doctorId, patientId } = req.body;

    try {
        // Check if the chat session already exists
        let chat = await Chat.findOne({ where: { consultationId } });

        if (!chat) {
            chat = await Chat.create({ consultationId, doctorId, patientId });
        }

        res.status(200).json({ message: 'Chat session ready', chat });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating or fetching chat session.' });
    }
};

// Send a message in the chat
exports.sendMessage = async (req, res) => {
    const { chatId, senderId, message } = req.body;

    try {
        // Check if the chat session exists
        const chat = await Chat.findByPk(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat session not found.' });
        }

        // Create a new message in the chat session
        const newMessage = await Message.create({
            chatId, // Use the correct chat ID as foreign key
            senderId,
            message,
        });

        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error sending message.' });
    }
};

// Get messages for a specific chat session
exports.getMessages = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findByPk(chatId, {
            include: {
                model: Message,
                order: [['createdAt', 'ASC']],
            },
        });

        if (!chat) {
            return res.status(404).json({ message: 'Chat session not found.' });
        }

        res.status(200).json({ chat });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching messages.' });
    }
};
