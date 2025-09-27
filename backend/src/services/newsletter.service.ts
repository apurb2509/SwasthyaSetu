import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const gmailUser = process.env.GMAIL_USER;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
const testRecipient = process.env.TEST_EMAIL_RECIPIENT;

if (!supabaseUrl || !supabaseAnonKey || !gmailUser || !gmailAppPassword || !testRecipient) {
  console.error("CRITICAL: Missing required environment variables for the newsletter service.");
}

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// 1. Configure the Nodemailer transporter using your Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailUser,
    pass: gmailAppPassword,
  },
});

export async function sendWeeklyNewsletter() {
  console.log('Newsletter service running: Starting to send weekly newsletter...');

  try {
    // 2. Fetch 5 random health tips from the database
    const { data: tips, error: tipsError } = await supabase
      .from('tips')
      .select('content'); // In a real app, you might use a SQL function for a truly random sample.

    if (tipsError) throw new Error(`Failed to fetch tips: ${tipsError.message}`);
    if (!tips || tips.length === 0) {
      console.log('No health tips found in the database. Skipping newsletter.');
      return;
    }
    // For this example, we'll just shuffle and take the first 5.
    const weeklyTips = tips.sort(() => 0.5 - Math.random()).slice(0, 5);
    
    // 3. Format the tips into a simple HTML email
    const htmlBody = `
      <h1>SwasthyaSetu Weekly Health Digest</h1>
      <p>Here are your health tips for the week:</p>
      <ul>
        ${weeklyTips.map(tip => `<li>${tip.content}</li>`).join('')}
      </ul>
      <p>Stay healthy!</p>
    `;

    // 4. Define the email options
    const mailOptions = {
      from: `"SwasthyaSetu" <${gmailUser}>`,
      to: testRecipient!,
      subject: 'Your Weekly Health Newsletter!',
      html: htmlBody,
    };

    // 5. Send the email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Weekly newsletter sent successfully to ${testRecipient}`);

  } catch (error) {
    console.error('❌ Error in sendWeeklyNewsletter service:', error);
  }
}