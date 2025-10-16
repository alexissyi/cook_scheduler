import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";
// Collection prefix to ensure namespace separation
const PREFIX = "LikertSurvey" + ".";

type USER = ID;

export default class AvailabilityConcept {
}
