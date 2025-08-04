import { emailTransporter } from "../services/email/transport.js";

const transporter = emailTransporter();

// send email
const sendEmail = async (email) => {
  try {
    const result = await transporter.sendMail(email);
    return result;
  } catch (error) {
    console.error("Email sending failed:", {
      error: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack,
    });
    throw error;
  }
};

// send reset password link
export const sendResetPasswordLinkEmail = async (user, resetPasswordUrl) => {
  const { email, fName } = user;

  const emailFormat = {
    from: `"Sportify Security Team" <${process.env.SENDER_MAIL}>`,
    to: email,
    subject: "Sportify - Password Reset Request",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sportify Password Reset</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #666666; margin: 0; font-size: 24px;">Password Reset Request</h1>
              </div>
              
              <div style="color: #666666; font-size: 16px; line-height: 1.6;">
                <p>Hello ${fName},</p>
                
                <p>We received a request to reset your password for your Sportify account (${email}). To proceed with the password reset, please click the button below:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetPasswordUrl}" 
                     style="background-color: #007bff; 
                            color: #ffffff; 
                            padding: 12px 30px; 
                            text-decoration: none; 
                            border-radius: 4px; 
                            font-weight: bold;
                            display: inline-block;">
                    Reset Password
                  </a>
                </div>
                
                <p style="margin-top: 30px;">This link will expire in 1 hour for security reasons.</p>
                
                <p>If you did not request a password reset, please ignore this email or contact our support team if you have concerns.</p>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee;">
                  <p style="margin: 0;">Best regards,<br><strong>Sportify Security Team</strong></p>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999999; font-size: 12px;">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} Sportify. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const result = await sendEmail(emailFormat);
    return result;
  } catch (error) {
    console.error("Failed to send reset password email:", error);
    throw error;
  }
};
