import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

interface Message {
  from: string;
  text?: string;
  image?: string;
  type: 'text' | 'image';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const messageHandler = (payload: { message?: string; image?: string; type?: 'text' | 'image'; from: string }) => {
      setMessages((prev) => [...prev, {
          text: payload.message,
          image: payload.image,
          type: payload.type || 'text',
          from: payload.from,
          isMe: payload.from === socket.id
      }]);
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
      socket.emit('chat message', { roomId, message: input, type: 'text', from: socket.id });
      setInput('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          if (file.size > 2 * 1024 * 1024) {
              alert("File size must be less than 2MB");
              return;
          }

          const reader = new FileReader();
          reader.onload = (evt) => {
              if (evt.target?.result) {
                  socket.emit('chat message', {
                      roomId,
                      image: evt.target.result,
                      type: 'image',
                      from: socket.id
                  });
              }
          };
          reader.readAsDataURL(file);
      }
      // Reset input so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
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
              {msg.type === 'text' ? (
                  <p className="break-words">{msg.text}</p>
              ) : (
                  <img src={msg.image} alt="uploaded" className="max-w-full rounded" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t flex items-center">
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
        />
        <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-500 hover:text-gray-700 mr-2 p-2"
        >
            📎
        </button>
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
