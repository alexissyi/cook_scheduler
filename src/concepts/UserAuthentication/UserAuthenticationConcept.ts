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
/**
 * @concept UserAuthentication
 * @purpose to verify whether certain users are allowed to perform certain actions, like editing the cooking assignments
 */
export default class UserAuthenticationConcept {
  private admin: Collection<UserDoc>;
  private foodStuds: Collection<FoodStudDoc>;
  private users: Collection<UserDoc>;
  initialized: boolean;

  constructor(private readonly db: Db) {
    this.foodStuds = this.db.collection(PREFIX + "FoodStuds");
    this.users = this.db.collection(PREFIX + "Users");
    this.admin = this.db.collection(PREFIX + "Admin");
    this.initialized = false;
  }

  async initialize(): Promise<Empty | { error: string }> {
    if (!this.initialized) {
      const foodStuds = await this.foodStuds.findOne();
      if (!foodStuds) {
        await this.foodStuds.insertOne({
          _id: freshID(),
          produceFoodStud: null,
          costcoFoodStud: null,
        });
      }
      const admin = await this.admin.findOne();
      if (!admin) {
        await this.admin.insertOne({
          _id: freshID(),
          kerb: "admin",
          password: "adminPass",
          loggedIn: false,
        });
      }
    }
    return {};
  }

  async uploadUser(
    { kerb, password }: { kerb: string; password: string },
  ): Promise<{ user: User } | { error: string }> {
    await this.initialize();
    // check that there is no user with this kerb
    const matchingKerbUser = await this.users.findOne({ kerb: kerb });
    assert(matchingKerbUser === null, "User already exists with this kerb");

    const adminUser = await this.admin.findOne({});
    assert(adminUser);
    assert(kerb !== adminUser.kerb, "User cannot have kerb of admin");

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
    await this.initialize();
    const userDoc = await this.users.findOne({ _id: user });
    const foodStudDoc = await this.foodStuds.findOne({});
    assertExists(userDoc, "User does not exist");
    assertExists(foodStudDoc);
    assert(
      foodStudDoc.costcoFoodStud !== user &&
        foodStudDoc.produceFoodStud !== user,
      "Cannot remove a foodstud",
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
  ): Promise<{ user: User } | { error: string }> {
    await this.initialize();
    const adminUser = await this.admin.findOne();
    assert(adminUser);
    if (kerb === adminUser.kerb) {
      assertEquals(adminUser.password, password, "Wrong password");
      await this.admin.updateOne({}, { $set: { loggedIn: true } });
      return { user: adminUser._id };
    } else {
      const userDoc = await this.users.findOne({ kerb: kerb });
      assertExists(userDoc, "User does not exist");
      assertEquals(userDoc.password, password, "Wrong password");
      await this.users.updateOne({ _id: userDoc._id }, {
        $set: { loggedIn: true },
      });
      return { user: userDoc._id };
    }
  }

  async logout(
    { user }: { user: User },
  ): Promise<Empty | { error: string }> {
    await this.initialize();
    const adminUser = await this.admin.findOne();
    assert(adminUser);
    if (user === adminUser._id) {
      await this.admin.updateOne({}, { $set: { loggedIn: false } });
    } else {
      const userDoc = await this.users.findOne({ _id: user });
      assertExists(userDoc, "User does not exist");
      assert(userDoc.loggedIn);
      await this.users.updateOne({ _id: userDoc._id }, {
        $set: { loggedIn: false },
      });
    }
    return {};
  }

  async setProduceFoodStud(
    { user }: { user: User },
  ): Promise<Empty | { error: string }> {
    await this.initialize();
    const userDoc = await this.users.findOne({ _id: user });
    assertExists(userDoc, "User does not exist");
    await this.foodStuds.updateOne({}, {
      $set: { produceFoodStud: userDoc._id },
    });
    return {};
  }

  async setCostcoFoodStud(
    { user }: { user: User },
  ): Promise<Empty | { error: string }> {
    await this.initialize();
    const userDoc = await this.users.findOne({ _id: user });
    assertExists(userDoc, "User does not exist");
    await this.foodStuds.updateOne({}, {
      $set: { costcoFoodStud: userDoc._id },
    });
    return {};
  }

  async verifyFoodStud(
    { user }: { user: User },
  ): Promise<Empty | { error: string }> {
    await this.initialize();
    const foodStuds = await this.foodStuds.findOne({});
    assertExists(foodStuds, "Fooddstuds not initialized");
    const produceFoodStud = foodStuds.produceFoodStud;
    const costcoFoodStud = foodStuds.costcoFoodStud;
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
    const foodStuds = await this.foodStuds.findOne({});
    assertExists(foodStuds, "Fooddstuds not initialized");
    const produceFoodStud = foodStuds.produceFoodStud;
    const costcoFoodStud = foodStuds.costcoFoodStud;
    return [{
      isFoodStud: user === produceFoodStud || user === costcoFoodStud,
    }];
  }

  async _isAdmin(
    { user }: { user: User },
  ): Promise<Array<{ isAdmin: boolean }> | { error: string }> {
    await this.initialize();
    const admin = await this.admin.findOne({});
    assertExists(admin, "Admin not initialized");
    return [{ isAdmin: admin._id === user }];
  }

  async _getCostcoFoodStudKerb(): Promise<
    Array<{ costcoFoodStudKerb: string }> | { error: string }
  > {
    await this.initialize();
    const foodStuds = await this.foodStuds.findOne({});
    assertExists(foodStuds, "Foodstuds not set");
    const costcoFoodStud = foodStuds.costcoFoodStud;
    if (costcoFoodStud === null) {
      return [{ costcoFoodStudKerb: "" }];
    } else {
      const doc = await this.users.findOne({ _id: costcoFoodStud });
      assertExists(doc);
      return [{ costcoFoodStudKerb: doc.kerb }];
    }
  }

  async _getProduceFoodStudKerb(): Promise<
    Array<{ produceFoodStudKerb: string }> | { error: string }
  > {
    await this.initialize();
    const foodStuds = await this.foodStuds.findOne({});
    assertExists(foodStuds, "foodstuds not set");
    const produceFoodStud = foodStuds.produceFoodStud;
    if (produceFoodStud === null) {
      return [{ produceFoodStudKerb: "" }];
    } else {
      const doc = await this.users.findOne({ _id: produceFoodStud });
      assertExists(doc);
      return [{ produceFoodStudKerb: doc.kerb }];
    }
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
    assertExists(userDoc, "User does not exist");
    return [{ kerb: userDoc.kerb }];
  }

  async _getUser(
    { kerb }: { kerb: string },
  ): Promise<Array<{ user: User }> | { error: string }> {
    const userDoc = await this.users.findOne({ kerb: kerb });
    assertExists(userDoc);
    return [{ user: userDoc._id }];
  }

  async _isLoggedIn(
    { user }: { user: User },
  ): Promise<Array<{ isLoggedIn: boolean }> | { error: string }> {
    await this.initialize();
    const adminDoc = await this.admin.findOne();
    assertExists(adminDoc, "Authentication not initialized");
    if (user === adminDoc._id) {
      return [{ isLoggedIn: adminDoc.loggedIn }];
    } else {
      const userDoc = await this.users.findOne({ _id: user });
      assertExists(userDoc, "User does not exist");
      return [{ isLoggedIn: userDoc.loggedIn }];
    }
  }
}
