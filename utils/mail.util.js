var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mehulbaliwal@gmail.com',
    pass: 'kxvsweoyrapdeuit'
  }
});

async function sendMail(to,subject,text){
  var mailOptions = {
    from: 'mehulbaliwal@gmail.com',
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
