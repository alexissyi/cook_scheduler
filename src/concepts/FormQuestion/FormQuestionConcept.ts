import { User } from "@utils/types.ts";
import { assert } from "jsr:@std/assert/assert";
import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";

export default class FormQuestion {
  questionText: string;
  responses: Map<User, string | boolean>;
  open: boolean;

  constructor(questionText: string) {
    this.questionText = questionText;
    this.responses = new Map();
    this.open = false;
  }

  submitResponse(user: User, responseContent: string | boolean) {
  }

  writeQuestion(questionText: string) {
  }

  deleteResponse(user: User) {
  }

  lock() {
    assert(this.open);
    this.open = false;
  }

  unlock() {
    assert(!this.open);
    this.open = true;
  }
}
