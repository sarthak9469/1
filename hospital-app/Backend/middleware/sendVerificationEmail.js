const nodemailer = require('nodemailer');


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sarthapliyal13@gmail.com',  
      pass: 'ryfcqezudpzccwrr'    
    }
  });

  const sendVerificationEmail = (email, token) => {
  const mailOptions = {
    from: 'sarthapliyal13@gmail.com',
    to: email,
    subject: 'Account Verification',
    html: `Please click the link to set your password: 
         <a href="http://localhost:3000/api/set-password?token=${token}">Click Here</a>`

  };

  return transporter.sendMail(mailOptions);
};

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
  };

  try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
  } catch (error) {
      console.error('Error sending email:', error);
  }
};

module.exports = { sendVerificationEmail, sendEmail };
