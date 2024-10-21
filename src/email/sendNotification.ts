import aws from "@aws-sdk/client-ses";
import fs from "fs";
import nodemailer from "nodemailer";

import { UserModel } from "../database/models/userModel.js";
import { Tournament } from "../types.js";

import emailTemplate from "./emailTemplate.js";

const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: "eu-west-3",
});

// create Nodemailer SES transporter
const transporter = nodemailer.createTransport({
  SES: { ses, aws },
  sendingRate: 14,
});

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

  try {
    if (process.env.AWS_ACCESS_KEY_ID !== "") {
      await transporter.sendMail({
        from: t.from,
        to: user.email,
        subject: t.subject,
        text: "",
        html,
      });
    } else {
      fs.writeFileSync("email.html", html);
      console.log("Email written to email.html");
    }

    return true;
  } catch (error) {
    console.error(`Error sending email to ${user.email}: `, error);
    return false;
  }
};
