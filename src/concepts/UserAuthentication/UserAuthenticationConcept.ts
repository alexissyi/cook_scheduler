import { Empty, ID } from "@utils/types.ts";
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
  isAdmin: boolean;
  isProduceFoodStud: boolean;
  isCostcoFoodStud: boolean;
  isLoggedIn: boolean;
}

/**
 * State: two foodstuds
 */
interface FoodStudDoc {
  _id: ID;
  produceFoodStud: User | null;
  costcoFoodStud: User | null;
}
/**
 * @concept UserAuthentication
 * @purpose to verify whether certain users are allowed to perform certain actions, like editing the cooking assignments
 */
export default class UserAuthenticationConcept {
  private users: Collection<UserDoc>;
  initialized: boolean;

  constructor(private readonly db: Db) {
    this.users = this.db.collection(PREFIX + "Users");
    this.initialized = false;
  }

  private async initialize(): Promise<Empty | { error: string }> {
    if (!this.initialized) {
      await this.users.insertOne({
        _id: freshID(),
        kerb: "admin",
        password: "adminPass",
        isAdmin: true,
        isProduceFoodStud: false,
        isCostcoFoodStud: false,
        isLoggedIn: false,
      });
    }
    return {};
  }

  async uploadUser(
    { kerb, password }: { kerb: string; password: string },
  ): Promise<
    { user: User; isAdmin: boolean; isFoodStud: boolean } | { error: string }
  > {
    await this.initialize();
    // check that there is no user with this kerb
    const matchingKerbUser = await this.users.findOne({ kerb: kerb });
    assert(matchingKerbUser === null, "User already exists with this kerb");

    const userID = freshID();
    const user: UserDoc = {
      _id: userID,
      kerb: kerb,
      password: password,
      isAdmin: false,
      isProduceFoodStud: false,
      isCostcoFoodStud: false,
      isLoggedIn: false,
    };
    await this.users.insertOne(user);
    return { user: userID, isAdmin: false, isFoodStud: false };
  }

  async removeUser({ user }: { user: User }): Promise<Empty> {
    await this.initialize();
    const userDoc = await this.users.findOne({ _id: user });
    assertExists(userDoc, "User does not exist");
    assert(
      !userDoc.isProduceFoodStud && !userDoc.isCostcoFoodStud,
      "Cannot remove foodstud",
    );
    await this.users.deleteOne({ _id: user });
    return {};
  }

  async updateKerb(
    { user, newKerb }: { user: User; newKerb: string },
  ): Promise<Empty | { error: string }> {
    await this.initialize();
    const userDoc = await this.users.findOne({ _id: user });
    assertExists(userDoc, "This user does not exist");
    assert(!userDoc.isAdmin, "Cannot update kerb of admin");
    const oldKerb = userDoc.kerb;
    assert(
      oldKerb !== newKerb,
      "New password cannot be the same as old password",
    );
    await this.users.updateOne({ _id: user }, {
      $set: { kerb: newKerb },
    });
    return {};
  }

  async updatePassword(
    { user, newPassword }: { user: User; newPassword: string },
  ): Promise<Empty | { error: string }> {
    await this.initialize();
    const userDoc = await this.users.findOne({ _id: user });
    assertExists(userDoc, "This user does not exist");
    assert(!userDoc.isAdmin, "Cannot update password of admin");
    const oldPassword = userDoc.password;
    assert(
      oldPassword !== newPassword,
      "New password cannot be the same as old password",
    );
    await this.users.updateOne({ _id: user }, {
      $set: { password: newPassword },
    });
    return {};
  }

  async login(
    { kerb, password }: { kerb: string; password: string },
  ): Promise<
    {
      user: User;
      isAdmin: boolean;
      isProduceFoodStud: boolean;
      isCostcoFoodStud: boolean;
    } | { error: string }
  > {
    await this.initialize();

    const userDoc = await this.users.findOne({ kerb: kerb });
    assertExists(userDoc, "User does not exist");
    assertEquals(userDoc.password, password, "Wrong password");
    await this.users.updateOne({ _id: userDoc._id }, {
      $set: { loggedIn: true },
    });
    return {
      user: userDoc._id,
      isAdmin: userDoc.isAdmin,
      isProduceFoodStud: userDoc.isProduceFoodStud,
      isCostcoFoodStud: userDoc.isCostcoFoodStud,
    };
  }

  async logout(
    { user }: { user: User },
  ): Promise<Empty | { error: string }> {
    await this.initialize();

    const userDoc = await this.users.findOne({ _id: user });
    assertExists(userDoc, "User does not exist");

    await this.users.updateOne({ _id: userDoc._id }, {
      $set: { loggedIn: false },
    });

    return {};
  }

  async setProduceFoodStud(
    { user }: { user: User },
  ): Promise<Empty | { error: string }> {
    await this.initialize();
    const userDoc = await this.users.findOne({ _id: user });
    assertExists(userDoc, "User does not exist");
    await this.users.updateOne({ isProduceFoodStud: true }, {
      $set: { isProduceFoodStud: false },
    });
    await this.users.updateOne({ _id: user }, {
      $set: { isProduceFoodStud: true },
    });
    return {};
  }

  async setCostcoFoodStud(
    { user }: { user: User },
  ): Promise<Empty | { error: string }> {
    await this.initialize();
    const userDoc = await this.users.findOne({ _id: user });
    assertExists(userDoc, "User does not exist");
    await this.users.updateOne({ isCostcoFoodStud: true }, {
      $set: { isCostcoFoodStud: false },
    });
    await this.users.updateOne({ _id: user }, {
      $set: { isCostcoFoodStud: true },
    });
    return {};
  }

  async verifyFoodStud(
    { user }: { user: User },
  ): Promise<Empty | { error: string }> {
    await this.initialize();
    const produceFoodStudDoc = await this.users.findOne({
      isProduceFoodStud: true,
    });
    const costcoFoodStudDoc = await this.users.findOne({
      isCostcoFoodStud: true,
    });
    assertExists(produceFoodStudDoc, "Foodstuds not set");
    assertExists(costcoFoodStudDoc, "Foodstuds not set");
    const produceFoodStud = produceFoodStudDoc._id;
    const costcoFoodStud = costcoFoodStudDoc._id;
    assert(
      user === produceFoodStud || user === costcoFoodStud,
      "User is not a foodstud",
    );
    return {};
  }

  async _isFoodStud(
    { user }: { user: User },
  ): Promise<Array<{ isFoodStud: boolean }> | { error: string }> {
    await this.initialize();
    const produceFoodStudDoc = await this.users.findOne({
      isProduceFoodStud: true,
    });
    const costcoFoodStudDoc = await this.users.findOne({
      isCostcoFoodStud: true,
    });

    if (produceFoodStudDoc) {
      if (produceFoodStudDoc._id === user) {
        return [{ isFoodStud: true }];
      }
    }

    if (costcoFoodStudDoc) {
      if (costcoFoodStudDoc._id === user) {
        return [{ isFoodStud: true }];
      }
    }

    return [{
      isFoodStud: false,
    }];
  }

  async _isAdmin(
    { user }: { user: User },
  ): Promise<Array<{ isAdmin: boolean }> | { error: string }> {
    await this.initialize();
    const userDoc = await this.users.findOne({ isAdmin: true });
    assertExists(userDoc, "Admin not initialized");
    return [{ isAdmin: userDoc._id === user }];
  }

  async _getCostcoFoodStudKerb(): Promise<
    Array<{ costcoFoodStudKerb: string }> | { error: string }
  > {
    await this.initialize();
    const costcoFoodStudDoc = await this.users.findOne({
      isCostcoFoodStud: true,
    });
    if (costcoFoodStudDoc === null) {
      return [{ costcoFoodStudKerb: "" }];
    } else {
      return [{ costcoFoodStudKerb: costcoFoodStudDoc.kerb }];
    }
  }

  async _getProduceFoodStudKerb(): Promise<
    Array<{ produceFoodStudKerb: string }> | { error: string }
  > {
    await this.initialize();
    const produceFoodStudDoc = await this.users.findOne({
      isProduceFoodStud: true,
    });
    if (produceFoodStudDoc === null) {
      return [{ produceFoodStudKerb: "" }];
    } else {
      return [{ produceFoodStudKerb: produceFoodStudDoc.kerb }];
    }
  }

  async _getUsers(): Promise<Array<{ user: User }> | { error: string }> {
    const users = await this.users.find({ isAdmin: false }).toArray();
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
    assertExists(userDoc, "User does not exist");
    return [{ kerb: userDoc.kerb }];
  }

  async _getUser(
    { kerb }: { kerb: string },
  ): Promise<Array<{ user: User }> | { error: string }> {
    const userDoc = await this.users.findOne({ kerb: kerb, isAdmin: false });
    assertExists(userDoc);
    return [{ user: userDoc._id }];
  }

  async _isLoggedIn(
    { user }: { user: User },
  ): Promise<Array<{ isLoggedIn: boolean }> | { error: string }> {
    await this.initialize();
    const userDoc = await this.users.findOne({ _id: user });
    assertExists(userDoc, "User does not exist");
    return [{ isLoggedIn: userDoc.isLoggedIn }];
  }
}
