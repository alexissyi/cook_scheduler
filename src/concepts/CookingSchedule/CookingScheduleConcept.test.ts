/**
 * CookingSchedule Test Cases
 *
 * Demonstrates both manual scheduling and LLM-assisted scheduling
 */
import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import {
  Assignment,
  Availability,
  CookingSchedule,
  Preference,
  User,
} from "./CookingScheduleConcept.ts";
import { GeminiLLM } from "../../utils/gemini-llm.ts";

/**
 * Test case 1: Manual scheduling
 * Demonstrates adding cooks, preferences, and availabilities and manually assigning them to time slots
 */
Deno.test("Action: users upload availability and preferences, manually assign cooks", async () => {
  console.log("\n🧪 TEST CASE 1: Manual Scheduling");
  console.log("==================================");

  const scheduler = new CookingSchedule();

  const month: number = 10;
  const year: number = 2025;
  scheduler.setMonth(month);
  scheduler.setYear(year);

  console.log("Successfully set month and year");

  const date1: string = "2025-10-01";
  const date2: string = "2025-10-02";
  scheduler.addCookingDate(date1);
  scheduler.addCookingDate(date2);

  console.log("Successfully added two cooking dates");

  const user1: User = { kerb: "amy1" };
  const user2: User = { kerb: "bob2" };
  scheduler.addCook(user1);
  scheduler.addCook(user2);

  console.log("Successfully added two cooks");
  const availability1: Availability = {
    user: user1,
    dates: new Set([date1, date2]),
  };
  const availability2: Availability = {
    user: user2,
    dates: new Set([date2]),
  };
  const preference1: Preference = {
    user: user1,
    canSolo: true,
    canLead: true,
    canAssist: false,
    maxCookingDays: 2,
  };
  const preference2: Preference = {
    user: user2,
    canSolo: false,
    canLead: true,
    canAssist: true,
    maxCookingDays: 1,
  };
  scheduler.uploadAvailability(availability1);
  scheduler.uploadPreference(preference1);
  scheduler.uploadAvailability(availability2);
  scheduler.uploadPreference(preference2);

  console.log("Successfully uploaded availabilities and preferences");

  scheduler.assignLead(user1, date1);
  scheduler.assignLead(user1, date2);
  scheduler.assignAssistant(user2, date2);

  console.log("Successfully made assignments");
  scheduler.validate(scheduler.getAssignments());

  console.log("Successfully validated assignments");

  scheduler.removeAssignment(date1);
  scheduler.removeAssignment(date2);

  console.log("Successfully removed assignments");

  scheduler.removeCook(user1);

  console.log("Successfully removed cook");

  scheduler.removeCookingDate(date1);

  console.log("Successfully removed cooking date");
});
/**
 * Test case 2: Simple LLM-assisted scheduling
 * Demonstrates adding cooks, preferences and availabilities and letting the LLM assign them automatically for a very simple case
 */
Deno.test("Principle: user upload availability and preferences, LLM assigns them automatically", async () => {
  console.log("\n🧪 TEST CASE 2: LLM-Assisted Scheduling");
  console.log("========================================");

  const scheduler = new CookingSchedule();
  const llm = new GeminiLLM();

  const month: number = 10;
  const year: number = 2025;
  scheduler.setMonth(month);
  scheduler.setYear(year);

  console.log("Successfully set month and year");

  const date1: string = "2025-10-01";

  const dates: Array<string> = [date1];

  dates.forEach((date) => {
    scheduler.addCookingDate(date);
  });

  console.log("Successfully added cooking dates");

  const user1: User = { kerb: "amy1" };

  const users: Array<User> = [user1];

  users.forEach((user) => {
    scheduler.addCook(user);
  });

  console.log("Successfully added cooks");
  const availability1: Availability = {
    user: user1,
    dates: new Set([date1]),
  };

  const availabilities: Array<Availability> = [availability1];

  availabilities.forEach((availability) => {
    scheduler.uploadAvailability(availability);
  });

  console.log("Successfully uploaded availabilities");

  const preference1: Preference = {
    user: user1,
    canSolo: true,
    canLead: true,
    canAssist: true,
    maxCookingDays: 1,
  };

  const preferences: Array<Preference> = [preference1];

  preferences.forEach((preference) => {
    scheduler.uploadPreference(preference);
  });

  console.log("Successfully uploaded preferences");

  await scheduler.generateAssignmentsWithLLM(llm);

  console.log("Successfully made assignments");

  scheduler.validate(scheduler.getAssignments());

  console.log("Successfully validated assignments");
});

/**
 * Test case 3: More complex LLM-assisted scheduling
 * Demonstrates adding cooks, preferences and availabilities and letting the LLM assign them automatically
 */
Deno.test("Principle:", async () => {
  console.log("\n🧪 TEST CASE 3: LLM-Assisted Scheduling");
  console.log("========================================");

  const scheduler = new CookingSchedule();
  const llm = new GeminiLLM();

  const month: number = 10;
  const year: number = 2025;
  scheduler.setMonth(month);
  scheduler.setYear(year);

  console.log("Successfully set month and year");

  const date1: string = "2025-10-01";
  const date2: string = "2025-10-02";
  const date3: string = "2025-10-03";
  const date4: string = "2025-10-04";

  const dates: Array<string> = [date1, date2, date3, date4];

  dates.forEach((date) => {
    scheduler.addCookingDate(date);
  });

  console.log("Successfully added four cooking dates");

  const user1: User = { kerb: "amy1" };
  const user2: User = { kerb: "bob2" };
  const user3: User = { kerb: "casey3" };

  const users: Array<User> = [user1, user2, user3];

  users.forEach((user) => {
    scheduler.addCook(user);
  });

  console.log("Successfully added three cooks");
  const availability1: Availability = {
    user: user1,
    dates: new Set([date1, date2]),
  };
  const availability2: Availability = {
    user: user2,
    dates: new Set([date3]),
  };

  const availability3: Availability = {
    user: user3,
    dates: new Set([date1, date3, date4]),
  };

  const availabilities: Array<Availability> = [
    availability1,
    availability2,
    availability3,
  ];

  availabilities.forEach((availability) => {
    scheduler.uploadAvailability(availability);
  });

  console.log("Successfully uploaded availabilities");

  const preference1: Preference = {
    user: user1,
    canSolo: true,
    canLead: true,
    canAssist: false,
    maxCookingDays: 2,
  };
  const preference2: Preference = {
    user: user2,
    canSolo: false,
    canLead: true,
    canAssist: true,
    maxCookingDays: 1,
  };
  const preference3: Preference = {
    user: user3,
    canSolo: true,
    canLead: true,
    canAssist: true,
    maxCookingDays: 1,
  };
  const preferences: Array<Preference> = [
    preference1,
    preference2,
    preference3,
  ];

  preferences.forEach((preference) => {
    scheduler.uploadPreference(preference);
  });

  console.log("Successfully uploaded preferences");

  await scheduler.generateAssignmentsWithLLM(llm);

  console.log("Successfully made assignments");

  scheduler.validate(scheduler.getAssignments());

  console.log("Successfully validated assignments");
});

/**
 * Test case 4: Scheduling where it's not possible to fully fill the calendar
 * Demonstrates how the LLM performs when there are optimal solutions but no perfect solutions
 */
Deno.test("Principle", async () => {
  console.log("\n🧪 TEST CASE 4: Impossible Scheduling");
  console.log("=================================");

  const scheduler = new CookingSchedule();
  const llm = new GeminiLLM();

  const month: number = 10;
  const year: number = 2025;
  scheduler.setMonth(month);
  scheduler.setYear(year);

  console.log("Successfully set month and year");

  const date1: string = "2025-10-01";
  const date2: string = "2025-10-02";
  const date3: string = "2025-10-03";
  const date4: string = "2025-10-04";

  const dates: Array<string> = [date1, date2, date3, date4];

  dates.forEach((date) => {
    scheduler.addCookingDate(date);
  });

  console.log("Successfully added four cooking dates");

  const user1: User = { kerb: "amy1" };
  const user2: User = { kerb: "bob2" };
  const user3: User = { kerb: "casey3" };

  const users: Array<User> = [user1, user2, user3];

  users.forEach((user) => {
    scheduler.addCook(user);
  });

  console.log("Successfully added three cooks");
  const availability1: Availability = {
    user: user1,
    dates: new Set([date1, date2]),
  };
  const availability2: Availability = {
    user: user2,
    dates: new Set([date3]),
  };

  const availability3: Availability = {
    user: user3,
    dates: new Set([date1, date3]),
  };

  const availabilities: Array<Availability> = [
    availability1,
    availability2,
    availability3,
  ];

  availabilities.forEach((availability) => {
    scheduler.uploadAvailability(availability);
  });

  console.log("Successfully uploaded availabilities");

  const preference1: Preference = {
    user: user1,
    canSolo: true,
    canLead: true,
    canAssist: false,
    maxCookingDays: 2,
  };
  const preference2: Preference = {
    user: user2,
    canSolo: false,
    canLead: true,
    canAssist: true,
    maxCookingDays: 1,
  };
  const preference3: Preference = {
    user: user3,
    canSolo: true,
    canLead: true,
    canAssist: true,
    maxCookingDays: 1,
  };
  const preferences: Array<Preference> = [
    preference1,
    preference2,
    preference3,
  ];

  preferences.forEach((preference) => {
    scheduler.uploadPreference(preference);
  });

  console.log("Successfully uploaded preferences");

  await scheduler.generateAssignmentsWithLLM(llm);

  console.log("Successfully made assignments");

  scheduler.validate(scheduler.getAssignments());

  console.log("Successfully validated assignments");
});
