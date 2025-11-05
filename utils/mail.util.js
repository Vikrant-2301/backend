// utils/mail.util.js
const axios = require('axios');

// Get the API key from environment variables
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// Determine the 'from' name and email
// Use your SMTP_USER for the email if it's set, otherwise default.
const senderName = process.env.EMAIL_FROM_NAME || 'DiscoverArch';
const senderEmail = process.env.SMTP_USER || 'register.discoverarch@gmail.com';

const sendMail = async (to, subject, htmlContent) => {
  if (!BREVO_API_KEY) {
    console.error('Email service not configured: BREVO_API_KEY is missing.');
    throw new Error('Email service is not configured.');
  }

  // Brevo's API payload structure
  const payload = {
    sender: {
      name: senderName,
      email: senderEmail,
    },
    to: [
      {
        email: to,
        // You can also add a name here if you have it
        // name: toName 
      },
    ],
    subject: subject,
    htmlContent: htmlContent, // Brevo uses htmlContent
    // textContent is a fallback for email clients that don't support HTML
    textContent: htmlContent.replace(/<[^>]*>?/gm, ''), // Basic HTML to text conversion
  };

  try {
    console.log(`Sending email via Brevo API to: ${to}`);
    
    // Make the API request
    const response = await axios.post(BREVO_API_URL, payload, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY, // Use the API key here
      },
      timeout: 10000, // 10-second timeout
    });

    console.log('Email sent successfully. Message ID:', response.data.messageId);
    return response.data;

  } catch (error) {
    // Handle errors from the Brevo API
    console.error('Failed to send email via Brevo API:', error.response?.data || error.message);
    const apiError = error.response?.data?.message || error.message;
    throw new Error(`Failed to send email: ${apiError}`);
  }
};

module.exports = { sendMail };