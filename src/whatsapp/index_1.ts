// import * as core from '@actions/core';
// import axios from 'axios';

// async function run(): Promise<void> {
//   try {
//     const message = core.getInput('message', { required: true });
    
//     // Slack Notification
//     const slackWebhook = core.getInput('slack_webhook');
//     if (slackWebhook) {
//       await sendSlackNotification(slackWebhook, message, core.getInput('slack_channel'));
//     }
    
//     // Email Notification (using Mailgun as example)
//     const emailTo = core.getInput('email_to');
//     if (emailTo) {
//       await sendEmailNotification(
//         emailTo,
//         core.getInput('email_subject') || 'GitHub Notification',
//         message
//       );
//     }
    
//     // Telegram Notification
//     const telegramToken = core.getInput('telegram_bot_token');
//     const telegramChatId = core.getInput('telegram_chat_id');
//     if (telegramToken && telegramChatId) {
//       await sendTelegramNotification(telegramToken, telegramChatId, message);
//     }
    
//     // WhatsApp Notification (using Twilio as example)
//     const whatsappApiKey = core.getInput('whatsapp_api_key');
//     const whatsappTo = core.getInput('whatsapp_to');
//     if (whatsappApiKey && whatsappTo) {
//       await sendWhatsAppNotification(whatsappApiKey, whatsappTo, message);
//     }
    
//   } catch (error) {
//     if (error instanceof Error) core.setFailed(error.message);
//   }
// }

// async function sendSlackNotification(webhook: string, message: string, channel?: string): Promise<void> {
//   const payload: any = { text: message };
//   if (channel) payload.channel = channel;
  
//   await axios.post(webhook, payload);
//   core.info('Slack notification sent');
// }

// async function sendEmailNotification(to: string, subject: string, message: string): Promise<void> {
//   // This is a Mailgun example - you'd need to configure secrets
//   const domain = process.env.MAILGUN_DOMAIN;
//   const apiKey = process.env.MAILGUN_API_KEY;
  
//   if (!domain || !apiKey) {
//     core.warning('Mailgun credentials not configured - skipping email');
//     return;
//   }
  
//   const data = new URLSearchParams();
//   data.append('from', 'GitHub Actions <noreply@yourdomain.com>');
//   data.append('to', to);
//   data.append('subject', subject);
//   data.append('text', message);
  
//   await axios.post(`https://api.mailgun.net/v3/${domain}/messages`, data, {
//     auth: {
//       username: 'api',
//       password: apiKey
//     }
//   });
//   core.info('Email notification sent');
// }

// async function sendTelegramNotification(token: string, chatId: string, message: string): Promise<void> {
//   await axios.get(`https://api.telegram.org/bot${token}/sendMessage`, {
//     params: {
//       chat_id: chatId,
//       text: message
//     }
//   });
//   core.info('Telegram notification sent');
// }

// async function sendWhatsAppNotification(apiKey: string, to: string, message: string): Promise<void> {
//   // Using Twilio API as example
//   const accountSid = process.env.TWILIO_ACCOUNT_SID;
//   const authToken = apiKey;
//   const from = process.env.TWILIO_WHATSAPP_NUMBER; // e.g. 'whatsapp:+14155238886'
  
//   if (!accountSid || !from) {
//     core.warning('Twilio configuration incomplete - skipping WhatsApp');
//     return;
//   }
  
//   const client = require('twilio')(accountSid, authToken);
  
//   await client.messages.create({
//     body: message,
//     from: from,
//     to: `whatsapp:${to}`
//   });
//   core.info('WhatsApp notification sent');
// }

// run();