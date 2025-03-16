var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'register.discoverarch@gmail.com',
    pass: 'xzdm hkmo jexm dkck'
  }
});

async function sendMail(to,subject,text){
  var mailOptions = {
    from: 'register.discoverarch@gmail.com',
    to: to,
    subject: subject,
    text: text,
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = {sendMail};
