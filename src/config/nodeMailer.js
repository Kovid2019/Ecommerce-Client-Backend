import nodemailer from "nodemailer";

// const nodeMailer = () => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.HOST,
//     port: process.env.PORT_Email,
//     secure: true, // upgrade later with STARTTLS
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.PASSWORD,
//     },
//   });
//   return transporter;
// };

//  for mahesh: create reusable transporter  using SMTP transport
const nodeMailer = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
};

export default nodeMailer;
