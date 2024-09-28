import { ObjectId } from "mongodb";

export type UserModel = {
  email: string;
  emailVerified?: Date;
  locale: string;
  notifiedTournaments?: ObjectId[];
};

export type VerificationModel = {
  identifier: string;
  expires: Date;
};
