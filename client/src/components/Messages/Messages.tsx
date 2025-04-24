import React from 'react';
import { Message } from '../../types/types';
import './Messages.css';

interface MessagesProps {
  messages: Message[] | null;
}

const Messages: React.FC<MessagesProps> = ({ messages }) => {
  if (!messages || messages.length === 0) {
    return <p>No messages yet.</p>;
  }

  return (
    <div className="messages-container">
      {messages.map((msg, idx) => (
        <div key={idx} className="message">
          <p><strong>Room:</strong> {msg.room}</p>
          <p><strong>Author:</strong> {msg.author}</p>
          <p><strong>Message:</strong> {msg.message}</p>
          <p><strong>Time:</strong> {new Date(msg.time).toLocaleTimeString()}</p>
        </div>
      ))}
    </div>
  );
};

export default Messages;
