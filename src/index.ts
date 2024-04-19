import { type Tournament } from "../types";
import { type Coord, type Polygon } from "@turf/turf";
import { getScheduledTournaments } from "./utils/tournaments";
import { Users } from "./users";
import { pointInsidePolygon } from "./utils/geoJSON";
import { sendNotifications } from "./utils/sendNotifications";

async function main() {
  const scheduledTournaments: Tournament[] = await getScheduledTournaments();
  const users: Users = await Users.create();

  for (const user of users.userData) {
    const notifiedTournaments = user.notifiedTournaments;

    user.notifications.forEach((notification) => {
      const zonePolygon: Polygon = notification.zones[0].features[0].geometry;

      const timeControls: Record<string, boolean> = {
        Blitz: notification.blitzNotifications,
        Rapide: notification.rapidNotifications,
        "Cadence Lente": notification.classicNotifications,
      };

      scheduledTournaments.forEach((tournament) => {
        const tournamentPoint: Coord = tournament.geoJSON;

        const tournamentIsInsideZone = pointInsidePolygon(
          tournamentPoint,
          zonePolygon,
        );

        if (
          tournamentIsInsideZone &&
          timeControls[tournament.time_control] &&
          !notifiedTournaments?.includes(tournament._id) // TODO fix type
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

    await sendNotifications(user);
  }

  process.exit(0);
}

await main();
