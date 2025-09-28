import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface Message {
  content: string;
  sender: 'user' | 'bot' | 'error';
  created_at: string;
}

// --- API Functions ---
const fetchChatHistory = async (): Promise<Message[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];
  const response = await fetch('/api/chat/history', { headers: { 'Authorization': `Bearer ${session.access_token}` } });
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
};

const postQuestion = async (question: string): Promise<{ answer: string }> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
  const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` }, body: JSON.stringify({ question }), });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

// --- Helper Components ---
const UserAvatar = () => ( <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">U</div> );
const BotAvatar = () => ( <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1 flex-shrink-0 shadow-sm"><img src="/swasthyasetu_logo.png" alt="SwasthyaDoot" className="w-full h-full object-contain" /></div> );
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';
  const time = message.created_at ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  return (
    <div className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {isUser ? <UserAvatar /> : <BotAvatar />}
      <div className={`rounded-xl p-3 max-w-lg shadow-sm ${isUser ? 'bg-green-600 text-white' : 'bg-white text-gray-800 border'}`}>
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        {time && <p className={`text-xs mt-1 text-right ${isUser ? 'text-green-200' : 'text-gray-400'}`}>{time}</p>}
      </div>
    </div>
  );
};
const formatDateSeparator = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'long' });
    const year = date.getFullYear();
    const dayOfWeek = date.toLocaleString('en-GB', { weekday: 'short' }).toUpperCase();
    return `${day} ${month}, ${year} (${dayOfWeek})`;
};

// --- Main Chat Component ---
const Chat: React.FC = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [input, setInput] = useState('');
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: fetchedMessages, isLoading } = useQuery<Message[]>({
    queryKey: ['chatHistory'],
    queryFn: fetchChatHistory,
    enabled: !!session,
  });

  useEffect(() => {
    if (fetchedMessages) {
      if (fetchedMessages.length === 0) {
        setDisplayedMessages([{
          sender: 'bot',
          content: 'Hello! I am SwasthyaDoot. Ask me about Indian health schemes or general health topics.',
          created_at: new Date().toISOString()
        }]);
      } else {
        setDisplayedMessages(fetchedMessages);
      }
    }
  }, [fetchedMessages]);

  const mutation = useMutation({
    mutationFn: postQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    },
    onError: (error: any) => {
      setDisplayedMessages(prev => [
        ...prev,
        { sender: 'error', content: `Sorry, an error occurred: ${error.message}`, created_at: new Date().toISOString() }
      ]);
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || mutation.isPending) return;
    const userMessage: Message = {
      content: input,
      sender: 'user',
      created_at: new Date().toISOString()
    };
    setDisplayedMessages(prevMessages => [...prevMessages, userMessage]);
    mutation.mutate(input);
    setInput('');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading chat history...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-100">
      <header className="bg-white p-4 text-center border-b shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">SwasthyaDoot</h1>
        <p className="text-sm text-gray-500">Your AI Health Assistant</p>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {displayedMessages.map((msg, index) => {
          const currentDate = new Date(msg.created_at);
          const prevDate = index > 0 ? new Date(displayedMessages[index - 1].created_at) : null;
          const showDateSeparator = !prevDate || currentDate.toDateString() !== prevDate.toDateString();
          return (
            <React.Fragment key={index}>
              {showDateSeparator && (
                <div className="text-center my-3">
                  <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                    {formatDateSeparator(currentDate)}
                  </span>
                </div>
              )}
              <MessageBubble message={msg} />
            </React.Fragment>
          );
        })}
        {mutation.isPending && (
          <div className="flex items-start gap-3 mt-4">
            <BotAvatar />
            <div className="rounded-xl p-3 max-w-lg bg-white shadow-sm">
              <p className="text-sm text-gray-500 animate-pulse">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 bg-white border-t border-gray-200">
        <form className="flex items-center space-x-2" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a health question..."
            className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            autoComplete="off"
            disabled={mutation.isPending}
          />
          <button
            type="submit"
            className="bg-green-600 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            aria-label="Send message"
            disabled={mutation.isPending}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;