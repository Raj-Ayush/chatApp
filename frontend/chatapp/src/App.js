import React, { useState, useEffect } from "react";
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000', {forceNew: true});

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  useEffect(() => {
    console.log("i am calling");
    socket.on('user_connected', (id) => {
      setUserId(id);
    })
    socket.on('chat_message_received', ({userId, msg}) => {
      setMessages((prevMessages) => [...prevMessages, {userId, msg }] );
    });

    socket.on('user_disconnected', (id) => {
      setMessages((prevMessages) => [
        ...prevMessages, {userId: 'System', msg: `User ${id}`}],
      )
    });
    return () => {
      socket.off('user_connected');
      socket.off('chat_message_received');
      socket.off('user_disconnected');
    }

  }, []);

  const sendMessage = () => {
    socket.emit('chat_message', message);
    setMessage('');
  }
  return (
    <div className="App">
      <ul>
        {messages.map((msg, index) => {
          return (
          <li key={index}>
            {msg.userId === 'System' ? (
              <strong>{msg.msg}</strong>
            ): (
                <span>
                  <strong>{msg.userId}: </strong>
                  {msg.msg}
                </span>
              )
            }
          </li>
          )
        })}
      </ul>
      <input type="text" value={message} onChange= {(e) => setMessage(e.target.value)}/>
      <button onClick = {sendMessage}>Send</button>
    </div>
  );
}

export default App;
