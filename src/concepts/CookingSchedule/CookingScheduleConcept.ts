import { assert } from "jsr:@std/assert/assert";
import { Collection, DataKey, Db, IdPServerResponse } from "npm:mongodb";
import { freshID } from "@utils/database.ts";
import { GeminiLLM } from "../../utils/gemini-llm.ts";
import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import {
  getDay,
  getMonth,
  getPeriod,
  getYear,
  MONTHS,
} from "@utils/date-utils.ts";
import { Empty, ID } from "@utils/types.ts";
import UserAuthenticationConcept from "../UserAuthentication/UserAuthenticationConcept.ts";
// all dates represented in YYYY-MM-DD string format

export type User = ID;
type Preference = ID;

type JSONAssignment = {
  lead: User;
  assistant: User;
  date: string;
};

interface AssignmentDoc {
  _id: ID;
  period: string;
  lead: User;
  assistant?: User;
  date: string;
}

interface AvailabilityDoc {
  _id: ID;
  user: User;
  period: string;
  date: string;
}

interface PreferenceDoc {
  _id: Preference;
  period: string;
  user: User;
  canSolo: boolean;
  canLead: boolean;
  canAssist: boolean;
  maxCookingDays: number;
}

interface PeriodDoc {
  _id: ID;
  period: string; // string in YYYY-MM format
  month: number;
  year: number;
  current: boolean;
  open: boolean;
}

interface DateDoc {
  _id: ID;
  period: string;
  date: string;
}

interface CookDoc {
  _id: ID;
  user: User;
  period: string;
}

// Collection prefix to ensure namespace separation
const PREFIX = "CookingSchedule" + ".";

/**
 * @concept CookingSchedule
 * @purpose To create cooking assignments for the month so we know who cooks when
 */
export default class CookingScheduleConcept {
  cooks: Collection<CookDoc>;
  periods: Collection<PeriodDoc>;
  cookingDates: Collection<DateDoc>;
  availabilities: Collection<AvailabilityDoc>;
  preferences: Collection<PreferenceDoc>;
  assignments: Collection<AssignmentDoc>;

  constructor(private readonly db: Db) {
    this.periods = this.db.collection(PREFIX + "Periods");
    this.cookingDates = this.db.collection(PREFIX + "CookingDates");
    this.availabilities = this.db.collection(PREFIX + "Availabilities");
    this.preferences = this.db.collection(PREFIX + "Preferences");
    this.assignments = this.db.collection(PREFIX + "Assignments");
    this.cooks = this.db.collection(PREFIX + "Cooks");
  }

  async addCook(
    { user, period }: { user: User; period: string },
  ): Promise<Empty | { error: string }> {
    const matchingCook = await this.cooks.findOne({
      user: user,
      period: period,
    });
    assert(matchingCook === null, "Cook is already added");
    const periodDoc = await this.periods.findOne({ period: period });
    assert(periodDoc !== null, "Period is not registered");
    const cookID = freshID();
    await this.cooks.insertOne({ _id: cookID, user: user, period: period });
    return {};
  }

  async removeCook(
    { user, period }: { user: User; period: string },
  ): Promise<Empty | { error: string }> {
    const periodDoc = await this.periods.findOne({ period: period });
    assert(periodDoc !== null, "Period is not registered");
    await this.assignments.deleteMany({ user: user, period: period });
    await this.cooks.deleteOne({ user: user, period: period });
    await this.preferences.deleteMany({ user: user, period: period });
    await this.availabilities.deleteMany({ user: user, period: period });
    return {};
  }

  async addPeriod(
    { period, current }: { period: string; current: boolean },
  ): Promise<Empty | { error: string }> {
    const month = getMonth(period);
    const year = getYear(period);
    assert(MONTHS.has(month));
    assert(year >= 0);
    assert(year % 1 === 0);
    if (current) {
      await this.periods.updateMany({ current: true }, {
        $set: { current: false },
      });
    }
    const periodID = freshID();
    const periodDoc = {
      _id: periodID,
      period: period,
      month: month,
      year: year,
      current: current,
      open: false,
    };
    await this.periods.insertOne(periodDoc);
    return {};
  }

  async removePeriod(
    { period }: { period: string },
  ): Promise<Empty | { error: string }> {
    const currentObject = await this._getCurrentPeriod() as Array<
      { period: string | null }
    >;
    assert(currentObject[0].period !== period, "Cannot remove current period");

    await this.periods.deleteOne({ period: period });
    await this.cooks.deleteMany({ period: period });
    await this.availabilities.deleteMany({ period: period });
    await this.preferences.deleteMany({ period: period });
    await this.assignments.deleteMany({ period: period });
    return {};
  }

  async setCurrentPeriod(
    { period }: { period: string },
  ): Promise<Empty | { error: string }> {
    const existingPeriod = await this.periods.findOne({
      period: period,
    });
    assertExists(existingPeriod, "Period is not registered");
    await this.periods.updateMany({ current: true }, {
      $set: { current: false },
    });

    await this.periods.updateOne({ period: period }, {
      $set: {
        current: true,
      },
    });
    return {};
  }

  async addCookingDate(
    { date }: { date: string },
  ): Promise<Empty | { error: string }> {
    const period = getPeriod(date);

    const dateDoc = {
      _id: freshID(),
      period: period,
      date: date,
    };
    await this.cookingDates.insertOne(dateDoc);
    return {};
  }

  async removeCookingDate(
    { date }: { date: string },
  ): Promise<Empty | { error: string }> {
    await this.cookingDates.deleteMany({ date: date });
    await this.assignments.deleteMany({ date: date });
    return {};
  }

  async togglePeriod(
    { period }: { period: string },
  ): Promise<Empty | { error: string }> {
    const matchingPeriod = await this.periods.findOne({ period: period });
    assertExists(matchingPeriod, "Period is not registered");
    const oldStatus = matchingPeriod.open;
    await this.periods.updateOne({ period: period }, {
      $set: { open: !oldStatus },
    });
    return {};
  }

  async uploadPreference(
    { user, period, canSolo, canLead, canAssist, maxCookingDays }: {
      user: User;
      period: string;
      canSolo: boolean;
      canLead: boolean;
      canAssist: boolean;
      maxCookingDays: number;
    },
  ): Promise<Empty | { error: string }> {
    try {
      const matchingUser = await this.cooks.findOne({
        user: user,
        period: period,
      });
      assertExists(
        matchingUser,
        "User is not registered as a cook for this period",
      );

      const matchingPeriod = await this.periods.findOne({
        period: period,
      });
      assertExists(matchingPeriod, "Period is not registered");
      assert(matchingPeriod.open, "Period is not open");

      const matchingPreference = await this.preferences.findOne({
        user: user,
        period: period,
      });

      if (matchingPreference) {
        await this.preferences.updateOne({ user: user, period: period }, {
          $set: {
            canSolo: canSolo,
            canLead: canLead,
            canAssist: canAssist,
            maxCookingDays: maxCookingDays,
          },
        });
      } else {
        await this.preferences.insertOne({
          _id: freshID(),
          user: user,
          period: period,
          canSolo: canSolo,
          canLead: canLead,
          canAssist: canAssist,
          maxCookingDays: maxCookingDays,
        });
      }

      const preferenceDoc = await this.preferences.findOne({
        user: user,
        period: period,
      });
      assertExists(preferenceDoc, "No preference");
      const preference = preferenceDoc._id;

      // delete incompatible assignments

      await this.deleteIncompatibleAssignments({ preference: preference });
    } catch (error) {
      console.error("❌ Error uploading preference:", (error as Error).message);
      throw error;
    }
    return {};
  }

  async addAvailability(
    { user, date }: { user: User; date: string },
  ): Promise<Empty | { error: string }> {
    try {
      const period = getPeriod(date);
      const matchingPeriod = await this.periods.findOne({ period: period });
      assertExists(matchingPeriod, "Period not registered");
      assert(matchingPeriod.open, "Period not open");
      const matchingCook = await this.cooks.findOne({
        user: user,
        period: period,
      });
      assertExists(matchingCook, "User not registered as cook for this period");
      const matchingCookingDate = await this.cookingDates.findOne({
        date: date,
      });
      assertExists(matchingCookingDate, "Date is not a cooking date");
      const matchingAvailability = await this.availabilities.findOne({
        user: user,
        date: date,
      });
      assert(matchingAvailability === null, "Availability already added");

      await this.availabilities.insertOne({
        _id: freshID(),
        user: user,
        date: date,
        period: period,
      });
      return {};
    } catch (error) {
      console.error("❌ Error adding availability:", (error as Error).message);
      throw error;
    }
  }

  async removeAvailability(
    { user, date }: { user: User; date: string },
  ): Promise<Empty | { error: string }> {
    try {
      const period = getPeriod(date);
      const matchingUser = await this.cooks.findOne({
        user: user,
        period: period,
      });
      assertExists(matchingUser, "User is not a cook for this period");
      const matchingPeriod = await this.periods.findOne({ period: period });
      assertExists(matchingPeriod, "Period not registered");
      assert(matchingPeriod.open, "Period not open");

      await this.availabilities.deleteOne({ user: user, date: date });
      await this.assignments.deleteMany({ lead: user, date: date });
      await this.assignments.deleteMany({ assistant: user, date: date });
      return {};
    } catch (error) {
      console.error(
        "❌ Error removing availability:",
        (error as Error).message,
      );
      throw error;
    }
  }

  async assignLead(
    { user, date }: { user: User; date: string },
  ): Promise<Empty | { error: string }> {
    try {
      const period = getPeriod(date);

      const matchingPeriod = await this.periods.findOne({ period: period });
      assertExists(matchingPeriod, "Period is not registered");

      const matchingDate = await this.cookingDates.findOne({
        date: date,
      });
      assertExists(matchingDate, "Date is not a cooking date");

      const matchingCook = await this.cooks.findOne({
        user: user,
        period: period,
      });
      assertExists(
        matchingCook,
        "User is not registered as a cook for this period",
      );

      const matchingAvailability = await this.availabilities.findOne({
        user: user,
        date: date,
      });
      assertExists(matchingAvailability, "User is not available on this date");

      const matchingPreference = await this.preferences.findOne({ user: user });
      assertExists(matchingPreference, "User has not uploaded preferences");

      assert(
        matchingPreference.canLead ||
          matchingPreference.canSolo,
        "User cannot be a lead or solo",
      );

      const matchingAssignment = await this.assignments.findOne({
        date: date,
      });

      if (matchingAssignment) {
        await this.assignments.updateOne({ date: date }, {
          $set: { lead: user },
        });
      } else {
        await this.assignments.insertOne({
          _id: freshID(),
          period: period,
          lead: user,
          date: date,
        });
      }
    } catch (error) {
      console.error("❌ Error assigning lead:", (error as Error).message);
      throw error;
    }
    return {};
  }

  async assignAssistant(
    { user, date }: { user: User; date: string },
  ): Promise<Empty | { error: string }> {
    try {
      const period = getPeriod(date);

      const matchingPeriod = await this.periods.findOne({ period: period });
      assertExists(matchingPeriod, "Period is not registered");

      const matchingDate = await this.cookingDates.findOne({
        date: date,
      });
      assertExists(matchingDate, "Date is not a cooking date");

      const matchingCook = await this.cooks.findOne({
        user: user,
        period: period,
      });
      assertExists(
        matchingCook,
        "User is not registered as a cook for this period",
      );

      const matchingAvailability = await this.availabilities.findOne({
        user: user,
        date: date,
      });
      assertExists(matchingAvailability, "User is not available on this date");

      const matchingPreference = await this.preferences.findOne({ user: user });
      assertExists(matchingPreference, "User has not uploaded preferences");

      assert(matchingPreference.canAssist, "This user cannot assist");

      const matchingAssignment = await this.assignments.findOne({ date: date });
      assertExists(
        matchingAssignment,
        "Lead has not been assigned yet/Assignment not made yet",
      );

      await this.assignments.updateOne({ date: date }, {
        $set: { assistant: user },
      });
    } catch (error) {
      console.error("❌ Error assigning assistant:", (error as Error).message);
      throw error;
    }
    return {};
  }

  async removeAssignment(
    { date }: { date: string },
  ): Promise<Empty | { error: string }> {
    await this.assignments.deleteOne({ date: date });
    return {};
  }

  private async deleteIncompatibleAssignments(
    { preference }: { preference: Preference },
  ): Promise<Empty | { error: string }> {
    const preferenceDoc = await this.preferences.findOne({ _id: preference });
    assertExists(preferenceDoc);
    const period = preferenceDoc.period;
    const periodDoc = await this.periods.findOne({ period: period });
    assertExists(periodDoc, "Period is not registered");
    const user = preferenceDoc.user;

    const canSolo = preferenceDoc.canSolo;
    const canLead = preferenceDoc.canLead;
    const canAssist = preferenceDoc.canAssist;
    const maxCookingDays = preferenceDoc.maxCookingDays;

    // delete soloing assignments if user can't solo
    if (!canSolo) {
      await this.assignments.deleteMany({
        period: period,
        lead: user,
        assistant: undefined,
      });
    }

    // delete leading assignments if user can't lead
    if (!canLead) {
      await this.assignments.deleteMany({
        period: period,
        lead: user,
      });
    }

    // delete assisting assignments if user can't assist
    if (!canAssist) {
      await this.assignments.deleteMany({
        period: period,
        assistant: user,
      });
    }

    const assistingAssignments = await this.assignments.find({
      period: period,
      assistant: user,
    }).toArray();
    const leadAssignments = await this.assignments.find({
      period: period,
      lead: user,
    }).toArray();

    const numAssistingAssignments = assistingAssignments.length;
    const numLeadAssignments = leadAssignments.length;
    const totalAssignments = numAssistingAssignments + numLeadAssignments;

    // delete assignments if total is more than maxCookingDays, with assisting assignments being removed first
    if (totalAssignments > maxCookingDays) {
      let toDelete = totalAssignments - maxCookingDays;
      if (toDelete > numAssistingAssignments) {
        await this.assignments.updateMany({ period: period, assistant: user }, {
          $set: {
            assistant: undefined,
          },
        });
        toDelete -= numAssistingAssignments;
        const idsToDelete: Array<ID> = [];
        for (let i = 0; i++; i < toDelete) {
          idsToDelete.push(leadAssignments[i]._id);
        }
        for (const id of idsToDelete) {
          await this.assignments.deleteOne({ _id: id });
        }
      } else {
        const idsToUpdate: Array<ID> = [];
        for (let i = 0; i++; i < toDelete) {
          idsToUpdate.push(assistingAssignments[i]._id);

          for (const id of idsToUpdate) {
            await this.assignments.updateOne({ _id: id }, {
              $set: {
                assistant: undefined,
              },
            });
          }
        }
      }
    }
    return {};
  }

  async generateAssignments(): Promise<Empty> {
    try {
      // simple greedy (nonoptimal) algorithm: for each day, assign based on following priority
      // 1. solo cooks over lead-assistant pairs
      // 2. people with more cooking days left to assign over those with less

      const currentPeriod = await this.periods.findOne({ current: true });
      assertExists(currentPeriod, "No current period");
      const period = currentPeriod.period;

      const cookingDates = await this.cookingDates.find({
        period: period,
      }).toArray();

      // set up assignmentsLeftPerUser
      const assignmentsLeftPerUser: Map<User, number> = new Map();
      const cooks = await this.cooks.find({ period: period }).toArray();
      for (const cook of cooks) {
        const user = cook.user;
        const preference = await this.preferences.findOne({
          user: user,
          period: period,
        });
        assertExists(preference, "No preference for this user");
        const maxCookingDays = preference.maxCookingDays;
        assignmentsLeftPerUser.set(user, maxCookingDays);
      }

      // go day and day and populate assignmets
      for (const cookingDate of cookingDates) {
        const date = cookingDate.date;
        const availabilities = await this.availabilities.find({ date: date })
          .toArray();
        let solo: User | null = null;
        let maxSoloAssignments = -1;

        // go user by user to check for who to assign to this day
        for (const availability of availabilities) {
          const user: User = availability.user;
          const assignmentsLeft = assignmentsLeftPerUser.get(user);
          assertExists(assignmentsLeft, "No max assignments found");

          // if they can solo, store them
          const soloPreference = await this.preferences.findOne({
            user: user,
            canSolo: true,
          });

          if (soloPreference && assignmentsLeft > maxSoloAssignments) {
            solo = user;
            maxSoloAssignments = assignmentsLeft;
          }
        }
        if (solo !== null) {
          assignmentsLeftPerUser.set(solo, maxSoloAssignments - 1);
          await this.assignLead({ user: solo, date: date });
        } else {
          let lead: User | null = null;
          let maxLeadAssignments = -1;

          for (const availability of availabilities) {
            const user: User = availability.user;
            const assignmentsLeft = assignmentsLeftPerUser.get(user);
            assertExists(assignmentsLeft);

            // if they can lead, store them
            const leadPreference = await this.preferences.findOne({
              user: user,
              canLead: true,
              period: period,
            });
            if (leadPreference && assignmentsLeft > maxLeadAssignments) {
              lead = user;
              maxLeadAssignments = assignmentsLeft;
            }
          }

          if (lead !== null) {
            let assist: User | null = null;
            let maxAssistAssignments = -1;
            assignmentsLeftPerUser.set(lead, maxLeadAssignments - 1);
            await this.assignLead({ user: lead, date: date });

            for (const availability of availabilities) {
              const user: User = availability.user;
              const assignmentsLeft = assignmentsLeftPerUser.get(user);
              assertExists(assignmentsLeft);

              // if someone can assist, store them
              const assistPreference = await this.preferences.findOne({
                user: user,
                canAssist: true,
                period: period,
              });
              if (
                assistPreference && assignmentsLeft > maxLeadAssignments &&
                lead !== user
              ) {
                assist = user;
                maxAssistAssignments = assignmentsLeft;
              }
            }
            if (assist !== null) {
              assignmentsLeftPerUser.set(assist, maxAssistAssignments - 1);
              await this.assignAssistant({ user: assist, date: date });
            }
          }
        }
      }
      console.log("Finished algorithmic generation");
      return {};
    } catch (error) {
      console.error(
        "❌ Error generating assignments algorithmically:",
        (error as Error).message,
      );
      throw error;
    }
  }

  async generateAssignmentsWithLLM(llm: GeminiLLM): Promise<Empty> {
    try {
      const promptObject = await this.createPrompt() as { prompt: string };
      const prompt = promptObject.prompt;
      const text = await llm.executeLLM(prompt);

      console.log("✅ Received response from Gemini AI!");
      console.log("\n🤖 RAW GEMINI RESPONSE");
      console.log("======================");
      console.log(text);
      console.log("======================\n");

      // Parse and apply the assignments
      try {
        await this.parseAndApplyAssignments({ responseText: text });
      } catch (error) {
        console.log("Failed to parse and apply LLM response");
      }
      return {};
    } catch (error) {
      console.error("❌ Error calling Gemini API:", (error as Error).message);
      throw error;
    }
  }

  private async createPrompt(): Promise<
    { prompt: string } | { error: string }
  > {
    const periodDoc = await this.periods.findOne({ current: true });
    assertExists(periodDoc);
    const period = periodDoc._id;

    let preferencesSection = "";
    const preferences = await this.preferences.find({ period: period })
      .toArray();

    for (const preferenceDoc of preferences) {
      preferencesSection += preferenceDoc.user +
        ": " +
        `{ canSolo: ${preferenceDoc.canSolo}, canLead: ${preferenceDoc.canLead}, canAssist: ${preferenceDoc.canAssist}, maxCookingDays: ${preferenceDoc.maxCookingDays}`;
      preferencesSection += "\n";
    }

    let availabilitiesSection = "";
    const cooks = await this.cooks.find().toArray();
    assertExists(cooks);

    for (const cookDoc of cooks) {
      const user: User = cookDoc._id;
      const dates: Array<string> = [];
      const availabilities = await this.availabilities.find({
        period: period,
        user: user,
      }).toArray();
      for (const availabilityDoc of availabilities) {
        const date = availabilityDoc.date;
        dates.push(date);
      }

      availabilitiesSection += user + ": " +
        `{ ${dates.join(",  ")}}`;
      availabilitiesSection += "\n";
    }

    let cookingDatesSection = "";
    const cookingDates = await this.cookingDates.find({ period: period })
      .toArray();
    assertExists(cookingDates);
    cookingDates.forEach((dateDoc) => {
      cookingDatesSection += dateDoc.date + ", ";
    });

    let assignmentsSection = "";
    const assignments = await this.assignments.find({ period: period })
      .toArray();
    assertExists(assignments);
    assignments.forEach((assignmentDoc) => {
      assignmentsSection += `${assignmentDoc.date}` + ": ";
      assignmentsSection +=
        `{ Lead: ${assignmentDoc.lead}, Assistant: ${assignmentDoc.assistant}}`;
      assignmentsSection += "\n";
    });

    let criticalRequirements = `
    1. No user should be assigned to a date that is not in their available dates.
    2. No user should be a lead cook without an assistant if they did not say that they can cook solo.
    3. No user should be a lead cook with an assistant if they did not say they can be the lead cook with an assistant.
    4. No user should be an assistant cook if they did not say they can be an assistant cook.
    5. Any proposed calendar should fill as many dates as possible without violating any of the previous requirements.
    6. Any proposed calendar should abide by previously made assignments.
    7. No date should have an assistant cook but no lead cook.`;

    const prompt =
      `You are a helpful LLM assistant that is helping a household manager assign users to a monthly calendar for the month of ${periodDoc.month}, ${periodDoc.year}. 
    
    Each user has a set of dates they are available. 
    
    Each user also has a set of preferences that specify:
    1) canSolo: whether they are willing to cook solo (in which case they are a lead cook without an assistant)
    2) canLead: whether they are willing to be lead cook in a pair of cooks
    3) canAssist: whether they are willing to be an assistant cook in a pair of cooks
    4) maxCookingDays: maximum number of days they are willing to cook for the month.
    
    Here are the preferences for each user:
    
    ${preferencesSection}
    
    Here are the availabilities for each user:
    
    ${availabilitiesSection}
    
    These are the cooking dates: ${cookingDatesSection}. For each date, we want a lead cook, and optionally an assistant cook.

    Finally, here are some existing assignments that need to be preserved: 
    
    ${assignmentsSection}

    Create a proposed calendar assigning users to be either lead or assistant cook for each date, with these critical requirements:

    ${criticalRequirements}

    Return your response as a JSON object with this exact structure:
    {
    "assignments": [
        {
        "date": a date in YYYY-MM-DD format
        "lead": userid,
        "assistant": userid
        }
    ]
    }

    Return ONLY the JSON object, no additional text.`;

    return { prompt: prompt };
  }

  private async parseAndApplyAssignments(
    { responseText }: { responseText: String },
  ): Promise<Empty | { error: string }> {
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const response = JSON.parse(jsonMatch[0]);

      if (!response.assignments || !Array.isArray(response.assignments)) {
        throw new Error("Invalid response format");
      }

      const assignmentsJSON: Array<JSONAssignment> = response.assignments;

      console.log("Generated following assignments");

      console.log(assignmentsJSON);

      for (const assignmentJSON of assignmentsJSON) {
        const date = assignmentJSON.date;
        const lead = assignmentJSON.lead;
        const assistant = assignmentJSON.assistant;
        try {
          await this.assignLead({ user: lead, date: date });
        } catch (error) {
          console.error(
            "❌ Error creating lead assignment, aborting:",
            (error as Error).message,
          );
        }
        if (assistant !== null) {
          try {
            await this.assignAssistant({ user: assistant, date: date });
          } catch (error) {
            console.error(
              "❌ Error creating assist assignment, aborting:",
              (error as Error).message,
            );
          }
        }
      }

      console.log("Finished applying assignments");
      return {};
    } catch (error) {
      console.error(
        "❌ Error parsing LLM response, aborting:",
        (error as Error).message,
      );
      console.log("Response was:", responseText);
      throw error;
    }
  }

  async _isRegistered(
    { period }: { period: string },
  ): Promise<Array<{ isRegistered: boolean }> | { error: string }> {
    const matchingPeriod = await this.periods.findOne({ period: period });
    return [{ isRegistered: matchingPeriod ? true : false }];
  }

  async _isOpen(
    { period }: { period: string },
  ): Promise<Array<{ isOpen: boolean }> | { error: string }> {
    const matchingPeriod = await this.periods.findOne({ period: period });
    assertExists(matchingPeriod, "Period is not registered");
    return [{ isOpen: matchingPeriod.open }];
  }

  async _getCooks(
    { period }: { period: string },
  ): Promise<Array<{ cook: User }> | { error: string }> {
    const cooks = await this.cooks.find({ period: period }).toArray();
    const output: Array<{ cook: User }> = [];
    for (const cook of cooks) {
      output.push({ cook: cook.user });
    }
    return output;
  }

  async _getCookingDates(
    { period }: { period: string },
  ): Promise<Array<{ cookingDate: string }> | { error: string }> {
    const cookingDates = await this.cookingDates.find({ period: period })
      .toArray();
    const output: Array<{ cookingDate: string }> = [];
    for (const cookingDate of cookingDates) {
      output.push({ cookingDate: cookingDate.date });
    }
    return output;
  }

  async _getCurrentPeriod(): Promise<
    Array<{ period: string | null }> | { error: string }
  > {
    const periodDoc = await this.periods.findOne({ current: true });
    return [{ period: periodDoc ? periodDoc.period : null }];
  }

  async _getAssignment(
    { date }: { date: string },
  ): Promise<
    | Array<
      { assignment: { lead: string; assistant?: string; date: string } | null }
    >
    | {
      error: string;
    }
  > {
    const assignment = await this.assignments.findOne({ date: date });
    if (assignment) {
      const output = [
        {
          assignment: {
            lead: assignment.lead,
            assistant: assignment.assistant,
            date: assignment.date,
          },
        },
      ];
      return output;
    } else {
      return [];
    }
  }

  async _getAssignments(
    { period }: { period: string },
  ): Promise<
    | Array<{ assignment: { lead: string; assistant?: string; date: string } }>
    | {
      error: string;
    }
  > {
    const assignments = await this.assignments.find({ period: period })
      .toArray();
    const output: Array<
      { assignment: { lead: string; assistant?: string; date: string } }
    > = [];
    for (const assignment of assignments) {
      output.push({
        assignment: {
          lead: assignment.lead,
          assistant: assignment.assistant,
          date: assignment.date,
        },
      });
    }
    return output;
  }

  async _getAvailability(
    { user, period }: { user: User; period: string },
  ): Promise<Array<{ date: string }> | { error: string }> {
    const matchingPeriod = await this.periods.findOne({ period: period });
    assertExists(matchingPeriod, "Period not registered");
    const matchingCook = await this.cooks.findOne({
      user: user,
      period: period,
    });
    assertExists(matchingCook, "User not a cook for this period");
    const availability = await this.availabilities.find({
      cook: user,
      period: period,
    }).toArray();
    const output: Array<{ date: string }> = [];
    availability.forEach((a) => {
      output.push({ date: a.date });
    });
    return output;
  }

  async _getPreference(
    { user, period }: { user: User; period: string },
  ): Promise<
    Array<
      {
        canLead: boolean;
        canSolo: boolean;
        canAssist: boolean;
        maxCookingDays: number;
      }
    >
  > {
    const matchingPeriod = await this.periods.findOne({ period: period });
    assertExists(matchingPeriod, "Period not registered");
    const matchingCook = await this.cooks.findOne({
      user: user,
      period: period,
    });
    assertExists(matchingCook, "User not a cook for this period");
    const preference = await this.preferences.findOne({
      cook: user,
      period: period,
    });
    assertExists(preference, "Preference not uploaded yet");
    const output = [{
      canLead: preference.canLead,
      canSolo: preference.canSolo,
      canAssist: preference.canAssist,
      maxCookingDays: preference.maxCookingDays,
    }];
    return output;
  }
}
