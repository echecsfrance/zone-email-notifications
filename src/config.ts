import dotenv from "dotenv";
dotenv.config();

export const mongodbURI = process.env.MONGODB_URI;
export const EMAIL_API_KEY = process.env.EMAIL_API_KEY;
