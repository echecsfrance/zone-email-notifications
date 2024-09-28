import mongoDB, { MongoClient } from "mongodb";

import { MONGODB_URI } from "../config";

import { TournamentModel } from "./models/tournamentModel";
import { UserModel } from "./models/userModel";
import { ZoneModel } from "./models/zoneModel";

export const collections: {
  users?: mongoDB.Collection<UserModel>;
  zones?: mongoDB.Collection<ZoneModel>;
  tournaments?: mongoDB.Collection<TournamentModel>;
} = {};

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid environment variable: "MONGODB_URI"');
}

const options = {};

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const client = new MongoClient(MONGODB_URI, options);
const clientPromise = client.connect();

export async function dbConnect() {
  const p = await clientPromise;

  const userData: mongoDB.Db = p.db("userData");
  collections.users = userData.collection("users");
  collections.zones = userData.collection("zones");

  const tournamentData: mongoDB.Db = p.db("tournamentsFranceDB");
  collections.tournaments = tournamentData.collection("tournaments");
}
