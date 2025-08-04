import nodemailer from "nodemailer";

export const emailTransporter = () => {
  // Create a transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS, // Use an App Password for Gmail
    },
  });
  return transporter;
};
