import { Coord, booleanPointInPolygon } from "@turf/turf";
import { parse } from "date-fns/parse";
import { Polygon } from "geojson";
import { ObjectId } from "mongodb";

import { collections, dbConnect } from "./database/mongodb.js";
import { sendNotification } from "./email/sendNotification.js";
import { Tournament } from "./types.js";

const isTournamentInPolygons = (
  tournament: Tournament,
  polygons: Polygon[],
) => {
  const tournamentPoint: Coord = {
    type: "Point",
    coordinates: [tournament.coordinates[1], tournament.coordinates[0]],
  };

  return polygons.some((polygon) =>
    booleanPointInPolygon(tournamentPoint, polygon),
  );
};

async function main() {
  await dbConnect();

  console.log(`Fetching scheduled tournaments`);

  const scheduledTournaments: Tournament[] = (
    (await collections.tournaments?.find({ status: "scheduled" })?.toArray()) ??
    []
  ).map((tournament) => ({
    ...tournament,
    start_date: parse(tournament.start_date, "dd/MM/yyyy", new Date()),
    end_date: parse(tournament.end_date, "dd/MM/yyyy", new Date()),
  }));

  console.log(`${scheduledTournaments.length} scheduled tournaments found`);

  const cursor = collections.users!.find();

  for await (const user of cursor) {
    console.log(`Processing user ${user.email}`);

    const userZones = await collections
      .zones!.find({ userId: user._id })
      .toArray();

    const tournamentIdsToBeNotifiedOf = new Set<ObjectId>();

    userZones.forEach((zone) => {
      // Get all the polygons from the zone
      const polygons = zone.features.features
        .map((feature) => feature.geometry)
        .filter((geometry) => geometry?.type === "Polygon");

      // Get all the tournaments that are in polygons, have the correct time control and have not been notified
      const tournamentsInZone = scheduledTournaments.filter((tournament) => {
        const timeControls: Record<string, boolean> = {
          Blitz: zone.blitzNotifications,
          Rapide: zone.rapidNotifications,
          "Cadence Lente": zone.classicNotifications,
          Other: zone.otherNotifications,
        };

        return (
          timeControls[tournament.time_control] &&
          !user.notifiedTournaments?.find(
            (id) => id.toHexString() === tournament._id.toHexString(),
          ) &&
          isTournamentInPolygons(tournament, polygons)
        );
      });

      // Add the tournament IDs to the set
      tournamentsInZone.forEach((tournament) => {
        tournamentIdsToBeNotifiedOf.add(tournament._id);
      });
    });

    const tournamentsToBeNotifiedOf = scheduledTournaments.filter(
      (tournament) => tournamentIdsToBeNotifiedOf.has(tournament._id),
    );

    if (tournamentsToBeNotifiedOf.length > 0) {
      console.log(
        `Sending notification of ${tournamentsToBeNotifiedOf.length} tournament(s) to ${user.email}`,
      );

      const sendSucceeded = await sendNotification(
        user,
        tournamentsToBeNotifiedOf,
      );

      if (sendSucceeded) {
        await collections.users!.updateOne(
          { _id: user._id },
          {
            $addToSet: {
              notifiedTournaments: { $each: [...tournamentIdsToBeNotifiedOf] },
            },
          },
        );
      }
    }
  }

  process.exit(0);
}

export const run = async () => {
  await main();
};

// await main();
