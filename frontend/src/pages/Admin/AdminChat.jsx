import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

let socket;

export default function AdminChat() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const userName = searchParams.get('name');

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    socket = io('http://localhost:5000');

    if (userId) {
      const roomId = [user.id, userId].sort().join('_');
      socket.emit('join_room', roomId);

      api.get(`/chat/messages/${userId}`).then(res => setMessages(res.data));

      const handleMessage = (msg) => {
        setMessages(prev => [...prev, msg]);
      };

      socket.off('receive_message');
      socket.on('receive_message', handleMessage);
    }

    return () => socket.disconnect();
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !userId) return;

    socket.emit('send_message', {
      senderId: user.id,
      receiverId: userId,
      text
    });
    setText('');
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Select a shop owner from the list to start chatting
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Chat with {userName}</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
            {userName?.[0]}
          </div>
          <span className="text-sm font-medium text-gray-700">{userName}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => {
            const isMe = msg.sender._id === user.id || msg.sender === user.id;
            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                  isMe ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} className="p-3 border-t border-gray-100 flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
