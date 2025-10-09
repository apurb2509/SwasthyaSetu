import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface Message {
  content: string;
  sender: 'user' | 'bot' | 'error';
  created_at: string;
}

// Get the base URL from environment variables for production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// --- API Functions (UPDATED FOR DEPLOYMENT) ---
const fetchChatHistory = async (): Promise<Message[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];
  // Use the full backend URL
  const response = await fetch(`${API_BASE_URL}/api/chat/history`, { 
    headers: { 'Authorization': `Bearer ${session.access_token}` } 
  });
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
};

const postQuestion = async (question: string): Promise<{ answer: string }> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
  // Use the full backend URL
  const response = await fetch(`${API_BASE_URL}/api/chat`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` }, 
    body: JSON.stringify({ question }), 
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

// --- Helper Components ---
const UserAvatar: React.FC<{ initials: string }> = ({ initials }) => ( <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{initials}</div> );
const BotAvatar = () => ( <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1 flex-shrink-0 shadow-sm"><img src="/swasthyasetu_logo.png" alt="SwasthyaDoot" className="w-full h-full object-contain" /></div> );
const MessageBubble: React.FC<{ message: Message; userName: string }> = ({ message, userName }) => {
  const isUser = message.sender === 'user';
  const time = message.created_at ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const getInitials = (name: string) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length > 1 && names[names.length - 1]) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  return (
    <div className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {isUser ? <UserAvatar initials={getInitials(userName)} /> : <BotAvatar />}
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
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session) {
      const getProfile = async () => {
        const { data } = await supabase.from('profiles').select('name').eq('id', session.user.id).single();
        if (data && data.name) setUserName(data.name);
      };
      getProfile();
    }
  }, [session]);

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
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['chatHistory'] }); },
    onError: (error: any) => { setDisplayedMessages(prev => [...prev, { sender: 'error', content: `Sorry, an error occurred: ${error.message}`, created_at: new Date().toISOString() }]); }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || mutation.isPending) return;
    const userMessage: Message = { content: input, sender: 'user', created_at: new Date().toISOString() };
    setDisplayedMessages(prevMessages => [...prevMessages, userMessage]);
    mutation.mutate(input);
    setInput('');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading chat history...</div>;
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-green-50 to-cyan-50 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full h-full max-h-[calc(100vh-8rem)] bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col border border-white">
        <header className="p-4 text-center border-b-2 border-green-200/50">
          <h1 className="text-2xl font-bold text-green-800">SwasthyaDoot</h1>
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
                    <span className="text-xs text-gray-500 bg-gray-200/80 px-3 py-1 rounded-full">
                      {formatDateSeparator(currentDate)}
                    </span>
                  </div>
                )}
                <MessageBubble message={msg} userName={userName} />
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
        <div className="p-4 bg-white/80 border-t">
          <form className="flex items-center space-x-3" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a health question..."
              className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              autoComplete="off"
              disabled={mutation.isPending}
            />
            <button
              type="submit"
              className="bg-green-600 text-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-green-700 disabled:bg-gray-400 transition-colors shadow-lg"
              aria-label="Send message"
              disabled={mutation.isPending}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;