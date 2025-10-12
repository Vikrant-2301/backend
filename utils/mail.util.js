const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Specify host explicitly
  port: 465, // Use secure SSL port
  secure: true, // Use SSL
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: `"DiscoverArch" <${process.env.GMAIL_USER}>`,
    to: to,
    subject: subject,
    text: text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error occurred while sending email:', error);
    // This will ensure that if email fails, the signup process stops and shows an error.
    throw new Error('Failed to send email. Please check server logs and email credentials.');
  }
};

module.exports = { sendMail };