import { type IUserData, type Tournament } from "../../types";
import clientPromise from "../lib/mongodb";
import { ObjectId } from "mongodb";

export const getScheduledTournaments = async () => {
  const client = await clientPromise;
  const tournaments = await client
    .db("tournamentsFranceDB")
    .collection("tournaments")
    .find({ status: "scheduled" })
    .toArray();

  return tournaments.map((tournament: Tournament) => ({
    ...tournament,
    _id: tournament._id.toString(),
    geoJSON: {
      type: "Point",
      coordinates: [tournament.coordinates[1], tournament.coordinates[0]],
    },
  }));
};

export const addNotifiedTournaments = async (user: IUserData) => {
  const notifiedTournaments: string[] = [];

  for (const notification of user.notifications) {
    notification.tournaments.forEach((tournament) => {
      notifiedTournaments.push(tournament.id);
    });
  }

  const client = await clientPromise;
  return await client
    .db("userData")
    .collection("users")
    .updateOne(
      { _id: new ObjectId(user.userId) },
      {
        $addToSet: {
          notifiedTournaments: { $each: notifiedTournaments },
        },
      },
    );
};
