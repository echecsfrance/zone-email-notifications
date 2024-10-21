import { WithId } from "mongodb";

import { TournamentModel } from "./database/models/tournamentModel.js";

export type Prettify<T> = {
  [K in keyof T]: T[K];
};

export type Tournament = Prettify<
  Omit<WithId<TournamentModel>, "start_date" | "end_date"> & {
    start_date: Date;
    end_date: Date;
  }
>;
