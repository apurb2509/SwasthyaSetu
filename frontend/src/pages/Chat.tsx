import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';

// Define the structure of a message
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot' | 'error';
}

// The function that sends a question to our backend
const postQuestion = async (question: string): Promise<{ answer: string }> => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! I am SwasthyaSetu. Ask me about Indian health schemes or general health topics.',
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const mutation = useMutation({
    mutationFn: postQuestion,
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: data.answer, sender: 'bot' },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: 'Sorry, I encountered an error. Please try again.',
          sender: 'error',
        },
      ]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || mutation.isPending) return;

    // Add user's message to the chat
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: input, sender: 'user' },
    ]);

    // Send the message to the backend
    mutation.mutate(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-100">
      <header className="bg-white shadow-sm p-4 text-center">
        <h1 className="text-xl font-bold text-gray-800">AI Health Assistant</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`rounded-lg p-3 max-w-lg ${
                msg.sender === 'user'
                  ? 'bg-green-600 text-white'
                  : msg.sender === 'bot'
                  ? 'bg-white text-gray-800'
                  : 'bg-red-500 text-white'
              }`}
            >
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            </div>
          </div>
        ))}

        {mutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 max-w-lg">
              <p className="text-sm text-gray-500 animate-pulse">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <form className="flex items-center space-x-2" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            autoComplete="off"
            disabled={mutation.isPending}
          />
          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400"
            aria-label="Send message"
            disabled={mutation.isPending}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;