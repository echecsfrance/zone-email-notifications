import mongoDB, { MongoClient } from "mongodb";

import { TournamentModel } from "./models/tournamentModel.js";
import { UserModel } from "./models/userModel.js";
import { ZoneModel } from "./models/zoneModel.js";

// process.loadEnvFile();

export const collections: {
  users?: mongoDB.Collection<UserModel>;
  zones?: mongoDB.Collection<ZoneModel>;
  tournaments?: mongoDB.Collection<TournamentModel>;
} = {};

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid environment variable: "MONGODB_URI"');
}

const options = {};

const client = new MongoClient(process.env.MONGODB_URI, options);
const clientPromise = client.connect();

export async function dbConnect() {
  const p = await clientPromise;

  const userData: mongoDB.Db = p.db("userData");
  collections.users = userData.collection("users");
  collections.zones = userData.collection("zones");

  const tournamentData: mongoDB.Db = p.db("tournamentsFranceDB");
  collections.tournaments = tournamentData.collection("tournaments");
}
