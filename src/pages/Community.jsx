import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import './Community.css';

function Community() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setMessages(data);
    }

    setLoading(false);
  };

  fetchPosts();

  // 🔥 REALTIME LISTENER
  const channel = supabase
    .channel('community_posts')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'community_posts',
      },
      (payload) => {
        setMessages((prev) => [payload.new, ...prev]);
      }
    )
    .subscribe();

  // 🧹 Cleanup when component unmounts
  return () => {
    supabase.removeChannel(channel);
  };

}, []);
  // 🔹 Post a new message
  const handlePost = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("You must be logged in to post.");
      return;
    }

    const newPost = {
      user_id: userData.user.id,
      user_email: userData.user.email,
      content: input,
    };

    const { data, error } = await supabase
      .from('community_posts')
      .insert(newPost)
      .select()
      .single();

    if (error) {
      console.error(error);
    } else {
      setMessages([data, ...messages]);
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
        <button className="community-post-btn" type="submit">
          Post
        </button>
      </form>

      <div className="community-messages">
        {loading && (
          <div className="community-message">
            <div className="community-message-text">Loading...</div>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="community-message">
            <div className="community-message-text">
              No posts yet. Be the first to post!
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div className="community-message" key={msg.id}>
            <div className="community-message-user">
              {msg.user_email}
            </div>
            <div className="community-message-text">
              {msg.content}
            </div>
            <div className="community-message-date">
              {new Date(msg.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Community;