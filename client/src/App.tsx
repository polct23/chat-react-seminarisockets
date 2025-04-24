import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';
// install socket.io-client: npm add socket.io-client
import { io } from 'socket.io-client';
import { Message } from './types/types';
import Messages from './components/Messages/Messages';
// we have to connect with our socket server (port 3001)
const socket = io('http://localhost:3001');

interface AppState {
  message: Message | null;
  messageRecieved: Message | null;
  messageList: Message[] | null;
}


function App() {

  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('');
  const [messageList, setMessageList] = useState<AppState['messageList']>(null);

  useEffect(() => {
    const handleMessage = (data: Message) => {
      setMessageList(prev => (prev ? [...prev, data] : [data]));
    };
  
    socket.on('recieve_message', handleMessage);
  
    return () => {
      socket.off('recieve_message', handleMessage); // 👈 limpia el listener al desmontar
    };
  }, []);



  const sendMessage = () => {
    // the event is sent to the server, who sends it to all clients
      const messageToSend: Message = {
        message, // Incluye los datos actuales del mensaje
        room,
        time: new Date().toISOString(), // Agrega la fecha actual al campo correspondiente
        author: 'Alicia',
      };
    
    socket.emit('send_message', messageToSend);
    setMessageList((prevMessages) => {
      if (prevMessages) {
        return [...prevMessages, messageToSend];
      } else {
        return [messageToSend];
      }
    });
    setMessage(''); // limpia el input si quieres
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const joinRoom = () => {
    const randomRoom = Math.floor(Math.random() * 1000).toString(); // Genera un número aleatorio entre 0 y 999
    setRoom(randomRoom); // Asigna el número aleatorio a la sala 
    socket.emit('join_room', room);
  };

  return (
    <div className="App">
      <button onClick={joinRoom}>Join Room</button>
      <input 
        placeholder='Message...' 
        onChange={handleChange}
      />
      <button onClick={sendMessage}>Send Message</button>
      <Messages messages={messageList} />
    </div>
  );
}

export default App;
