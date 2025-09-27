import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  console.log('STEP 2: Entering Auth Middleware...');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Supabase environment variables are missing in auth middleware!');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth Middleware FAIL: No token provided.');
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      throw new Error('Invalid token.');
    }
    console.log('STEP 3: Auth Middleware SUCCESS. User is authenticated.');
    next();
  } catch (error) {
    console.log('Auth Middleware FAIL: Invalid token.');
    return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
  }
};