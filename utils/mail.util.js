const nodemailer = require('nodemailer');

// Prefer generic SMTP if provided; fallback to Gmail App Password
function createTransporter() {
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
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: { user: smtpUser, pass: smtpPass },
      pool: true,
      connectionTimeout: 15000,
      socketTimeout: 15000,
    });
  }

  if (gmailUser && gmailPass) {
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
}

const transporter = createTransporter();


const sendMail = async (to, subject, text) => {
  if (!transporter) {
    throw new Error('Email service not configured. Please set SMTP or Gmail credentials.');
  }

  // Determine the 'from' address dynamically
  const fromAddress = process.env.EMAIL_FROM || (process.env.GMAIL_USER ? `"DiscoverArch" <${process.env.GMAIL_USER}>` : 'no-reply@discoverarch.org');

  const mailOptions = {
    from: fromAddress,
    to,
    subject,
    text,
  };

  try {
    // Validate transport connection before sending
    await transporter.verify();
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId); // Added success log
    return info;
  } catch (error) {
    console.error('❌ Error occurred while sending email:', error); // Improved error log
    throw new Error('Failed to send email. Check SMTP/Gmail credentials and network connectivity.');
  }
};

module.exports = { sendMail };
