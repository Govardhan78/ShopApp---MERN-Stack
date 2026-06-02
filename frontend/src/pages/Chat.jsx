import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

let socket;

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get('/chat/admin')
      .then(res => {
        setAdmin(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('No admin available right now.');
        setLoading(false);
      });

    socket = io('http://localhost:5000');

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (!admin) return;

    const roomId = [user.id, admin._id].sort().join('_');
    socket.emit('join_room', roomId);

    api.get(`/chat/messages/${admin._id}`).then(res => setMessages(res.data));

    const handleMessage = (msg) => {
      setMessages(prev => [...prev, msg]);
    };

    socket.off('receive_message');
    socket.on('receive_message', handleMessage);

    return () => {
      socket.off('receive_message', handleMessage);
    };
  }, [admin]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !admin) return;

    socket.emit('send_message', {
      senderId: user.id,
      receiverId: admin._id,
      text
    });
    setText('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Chat with Admin</h1>
      <p className="text-sm text-gray-400 mb-5">You're chatting with {admin?.name}</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[520px]">

        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            {admin?.name[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{admin?.name}</p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-xs text-gray-400">Online</span>
            </div>
          </div>
        </div>

        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-xs text-gray-400 mt-4">No messages yet. Say hi!</p>
          )}
          {messages.map((msg, i) => {
            const isMe = (msg.sender._id || msg.sender) === user.id;
            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
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
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm hover:bg-indigo-700 transition disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
