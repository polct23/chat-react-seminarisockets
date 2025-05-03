// src/components/Chat/Chat.tsx
import React, { useEffect, useState } from 'react';
import { Message } from '../../types/types';
import Messages from '../Messages/Messages';
import { useSocket } from '../../hooks/useSocket';
import './Chat.css';

const Chat: React.FC = () => {
  const socket = useSocket();

  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('');
  const [messageList, setMessageList] = useState<Message[] | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data: Message) => {
      setMessageList(prev => (prev ? [...prev, data] : [data]));
    };

    socket.on('recieve_message', handleMessage);

    return () => {
      socket.off('recieve_message', handleMessage);
    };
  }, [socket]);

  const sendMessage = () => {
    if (!socket) return;

    const messageToSend: Message = {
      message,
      room,
      time: new Date().toISOString(),
      author: 'Alicia',
    };

    socket.emit('send_message', messageToSend);
    setMessageList(prev => (prev ? [...prev, messageToSend] : [messageToSend]));
    setMessage('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const joinRoom = () => {
    if (!socket) return;
    socket.emit('join_room', room);
  };

  const handleRoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoom(e.target.value);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chat Room</div>
  
      <div className="chat-input">
        <input placeholder="Room..." value={room} onChange={handleRoom} />
        <button onClick={joinRoom}>Join Room</button>
        <input placeholder="Message..." value={message} onChange={handleChange} />
        <button onClick={sendMessage}>Send Message</button>
      </div>
  
      <div className="messages-container">
        <Messages messages={messageList} />
      </div>
    </div>
  );  
};

export default Chat;
