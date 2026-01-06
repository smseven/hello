import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

interface Message {
  from: string;
  text: string;
  isMe: boolean;
}

interface ChatProps {
  socket: Socket;
  roomId: string;
}

const Chat: React.FC<ChatProps> = ({ socket, roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messageHandler = (payload: { message: string; from: string }) => {
      setMessages((prev) => [...prev, { text: payload.message, from: payload.from, isMe: payload.from === socket.id }]);
    };

    socket.on('chat message', messageHandler);

    return () => {
      socket.off('chat message', messageHandler);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // Send message to server
      socket.emit('chat message', { roomId, message: input, from: socket.id });
      // Usually we wait for server to broadcast back, but for better UX we can add it immediately if we want.
      // However, the current server implementation broadcasts to room including sender.
      // So we will just wait for the event to avoid duplicates, OR filtering out our own event in the listener.
      // My server code: io.to(payload.roomId).emit('chat message', payload); -> This sends to everyone in room including sender.

      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border rounded shadow-md w-80">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="font-bold text-lg">Chat</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.isMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {!msg.isMe && <div className="text-xs text-gray-500 mb-1">{msg.from.slice(0, 4)}</div>}
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
