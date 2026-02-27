import React, { useState } from 'react';
import './Community.css';

function Community() {
  const [messages, setMessages] = useState([
    {
      user: 'Ali',
      text: 'Does anyone know a good ENT specialist in Lahore?',
      date: '2026-02-25',
    },
    {
      user: 'Fatima',
      text: 'Dr. Imran Siddiqui is great for skin issues!',
      date: '2026-02-26',
    },
  ]);
  const [input, setInput] = useState('');

  const handlePost = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([
        ...messages,
        {
          user: 'You',
          text: input,
          date: new Date().toISOString().slice(0, 10),
        },
      ]);
      setInput('');
    }
  };

  return (
    <div className="community-container">
      <h2 className="community-title">Community Board</h2>
      <form className="community-form" onSubmit={handlePost}>
        <input
          className="community-input"
          type="text"
          placeholder="Post a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button className="community-post-btn" type="submit">Post</button>
      </form>
      <div className="community-messages">
        {messages.map((msg, idx) => (
          <div className="community-message" key={idx}>
            <div className="community-message-user">{msg.user}</div>
            <div className="community-message-text">{msg.text}</div>
            <div className="community-message-date">{msg.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Community;
