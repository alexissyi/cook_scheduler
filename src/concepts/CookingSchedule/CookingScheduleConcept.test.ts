/**
 * CookingSchedule Test Cases
 *
 * Demonstrates both manual scheduling and LLM-assisted scheduling
 */
import {
  assert,
  assertEquals,
  assertExists,
  assertNotEquals,
} from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { CookingSchedule, Period, User } from "./CookingScheduleConcept.ts";
import { GeminiLLM } from "../../utils/gemini-llm.ts";

import { ID } from "@utils/types.ts";
import { ClientEncryption } from "mongodb";

/**
 * Test case 1: Manual scheduling
 * Demonstrates adding cooks, preferences, and availabilities and manually assigning them to time slots
 */
Deno.test("Operational principle: users upload availability and preferences, can manually assign cooks", async () => {
  console.log("\n🧪 TEST CASE 1: Manual Scheduling");
  console.log("==================================");
  const [db, client] = await testDb();

  try {
    const scheduler = new CookingSchedule(db);
    const month: number = 10;
    const year: number = 2025;
    const period = await scheduler.addPeriod({
      month,
      year,
      current: true,
    }) as Period;

    const retrievedPeriod = await scheduler._getCurrentPeriod() as Period;
    assertEquals(retrievedPeriod, period);

    console.log("Successfully added current month and year");

    const date1: string = "2025-10-01";
    const date2: string = "2025-10-02";
    await scheduler.addCookingDate({ date: date1 });
    await scheduler.addCookingDate({ date: date2 });

    const retrievedDates = await scheduler._getCookingDates({
      period: period,
    }) as Set<string>;
    assert(retrievedDates.has(date1));
    assert(retrievedDates.has(date2));

    console.log("Successfully added two cooking dates");

    const user1 = await scheduler.addCook({ kerb: "amy1" }) as User;
    const user2 = await scheduler.addCook({ kerb: "bob2" }) as User;

    console.log("Successfully added two cooks");

    await scheduler.addAvailability({ user: user1, date: date1 });
    await scheduler.addAvailability({ user: user1, date: date2 });
    await scheduler.addAvailability({ user: user2, date: date1 });

    console.log("Successfully added availabilities");

    await scheduler.uploadPreference({
      user: user1,
      period: period,
      canSolo: true,
      canLead: true,
      canAssist: false,
      maxCookingDays: 2,
    });
    await scheduler.uploadPreference({
      user: user2,
      period: period,
      canSolo: false,
      canLead: false,
      canAssist: true,
      maxCookingDays: 1,
    });

    console.log("Successfully uploaded preferences");

    await scheduler.assignLead({ user: user1, date: date1 });
    await scheduler.assignLead({ user: user1, date: date2 });
    await scheduler.assignAssistant({ user: user2, date: date1 });

    console.log("Successfully made assignments");

    await scheduler.removeAssignment({ date: date1 });
    await scheduler.removeAssignment({ date: date2 });

    console.log("Successfully removed assignments");

    await scheduler.removeCook({ user: user1 });

    console.log("Successfully removed cook");

    await scheduler.removeCookingDate({ date: date1 });

    console.log("Successfully removed cooking date");
  } finally {
    await client.close();
  }
});
/**
 * Test case 2: Algorithmic scheduling on very easy case
 * Demonstrates adding cooks, preferences and availabilities, algorithmically assigning cooks
 */
Deno.test("Operational principle: user upload availability and preferences, algorithm assigns them", async () => {
  console.log("\n🧪 TEST CASE 2: Algorithmic Scheduling");
  console.log("========================================");
  const [db, client] = await testDb();

  try {
    const scheduler = new CookingSchedule(db);

    const month: number = 10;
    const year: number = 2025;
    const period = await scheduler.addPeriod({
      month,
      year,
      current: true,
    }) as Period;

    console.log("Successfully set month and year");

    const date1: string = "2025-10-01";
    const dates: Array<string> = [date1];
    for (const date of dates) {
      await scheduler.addCookingDate({ date: date });
    }

    console.log("Successfully added cooking dates");

    const user1 = await scheduler.addCook({ kerb: "amy1" }) as User;

    console.log("Successfully added cooks");

    await scheduler.addAvailability({ user: user1, date: date1 });

    console.log("Successfully uploaded availabilities");

    await scheduler.uploadPreference({
      user: user1,
      period: period,
      canSolo: true,
      canLead: true,
      canAssist: true,
      maxCookingDays: 1,
    });

    console.log("Successfully uploaded preferences");

    await scheduler.generateAssignments();

    console.log("Successfully made assignments algorithmically");
  } finally {
    console.log("in finally block");
    await client.close();
    console.log("client closed");
  }
});
/**
 * Test case 3: More complex algorithmic scheduling
 * Demonstrates adding cooks, preferences and availabilities and assigning cooks algorithmically
 */
Deno.test("Action: generateAssignments", async () => {
  console.log("\n🧪 TEST CASE 3: Algorithmic Scheduling");
  console.log("========================================");
  const [db, client] = await testDb();

  try {
    const scheduler = new CookingSchedule(db);
    const month: number = 10;
    const year: number = 2025;
    const period = await scheduler.addPeriod({
      month,
      year,
      current: true,
    }) as Period;

    console.log("Successfully set month and year");

    const date1: string = "2025-10-01";
    const date2: string = "2025-10-02";
    const date3: string = "2025-10-03";
    const date4: string = "2025-10-04";
    const dates: Array<string> = [date1, date2, date3, date4];
    for (const date of dates) {
      await scheduler.addCookingDate({ date: date });
    }

    console.log("Successfully added four cooking dates");

    const user1 = await scheduler.addCook({ kerb: "amy1" }) as User;
    const user2 = await scheduler.addCook({ kerb: "bob2" }) as User;
    const user3 = await scheduler.addCook({ kerb: "casey3" }) as User;

    console.log("Successfully added three cooks");

    await scheduler.addAvailability({ user: user1, date: date1 });
    await scheduler.addAvailability({ user: user1, date: date2 });
    await scheduler.addAvailability({ user: user2, date: date3 });
    await scheduler.addAvailability({ user: user3, date: date1 });
    await scheduler.addAvailability({ user: user3, date: date3 });
    await scheduler.addAvailability({ user: user3, date: date4 });

    console.log("Successfully uploaded availabilities");

    await scheduler.uploadPreference({
      user: user1,
      period: period,
      canSolo: true,
      canLead: true,
      canAssist: false,
      maxCookingDays: 2,
    });
    await scheduler.uploadPreference({
      user: user2,
      period: period,
      canSolo: false,
      canLead: true,
      canAssist: true,
      maxCookingDays: 1,
    });
    await scheduler.uploadPreference({
      user: user3,
      period: period,
      canSolo: true,
      canLead: true,
      canAssist: true,
      maxCookingDays: 1,
    });
    console.log("Successfully uploaded preferences");

    await scheduler.generateAssignments;

    console.log("Successfully made assignments");
  } finally {
    await client.close();
  }
});
/**
 * Test case 4: Simple LLM-assisted scheduling
 * Demonstrates adding cooks, preferences and availabilities, can call the LLM to assign them automatically for a very simple case
 */
Deno.test("Operational principle: user upload availability and preferences, LLM assigns them automatically", async () => {
  console.log("\n🧪 TEST CASE 4: LLM-Assisted Scheduling");
  console.log("========================================");
  const [db, client] = await testDb();
  const scheduler = new CookingSchedule(db);
  const llm = new GeminiLLM();

  try {
    const month: number = 10;
    const year: number = 2025;
    const period = await scheduler.addPeriod({
      month,
      year,
      current: true,
    }) as Period;

    console.log("Successfully set month and year");

    const date1: string = "2025-10-01";
    const dates: Array<string> = [date1];
    for (const date of dates) {
      await scheduler.addCookingDate({ date: date });
    }

    console.log("Successfully added cooking dates");

    const user1 = await scheduler.addCook({ kerb: "amy1" }) as User;

    console.log("Successfully added cooks");

    await scheduler.addAvailability({ user: user1, date: date1 });

    console.log("Successfully uploaded availabilities");

    await scheduler.uploadPreference({
      user: user1,
      period: period,
      canSolo: true,
      canLead: true,
      canAssist: true,
      maxCookingDays: 1,
    });

    console.log("Successfully uploaded preferences");

    await scheduler.generateAssignmentsWithLLM(llm);

    console.log("Successfully made assignments with LLM");
  } finally {
    await client.close();
  }
});

/**
 * Test case 5: More complex LLM-assisted scheduling
 * Demonstrates adding cooks, preferences and availabilities and letting the LLM assign them automatically
 */
Deno.test("Action: generateAssignmentsWithLLM", async () => {
  console.log("\n🧪 TEST CASE 5: LLM-Assisted Scheduling");
  console.log("========================================");
  const [db, client] = await testDb();
  const scheduler = new CookingSchedule(db);
  const llm = new GeminiLLM();

  try {
    const month: number = 10;
    const year: number = 2025;
    const period = await scheduler.addPeriod({
      month,
      year,
      current: true,
    }) as Period;

    console.log("Successfully set month and year");

    const date1: string = "2025-10-01";
    const date2: string = "2025-10-02";
    const date3: string = "2025-10-03";
    const date4: string = "2025-10-04";
    const dates: Array<string> = [date1, date2, date3, date4];
    for (const date of dates) {
      await scheduler.addCookingDate({ date: date });
    }

    console.log("Successfully added four cooking dates");

    const user1 = await scheduler.addCook({ kerb: "amy1" }) as User;
    const user2 = await scheduler.addCook({ kerb: "bob2" }) as User;
    const user3 = await scheduler.addCook({ kerb: "casey3" }) as User;

    console.log("Successfully added three cooks");

    await scheduler.addAvailability({ user: user1, date: date1 });
    await scheduler.addAvailability({ user: user1, date: date2 });
    await scheduler.addAvailability({ user: user2, date: date3 });
    await scheduler.addAvailability({ user: user3, date: date1 });
    await scheduler.addAvailability({ user: user3, date: date3 });
    await scheduler.addAvailability({ user: user3, date: date4 });

    console.log("Successfully uploaded availabilities");

    await scheduler.uploadPreference({
      user: user1,
      period: period,
      canSolo: true,
      canLead: true,
      canAssist: false,
      maxCookingDays: 2,
    });
    await scheduler.uploadPreference({
      user: user2,
      period: period,
      canSolo: false,
      canLead: true,
      canAssist: true,
      maxCookingDays: 1,
    });
    await scheduler.uploadPreference({
      user: user3,
      period: period,
      canSolo: true,
      canLead: true,
      canAssist: true,
      maxCookingDays: 1,
    });
    console.log("Successfully uploaded preferences");

    await scheduler.generateAssignmentsWithLLM(llm);

    console.log("Successfully made assignments");
  } finally {
    await client.close();
  }
});

/**
 * Test case 6: Scheduling where it's not possible to fully fill the calendar
 * Demonstrates how the LLM performs when there are optimal solutions but no perfect solutions
 */
Deno.test("Impossible case", async () => {
  console.log("\n🧪 TEST CASE 5: LLM-Assisted Scheduling");
  console.log("========================================");
  const [db, client] = await testDb();

  try {
    const scheduler = new CookingSchedule(db);
    const llm = new GeminiLLM();
    const month: number = 10;
    const year: number = 2025;
    const period = await scheduler.addPeriod({
      month,
      year,
      current: true,
    }) as Period;

    console.log("Successfully set month and year");

    const date1: string = "2025-10-01";
    const date2: string = "2025-10-02";
    const date3: string = "2025-10-03";
    const date4: string = "2025-10-04";
    const dates: Array<string> = [date1, date2, date3, date4];
    for (const date of dates) {
      await scheduler.addCookingDate({ date: date });
    }

    console.log("Successfully added four cooking dates");

    const user1 = await scheduler.addCook({ kerb: "amy1" }) as User;
    const user2 = await scheduler.addCook({ kerb: "bob2" }) as User;
    const user3 = await scheduler.addCook({ kerb: "casey3" }) as User;

    console.log("Successfully added three cooks");

    await scheduler.addAvailability({ user: user1, date: date1 });
    await scheduler.addAvailability({ user: user1, date: date2 });
    await scheduler.addAvailability({ user: user2, date: date3 });
    await scheduler.addAvailability({ user: user3, date: date1 });
    await scheduler.addAvailability({ user: user3, date: date3 });
    await scheduler.addAvailability({ user: user3, date: date4 });

    console.log("Successfully uploaded availabilities");

    await scheduler.uploadPreference({
      user: user1,
      period: period,
      canSolo: true,
      canLead: true,
      canAssist: false,
      maxCookingDays: 2,
    });
    await scheduler.uploadPreference({
      user: user2,
      period: period,
      canSolo: false,
      canLead: true,
      canAssist: true,
      maxCookingDays: 1,
    });
    await scheduler.uploadPreference({
      user: user3,
      period: period,
      canSolo: true,
      canLead: true,
      canAssist: true,
      maxCookingDays: 1,
    });
    console.log("Successfully uploaded preferences");

    await scheduler.generateAssignmentsWithLLM(llm);

    console.log("Successfully made assignments");
  } finally {
    await client.close();
  }
});
