import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Ensure all required environment variables are present
if (!supabaseUrl || !supabaseAnonKey || !twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
  console.error("CRITICAL: Missing required environment variables for the scheduler.");
  // We don't throw an error here to prevent the server from crashing on startup,
  // but the function will fail gracefully if called.
}

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

export async function sendDailyHealthTips() {
  console.log('Scheduler running: Starting to send daily health tips...');
  
  try {
    // 1. Fetch a random health tip from the database
    const { data: tips, error: tipsError } = await supabase
      .from('tips')
      .select('content');

    if (tipsError) throw new Error(`Failed to fetch tips: ${tipsError.message}`);
    if (!tips || tips.length === 0) {
      console.log('No health tips found in the database. Skipping task.');
      return;
    }
    const randomTip = tips[Math.floor(Math.random() * tips.length)].content;
    console.log(`Selected Tip: "${randomTip}"`);

    // 2. Fetch all active subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('subscriptions')
      .select('phone_number')
      .eq('is_active', true);

    if (subscribersError) throw new Error(`Failed to fetch subscribers: ${subscribersError.message}`);
    if (!subscribers || subscribers.length === 0) {
      console.log('No active subscribers found. Skipping task.');
      return;
    }
    
    console.log(`Found ${subscribers.length} subscribers to message.`);

    // 3. Loop through subscribers and send the SMS
    const messagePromises = subscribers.map(subscriber => {
      console.log(`Sending tip to ${subscriber.phone_number}`);
      return twilioClient.messages.create({
        body: `SwasthyaSetu Health Tip: ${randomTip}`,
        from: twilioPhoneNumber!,
        to: subscriber.phone_number,
      });
    });

    await Promise.all(messagePromises);
    console.log('✅ Successfully sent health tips to all subscribers.');

  } catch (error) {
    console.error('❌ Error in sendDailyHealthTips scheduler:', error);
  }
}