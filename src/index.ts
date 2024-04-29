import { type Tournament } from "../types.js";
// @ts-expect-error turf bindings are not updated in the library
import { type Coord, type Polygon, type Feature } from "@turf/turf";
import { getScheduledTournaments } from "./utils/tournaments.js";
import { Users } from "./users.js";
import { pointInsidePolygon } from "./utils/geoJSON.js";
import { sendNotifications } from "./utils/sendNotifications.js";

async function main() {
  const scheduledTournaments: Tournament[] = await getScheduledTournaments();
  const users: Users = await Users.create();

  for (const user of users.userData) {
    const notifiedTournaments = user.notifiedTournaments;

    user.notifications.forEach((notification) => {
      const zoneFeatures = notification.zones[0].features;

      const timeControls: Record<string, boolean> = {
        Blitz: notification.blitzNotifications,
        Rapide: notification.rapidNotifications,
        "Cadence Lente": notification.classicNotifications,
      };

      // iterate through each drawn polygon in saved zone
      zoneFeatures.forEach((zoneFeature: Feature) => {
        scheduledTournaments.forEach((tournament) => {
          const tournamentPoint: Coord = tournament.geoJSON;
          const zonePolygon: Polygon = zoneFeature.geometry;

          const tournamentIsInsideZone = pointInsidePolygon(
            tournamentPoint,
            zonePolygon,
          );

          if (
            tournamentIsInsideZone && // check that the scheduled tournament is inside the drawn polygon
            timeControls[tournament.time_control] && // check that the time control is enabled
            // TODO I am not sure the below is correct, as this may not include the tournament if another zone has announced it, rather than overlapping polygons in one zone
            !notification.tournaments.includes(tournament._id) && // check that the tournament is not already in the array
            !notifiedTournaments?.includes(tournament._id) // check that the tournament has not already been notified
            // TODO fix type
          ) {
            notification.tournaments.push({
              id: tournament._id,
              tournament_id: tournament.tournament_id,
              start_date: tournament.start_date,
              end_date: tournament.end_date,
              time_control: tournament.time_control,
              tournament: tournament.tournament,
              url: tournament.url,
              coordinates: tournament.coordinates,
              address: tournament.address,
            });
          }
        });
      });
    });

    await sendNotifications(user);
  }

  process.exit(0);
}

await main();
