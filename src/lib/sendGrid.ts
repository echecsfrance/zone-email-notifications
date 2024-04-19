import { type IEmailMessage } from "../../types";
import sgMail from "@sendgrid/mail";

export const sendEmail = async (msg: IEmailMessage, API_KEY: string) => {
  sgMail.setApiKey(API_KEY);
  await sgMail.send(msg);
};
