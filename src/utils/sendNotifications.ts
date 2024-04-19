import fs from "fs";

import { type IEmailMessage, type IUserData } from "../../types";
import { EMAIL_API_KEY } from "../config";
import emailTemplate from "./email/emailTemplate";
import zonesPartial from "./email/zonesPartial";
import { addNotifiedTournaments } from "./tournaments";

import { sendEmail } from "../lib/sendGrid";

export const sendNotifications = async (user: IUserData) => {
  const zones = zonesPartial(user.notifications);
  const html = emailTemplate(zones);

  const msg: IEmailMessage = {
    to: user.email,
    from: "tournaments@echecsfrance.com", // TODO change this depending on locale - tournois@echecsfrance.com / tournaments@echecsfrance.com
    subject: "New Chess Tournaments", // TODO change this depending on locale
    text: "Hello from Sendgrid", // TODO text version of email
    html,
  };

  try {
    // only send email if there are new tournaments to notify user about
    if (
      user.notifications.every(
        (notification) => notification.tournaments.length === 0,
      )
    ) {
      console.log("No new tournaments to notify user about");
      return;
    }

    // only send mail in production
    if (process.env.NODE_ENV !== "production") {
      fs.writeFileSync("email.html", html);
      console.log("Email sent successfully");
    } else {
      await sendEmail(msg, EMAIL_API_KEY);
    }

    await addNotifiedTournaments(user); // on success, add tournament IDs to user in DB as already notified
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};
