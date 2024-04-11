const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_EMAIL_PASS,
    },
    // No es lo mas correcto pero se evita error de ssl en local
    tls: {
        rejectUnauthorized: false
    }
  });
  
  let mailOptions = {
    from: 'myemail@gmail.com',
    to: "cimminomaximo@gmail.com",
    subject: `Notificaciones de fullstack`,
    html: `probando el envio de mails.`,
  };
  
const sendMail = () => {
  
  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
        console.log(err)
    else
        console.log(info);
  });
}

module.exports = { sendMail }