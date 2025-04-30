// chatbot //
import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userId = localStorage.getItem('userId');
    const userMessage = { sender: 'user', text: message };

    setChatLog((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post('http://localhost:5000/api/chatbot/chat', {
        message,
        userId,
      });

      const botMessage = {
        sender: 'bot',
        text: res.data.response,
      };

      setChatLog((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chatbot error:', err);
      setChatLog((prev) => [
        ...prev,
        { sender: 'bot', text: 'Something went wrong. Try again later.' },
      ]);
    }

    setMessage('');
  };

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-header" onClick={() => setIsMinimized(!isMinimized)}>
        <h2>🤖 Chat Assistant</h2>
        <button className="minimize-button">{isMinimized ? '🔼' : '🔽'}</button>
      </div>

      {!isMinimized && (
        <>
          <div className="chat-log">
            {chatLog.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask about orders, menu, or suggestions..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;



