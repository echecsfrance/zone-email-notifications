import sgMail from "@sendgrid/mail";
import fs from "fs";

import { EMAIL_API_KEY } from "../config";
import { UserModel } from "../database/models/userModel";
import { Tournament } from "../types";

import emailTemplate from "./emailTemplate";

type Messages = {
  from: string;
  subject: string;
};

const enMessages: Messages = {
  from: "tournaments@echecsfrance.com",
  subject: "New Chess Tournaments in your zones",
};

const frMessages: Messages = {
  from: "tournois@echecsfrance.com",
  subject: "Nouveaux tournois d'échecs dans vos zones",
};

export const sendNotification = async (
  user: UserModel,
  tournaments: Tournament[],
) => {
  const sortedTournaments = tournaments.sort(
    (a, b) => a.start_date.getTime() - b.start_date.getTime(),
  );

  const blitz = sortedTournaments.filter((t) => t.time_control === "Blitz");
  const rapids = sortedTournaments.filter((t) => t.time_control === "Rapide");
  const classics = sortedTournaments.filter(
    (t) => t.time_control === "Cadence Lente",
  );
  const others = sortedTournaments.filter((t) => t.time_control === "Other");

  const html = emailTemplate(
    user.locale === "en" ? "en" : "fr",
    blitz,
    rapids,
    classics,
    others,
  );

  const t = user.locale === "en" ? enMessages : frMessages;

  const msg = {
    to: user.email,
    from: t.from,
    subject: t.subject,
    text: "", // TODO text version of email
    html,
  };

  try {
    // Only send mail in production
    if (process.env.NODE_ENV !== "production") {
      fs.writeFileSync("email.html", html);
      console.log("Email sent successfully");
    } else {
      sgMail.setApiKey(EMAIL_API_KEY);
      await sgMail.send(msg);
    }
    return true;
  } catch (error) {
    console.error(`Error sending email to ${user.email}: `, error);
    return false;
  }
};
