const nodemailer = require('nodemailer');

// Prefer generic SMTP if provided; fallback to Gmail App Password
function createTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const smtpSecure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || smtpPort === 465;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

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

  const fromAddress = process.env.EMAIL_FROM || (process.env.GMAIL_USER ? `"DiscoverArch" <${process.env.GMAIL_USER}>` : 'no-reply@discoverarch.org');

  const mailOptions = {
    from: fromAddress,
    to,
    subject,
    text,
  };

  try {
    // Validate transport before sending to avoid hanging
    await transporter.verify();
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error occurred while sending email:', error);
    throw new Error('Failed to send email. Check SMTP/Gmail credentials and network connectivity.');
  }
};

module.exports = { sendMail };