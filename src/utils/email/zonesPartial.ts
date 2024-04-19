import { type INotification } from "../../../types";

const zonesPartial = (notifications: INotification[]) => {
  return notifications.map((notification) => {
    const timeControlArr = [];
    if (notification.classicNotifications) timeControlArr.push("Classic");
    if (notification.rapidNotifications) timeControlArr.push("Rapid");
    if (notification.blitzNotifications) timeControlArr.push("Blitz");
    const timeControls = timeControlArr.join(" / ");

    const tournamentRows = notification.tournaments.map((tournament) => {
      return `
        <tr>
            <td><a href="${tournament.url}" target="_blank">${tournament.tournament}</a></td>
            <td>${tournament.start_date}</td>
        </tr>`;
    });

    if (tournamentRows.length === 0) {
      return `
      <tr>
          <td class="zone-name"><strong>${notification.name}</strong> - <i>${timeControls}</i></td>
      </tr>
      <tr>
          <td>No tournaments found</td>
      </tr>`;
    }

    return `
    <tr>
        <td class="zone-name"><strong>${notification.name}</strong> - <i>${timeControls}</i></td>
    </tr>
    <tr>
        <td><strong>Tournament Name</strong></td>
        <td><strong>Start Date</strong></td>
    </tr>
    <tr>
        ${tournamentRows.join("")}
    </tr>`;
  });
};

export default zonesPartial;
