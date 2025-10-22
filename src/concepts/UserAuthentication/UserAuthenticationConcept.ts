import { Empty, ID } from "@utils/types.ts";
import { equalsUser } from "@utils/utility-functions.ts";
import { assert } from "jsr:@std/assert/assert";
import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { Collection, Db } from "npm:mongodb";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "UserAuthentication" + ".";

export type User = ID;
/**
 * State: A set of Users with a kerb and a password.
 */
interface UserDoc {
  _id: User;
  kerb: string;
  password: string;
  loggedIn: boolean;
}

/**
 * State: two foodstuds
 */
interface FoodStudDoc {
  _id: ID;
  produceFoodStud: User | null;
  costcoFoodStud: User | null;
}

interface PasswordDoc {
  _id: ID;
  password: string;
}
/**
 * @concept UserAuthentication
 * @purpose to verify whether certain users are allowed to perform certain actions, like editing the cooking assignments
 */
export default class UserAuthenticationConcept {
  private foodStuds: Collection<FoodStudDoc>;
  private users: Collection<UserDoc>;
  private passwords: Collection<PasswordDoc>;

  constructor(private readonly db: Db) {
    this.foodStuds = this.db.collection(PREFIX + "FoodStuds");
    this.users = this.db.collection(PREFIX + "Users");
    this.passwords = this.db.collection(PREFIX + "Passwords");
  }

  async initialize(): Promise<Empty | { error: string }> {
    await this.foodStuds.insertOne({
      _id: freshID(),
      produceFoodStud: null,
      costcoFoodStud: null,
    });
    return {};
  }

  async uploadUser(
    { kerb, password }: { kerb: string; password: string },
  ): Promise<{ user: User } | { error: string }> {
    // check that there is no user with this kerb
    const matchingKerbUser = await this.users.findOne({ kerb: kerb });
    assert(matchingKerbUser === null);

    // check that there is no user with this password
    const matchingPassword = await this.passwords.findOne({
      password: password,
    });
    assert(matchingPassword === null);

    const passwordID = freshID();

    await this.passwords.insertOne({ _id: passwordID, password: password });

    const userID = freshID();
    const user: UserDoc = {
      _id: userID,
      kerb: kerb,
      password: password,
      loggedIn: false,
    };
    await this.users.insertOne(user);
    return { user: userID };
  }

  async removeUser({ user }: { user: User }): Promise<Empty> {
    const userDoc = await this.users.findOne({ _id: user });
    const foodStudDoc = await this.foodStuds.findOne({});
    assertExists(userDoc);
    assertExists(foodStudDoc);
    const password = userDoc.password;
    assert(
      foodStudDoc.costcoFoodStud !== user &&
        foodStudDoc.produceFoodStud !== user,
    );
    await this.users.deleteOne({ _id: user });
    await this.passwords.deleteOne({ password: password });
    return {};
  }

  async updatePassword(
    { user, newPassword }: { user: User; newPassword: string },
  ): Promise<Empty | { error: string }> {
    const userDoc = await this.users.findOne({ _id: user });
    assertExists(userDoc);
    const oldPassword = userDoc.password;
    assert(oldPassword !== newPassword);
    const matchingPassword = await this.passwords.findOne({
      password: newPassword,
    });
    assert(matchingPassword === null);
    await this.users.updateOne({ _id: user }, {
      $set: { password: newPassword, loggedIn: false },
    });
    return {};
  }

  async login(
    { kerb, password }: { kerb: string; password: string },
  ): Promise<{ user: User } | { error: string }> {
    const userDoc = await this.users.findOne({ kerb: kerb });
    assertExists(userDoc);
    assertEquals(userDoc.password, password);
    assert(!userDoc.loggedIn);
    await this.users.updateOne({ _id: userDoc._id }, {
      $set: { loggedIn: true },
    });
    return { user: userDoc._id };
  }

  async logout(
    { user }: { user: User },
  ): Promise<Empty | { error: string }> {
    const userDoc = await this.users.findOne({ _id: user });
    assertExists(userDoc);
    assert(userDoc.loggedIn);
    await this.users.updateOne({ _id: userDoc._id }, {
      $set: { loggedIn: false },
    });
    return {};
  }

  async setProduceFoodStud(
    { user }: { user: User },
  ): Promise<Empty | { error: string }> {
    const userDoc = await this.users.findOne({ _id: user });
    assertExists(userDoc);
    await this.foodStuds.updateOne({}, {
      $set: { produceFoodStud: userDoc._id },
    });
    return {};
  }

  async setCostcoFoodStud(
    { user }: { user: User },
  ): Promise<Empty | { error: string }> {
    const userDoc = await this.users.findOne({ _id: user });
    assertExists(userDoc);
    await this.foodStuds.updateOne({}, {
      $set: { costcoFoodStud: userDoc._id },
    });
    return {};
  }

  async verifyFoodStud(
    { user }: { user: User },
  ): Promise<Empty | { error: string }> {
    const foodStuds = await this.foodStuds.findOne({});
    assertExists(foodStuds);
    const produceFoodStud = foodStuds.produceFoodStud;
    const costcoFoodStud = foodStuds.costcoFoodStud;
    assert(
      user === produceFoodStud || user === costcoFoodStud,
    );
    return {};
  }

  async _getCostcoFoodStudKerb(): Promise<
    Array<{ costcoFoodStudKerb: string }> | { error: string }
  > {
    const foodStuds = await this.foodStuds.findOne({});
    assertExists(foodStuds, "foodstuds not set");
    const costcoFoodStud = foodStuds.costcoFoodStud;
    assertExists(costcoFoodStud);
    const doc = await this.users.findOne({ _id: costcoFoodStud });
    assertExists(doc);
    return [{ costcoFoodStudKerb: doc.kerb }];
  }

  async _getProduceFoodStudKerb(): Promise<
    Array<{ produceFoodStudKerb: string }> | { error: string }
  > {
    const foodStuds = await this.foodStuds.findOne({});
    assertExists(foodStuds, "foodstuds not set");
    const produceFoodStud = foodStuds.produceFoodStud;
    assertExists(produceFoodStud);
    const doc = await this.users.findOne({ _id: produceFoodStud });
    assertExists(doc);
    return [{ produceFoodStudKerb: doc.kerb }];
  }

  async _getUsers(): Promise<Array<{ user: User }> | { error: string }> {
    const users = await this.users.find().toArray();
    const output: Array<{ user: User }> = [];

    users.forEach((userDoc) => {
      output.push({ user: userDoc._id });
    });

    return output;
  }

  async _getKerb(
    { user }: { user: User },
  ): Promise<Array<{ kerb: string }> | { error: string }> {
    const userDoc = await this.users.findOne({ _id: user });
    assertExists(userDoc);
    return [{ kerb: userDoc.kerb }];
  }

  async _getUser(
    { kerb }: { kerb: string },
  ): Promise<Array<{ user: User }> | { error: string }> {
    const userDoc = await this.users.findOne({ kerb: kerb });
    assertExists(userDoc);
    return [{ user: userDoc._id }];
  }
}
