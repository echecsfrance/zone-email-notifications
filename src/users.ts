import { type IUserData } from "../types.js";
import { type ObjectId } from "mongodb";
import clientPromise from "./lib/mongodb.js";

export class Users {
  readonly #userData: IUserData[] = [];

  constructor() {
    this.#userData = [];
  }

  static async create() {
    const users = new Users();
    await users.init();
    return users;
  }

  private async init() {
    await this.extractUserZones();
  }

  get userData() {
    return this.#userData;
  }

  /**
   * Get entire zones DB collection
   */
  async allZones() {
    const client = await clientPromise;
    return await client.db("userData").collection("zones").find().toArray();
  }

  /**
   * Get additional user data - email address and notified tournament IDs
   */
  async getAdditionalUserData(id: ObjectId) {
    const client = await clientPromise;
    const user = await client
      .db("userData")
      .collection("users")
      .findOne({ _id: id });
    if (user) return [user.email, user.notifiedTournaments];
    return ["", []];
  }

  /**
   * Extract saved zones from each user
   */
  async extractUserZones() {
    const zones = await this.allZones(); // saved zones in DB

    for (const zone of zones) {
      const userExists = this.userData.some(
        (user) => user.userId === zone.userId.toString(),
      );

      if (!userExists) {
        const userId: ObjectId = zone.userId;

        const [email, notifiedTournaments] =
          await this.getAdditionalUserData(userId);

        this.#userData.push({
          userId: userId.toString(),
          notifiedTournaments,
          email,
          notifications: [
            {
              name: zone.name,
              classicNotifications: zone.classicNotifications,
              rapidNotifications: zone.rapidNotifications,
              blitzNotifications: zone.blitzNotifications,
              tournaments: [],
              zones: [zone.features],
            },
          ],
        });
      } else {
        const user = this.#userData.find(
          (user) => user.userId === zone.userId.toString(),
        );
        user?.notifications.push({
          name: zone.name,
          classicNotifications: zone.classicNotifications,
          rapidNotifications: zone.rapidNotifications,
          blitzNotifications: zone.blitzNotifications,
          tournaments: [],
          zones: [zone.features],
        });
      }
    }
  }
}
