import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:4000'); 

const ChatComponent = ({ consultationId, patientId, doctorId }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [chatId, setChatId] = useState(null);

    useEffect(() => {
        // Fetch the chat for the consultation
        const fetchChat = async () => {
            const response = await axios.get(`http://localhost:4000/api/chats/${consultationId}`);
            setChatId(response.data.chatId);
        };

        fetchChat();

        // Join the chat room
        if (chatId) {
            socket.emit('join-chat', chatId);
        }

        // Listen for new messages
        socket.on('receive-message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off('receive-message');
        };
    }, [consultationId, chatId]);

    const handleSendMessage = () => {
        if (message.trim()) {
            const messageData = {
                chatId,
                senderId: patientId, // or doctorId based on the user type
                message,
            };
            socket.emit('send-message', messageData);
            setMessage('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <span>{msg.senderId === patientId ? 'You' : 'Doctor'}: </span>
                        <span>{msg.message}</span>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default ChatComponent;
