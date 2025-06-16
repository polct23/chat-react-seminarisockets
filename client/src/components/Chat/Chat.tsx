// src/components/Chat/Chat.tsx
import React, { useEffect, useRef, useState } from 'react';
import './Chat.css';
import { io, Socket } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import { User } from '../../types/types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ChatMessage {
  room: string;
  author: string;
  message: string;
  time: string;
}

const Chat: React.FC = () => {
  const location = useLocation();
  const user = location.state?.user as User; // Accede al usuario pasado por navigate
  const [room, setRoom] = useState('sala1');
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState<ChatMessage[]>([]);
  const [showChat, setShowChat] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    socketRef.current = io('http://localhost:3001', {
      auth: {
        token,
      },
    });

    // Emitir evento new_user al conectar
    socketRef.current.emit('new_user', user.name);

    socketRef.current.on('receive_message', (data: ChatMessage) => {
      console.log('Mensaje recibido:', data);
      setMessageList(prev => [...prev, data]);
    });

    socketRef.current.on('status', (data) => {
      console.debug('Estado recibido:', data);
      if (data.status === 'unauthorized') {
        window.location.href = '/';
      }
    });

    // Escuchar user_connected y mostrar toast
    socketRef.current.on('user_connected', (data: { userId: string; username: string }) => {
      toast.info(`${data.username} se ha conectado al chat`);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user.name]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messageList]);

  const joinRoom = () => {    
    if (room) {
      socketRef.current?.emit('join_room', room);
      setShowChat(true);
    }
  };

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData: ChatMessage = {
        room,
        author: user.name,
        message: currentMessage,
        time: new Date().toLocaleTimeString(),
      };

      await socketRef.current?.emit('send_message', messageData);
      setMessageList(prev => [...prev, messageData]);
      setCurrentMessage('');
    }
  };

  return (
    <div className="chat-container">
      <ToastContainer position="top-right" autoClose={3000} />
      {!showChat ? (
        <div className="join-chat">
          <h2>Bienvenid@ al Chat {user.name}</h2>
          <input
            type="text"
            placeholder="Sala..."
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Unirse a la Sala</button>
        </div>
      ) : (
        <div className="chat-box">
          <div className="chat-header">Sala: {room}</div>
          <div className="chat-body" ref={chatBodyRef}>
            {messageList.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.author === user.name ? 'own' : 'other'}`}
              >
                <div className="bubble">
                  <p>{msg.message}</p>
                  <div className="meta">
                    <span>{msg.author}</span>
                    <span>{msg.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Mensaje..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;