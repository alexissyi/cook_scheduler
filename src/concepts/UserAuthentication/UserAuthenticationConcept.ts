import { ID } from "@utils/types.ts";
import { equalsUser } from "@utils/utility-functions.ts";
import { assert } from "jsr:@std/assert/assert";
import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { Collection, Db } from "npm:mongodb";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "UserAuthentication" + ".";

type User = ID;
/**
 * State: A set of Users with a kerb and a password.
 */
interface UserDoc {
  _id: User;
  kerb: string;
  password: string;
}

/**
 * State: two foodstuds
 */
interface FoodStudDoc {
  _id: ID;
  produceFoodStud: User;
  costcoFoodStud: User;
}

interface PasswordDoc {
  _id: ID;
  password: string;
}
/**
 * @concept UserAuthentication
 * @purpose to verify whether certain users are allowed to perform certain actions, like editing the cooking assignments
 */
export default class UserAuthentication {
  private foodStuds: Collection<FoodStudDoc>;
  private users: Collection<UserDoc>;
  private passwords: Collection<PasswordDoc>;

  constructor(private readonly db: Db) {
    this.foodStuds = this.db.collection(PREFIX + "FoodStuds");
    this.users = this.db.collection(PREFIX + "Users");
    this.passwords = this.db.collection(PREFIX + "Passwords");
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

    this.passwords.insertOne({ _id: passwordID, password: password });

    const userID = freshID();
    const user: UserDoc = { _id: userID, kerb: kerb, password: password };
    this.users.insertOne(user);
    return { user: userID };
  }

  async removeUser({ user }: { user: User }): Promise<void> {
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
  }

  async updatePassword(
    { user, newPassword }: { user: User; newPassword: string },
  ): Promise<void | { error: string }> {
    const userDoc = await this.users.findOne({ _id: user });
    assertExists(userDoc);
    const oldPassword = userDoc.password;
    assert(oldPassword !== newPassword);
    const matchingPassword = await this.passwords.findOne({
      password: newPassword,
    });
    assert(matchingPassword === null);
    await this.users.updateOne({ _id: user }, { password: newPassword });
  }

  async login(
    { kerb, password }: { kerb: string; password: string },
  ): Promise<{ user: User } | { error: string }> {
    const userDoc = await this.users.findOne({ kerb: kerb });
    assertExists(userDoc);
    assertEquals(userDoc.password, password);
    return { user: userDoc._id };
  }

  async setProduceFoodStud(
    { user }: { user: User },
  ): Promise<void | { error: string }> {
    const userDoc = await this.users.findOne({ _id: user });
    assertExists(userDoc);
    this.foodStuds.updateOne({}, { produceFoodStud: userDoc._id });
  }

  async setCostcoFoodStud(
    { user }: { user: User },
  ): Promise<void | { error: string }> {
    const userDoc = await this.users.findOne({ _id: user });
    assertExists(userDoc);
    this.foodStuds.updateOne({}, { costcoFoodStud: userDoc._id });
  }

  async verifyFoodStud(
    { user }: { user: User },
  ): Promise<void | { error: string }> {
    const foodStuds = await this.foodStuds.findOne({});
    assertExists(foodStuds);
    const produceFoodStud = foodStuds.produceFoodStud;
    const costcoFoodStud = foodStuds.costcoFoodStud;
    assert(
      user === produceFoodStud || user === costcoFoodStud,
    );
  }

  async verifyUser(
    { actingUser, targetUser }: {
      actingUser: User;
      targetUser: User;
    },
  ): Promise<void | { error: string }> {
    assertEquals(actingUser, targetUser);
    const matchingActingUser = await this.users.findOne({
      _id: actingUser,
    });
    assert(matchingActingUser);
  }
}
