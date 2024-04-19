export type Tournament = any; // TODO fix type

// export interface Tournament {
//   _id: string;
//   address: string;
//   town: string;
//   department: string;
//   tournament: string;
//   url: string;
//   time_control: string;
//   norm_tournament: boolean;
//   start_date: string;
//   end_date: string;
//   coordinates: number[];
//   country: string;
//   date: string;
//   entry_method: string;
//   pending: boolean;
//   status: string;
//   geoJSON?: {
//     type: string;
//     coordinates: number[];
//   };
// }

export interface IEmailMessage {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}

export interface ITournamentNotification {
  id: string;
  tournament_id: string;
  start_date: string;
  end_date: string;
  time_control: string;
  tournament: string;
  url: string;
  coordinates: number[];
  address: string;
}

export interface INotification {
  name: string;
  classicNotifications: boolean;
  rapidNotifications: boolean;
  blitzNotifications: boolean;
  tournaments: ITournamentNotification[];
  zones: any[]; // TODO fix
}

export interface IUserData {
  userId: string;
  email: string;
  notifiedTournaments?: string[];
  notifications: INotification[];
}
