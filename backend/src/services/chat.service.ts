import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Note: Use Service Key for admin actions

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Key must be defined.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface Message {
  sender: 'user' | 'bot';
  content: string;
  created_at: string;
}

// Function to get a user's chat history
export async function getChatHistory(userId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('chat_history')
    .select('sender, content, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
  return data;
}

// Function to save a new chat message
export async function saveChatMessage(userId: string, sender: 'user' | 'bot', content: string) {
  const { error } = await supabase
    .from('chat_history')
    .insert({ user_id: userId, sender, content });

  if (error) {
    console.error('Error saving chat message:', error);
    // Don't throw error, just log it, so the chat can continue
  }
}