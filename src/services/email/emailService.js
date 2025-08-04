import {
  userAccountActivatedNotificationTemplate,
  userActivationUrlEmailTemplate,
  userResetPasswordLinkEmailTemplate,
} from "./emailTemplate.js";
import { emailTransporter } from "./transport.js";

export const userActivationUrlEmail = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(userActivationUrlEmailTemplate(obj));
  return info.messageId; // This is the message ID of the sent email
};

export const userActivatedNotificationEmail = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(
    userAccountActivatedNotificationTemplate(obj)
  );
  return info.messageId;
};
export const userResetPasswordEmail = async (obj) => {
  const transport = emailTransporter();
  const info = transport.sendMail(userResetPasswordLinkEmailTemplate(obj));
  return info.messageId;
};
