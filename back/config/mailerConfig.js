var nodemailer = require('nodemailer');
require('dotenv').config();

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.MAIL,
      pass: process.env.PASS, 
  },
  tls: {
      rejectUnauthorized: false
  }
});

module.exports = { transporter };
