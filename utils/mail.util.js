const nodemailer = require('nodemailer');

// Prefer generic SMTP if provided; fallback to Gmail App Password
function createTransporter() {
  try {
    // Try to read generic SMTP settings (for production/other providers)
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpSecure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || smtpPort === 465;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    // Try to read specific Gmail settings (common for development)
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      console.log('Using SMTP configuration for email transport');
      return nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: { user: smtpUser, pass: smtpPass },
        pool: true,
        connectionTimeout: 15000,
        socketTimeout: 15000,
        tls: {
          rejectUnauthorized: false // Helps with self-signed certificates in some environments
        }
      });
    }

    if (gmailUser && gmailPass) {
      console.log('Using Gmail configuration for email transport');
      return nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailPass },
        pool: true,
        connectionTimeout: 15000,
        socketTimeout: 15000,
      });
    }

    console.error('Email service not configured: set SMTP_* or GMAIL_USER/GMAIL_PASS env vars.');
    return null;
  } catch (error) {
    console.error('Error creating email transporter:', error);
    return null;
  }
}

// Create transporter once at module load
let transporter = createTransporter();

// Verify transporter is working
if (transporter) {
  transporter.verify((error) => {
    if (error) {
      console.error('Email transporter verification failed:', error);
      transporter = null;
    } else {
      console.log('Email transporter is ready to send messages');
    }
  });
}

const sendMail = async (to, subject, text) => {
  if (!transporter) {
    // Try to recreate transporter one more time
    transporter = createTransporter();
    if (!transporter) {
      throw new Error('Email service not configured or connection failed. Please check SMTP or Gmail credentials.');
    }
  }

  // Determine the 'from' address dynamically
  const fromEmail = process.env.EMAIL_FROM || 
                   (process.env.GMAIL_USER ? process.env.GMAIL_USER : 'DiscoverArch <register.discoverarch@gmail.com>');
  const fromAddress = process.env.EMAIL_FROM || (process.env.GMAIL_USER ? `"DiscoverArch" <${process.env.GMAIL_USER}>` : 'no-reply@discoverarch.org');

  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      text,
      html: text, // Allow HTML content
    });

    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email. Check SMTP/Gmail credentials and network connectivity.');
  }
};

module.exports = { sendMail };