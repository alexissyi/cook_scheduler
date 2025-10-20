import { Empty, ID } from "@utils/types.ts";
import { assert } from "jsr:@std/assert/assert";
import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { Collection, Db } from "npm:mongodb";
import { freshID } from "@utils/database.ts";
import { emptyDir } from "jsr:@std/fs/empty-dir";

const PREFIX = "Form" + ".";

export type User = ID;
export type Question = ID;
export type Response = ID;

interface QuestionDoc {
  _id: Question;
  questionText: string;
}

interface OpenDoc {
  _id: ID;
  open: boolean;
}

interface ResponseDoc {
  _id: Response;
  question: Question;
  user: User;
  responseContent: string | boolean | number;
}

/**
 * @concept Form
 * @purpose To take in and store user responses for a set of questions
 */
export default class FormConcept {
  questions: Collection<QuestionDoc>;
  responses: Collection<ResponseDoc>;
  open: Collection<OpenDoc>;

  constructor(private readonly db: Db) {
    this.questions = this.db.collection(PREFIX + "Questions");
    this.responses = this.db.collection(PREFIX + "Responses");
    this.open = this.db.collection(PREFIX + "Open");
  }

  async initialize(): Promise<Empty | { error: string }> {
    await this.open.insertOne({ _id: freshID(), open: false });
    return {};
  }

  async submitResponse(
    { user, question, responseContent }: {
      user: User;
      question: Question;
      responseContent: string | boolean | number;
    },
  ): Promise<{ response: Response } | { error: string }> {
    const openDoc = await this.open.findOne({});
    assertExists(openDoc);
    assert(openDoc.open);
    const questionDoc = await this.questions.findOne({ _id: question });
    assertExists(questionDoc);

    const matchingResponseDoc = await this.questions.findOne({
      user: user,
      question: question,
    });
    if (matchingResponseDoc) {
      await this.responses.updateOne({ question: question, user: user }, {
        $set: {
          responseContent: responseContent,
        },
      });
      return { response: matchingResponseDoc._id };
    } else {
      const responseID = freshID();
      await this.responses.insertOne({
        _id: responseID,
        question: question,
        user: user,
        responseContent: responseContent,
      });
      return { response: responseID };
    }
  }

  async addQuestion(
    { questionText }: { questionText: string },
  ): Promise<{ question: Question } | { error: string }> {
    const questionID = freshID();
    const questionDoc = { _id: questionID, questionText: questionText };
    await this.questions.insertOne(questionDoc);
    return { question: questionID };
  }

  async deleteResponse(
    { user, question }: { user: User; question: Question },
  ): Promise<Empty | { error: string }> {
    const openDoc = await this.open.findOne({});
    assertExists(openDoc, "form has not been initalized");
    assert(!openDoc.open, "form is still open");
    const matchingResponse = await this.responses.findOne({
      user: user,
      question: question,
    });
    assertExists(matchingResponse);
    await this.responses.deleteOne({ user: user, question: question });
    return {};
  }

  async deleteQuestion(
    { question }: { question: Question },
  ): Promise<Empty | { error: string }> {
    const matchingQuestion = await this.questions.findOne({ _id: question });
    assertExists(matchingQuestion, "question does not exist");
    const response = await this.responses.findOne({ question: question });
    assert(response === null, "question has responses, cannot be deleted");
    await this.questions.deleteOne({ _id: question });
    return {};
  }

  async lock(): Promise<Empty | { error: string }> {
    const openDoc = await this.open.findOne({});
    assertExists(openDoc, "form has not been initialized");
    assert(openDoc.open, "form is already locked");

    await this.open.updateOne({}, { $set: { open: false } });
    return {};
  }

  async unlock(): Promise<Empty | { error: string }> {
    const openDoc = await this.open.findOne({});
    assertExists(openDoc, "form has not been initialized");
    assert(!openDoc.open, "form is open already");

    await this.open.updateOne({}, { $set: { open: true } });
    return {};
  }

  async _getResponseContent(
    { user, question }: { user: User; question: Question },
  ): Promise<
    { responseContent: boolean | number | string } | { error: string }
  > {
    const responseDoc = await this.responses.findOne({
      user: user,
      question: question,
    });
    assertExists(responseDoc, "response does not exist");
    return { responseContent: responseDoc.responseContent };
  }

  async _isOpen(): Promise<{ open: boolean } | { error: string }> {
    const openDoc = await this.open.findOne();
    assertExists(openDoc, "form has not been initialized");
    return { open: openDoc.open };
  }

  async _getResponses(
    { question }: { question: Question },
  ): Promise<{ responses: Set<Response> } | { error: string }> {
    const questionDoc = await this.questions.findOne({ _id: question });
    assertExists(questionDoc, "question does not exist");
    const responses = await this.responses.find({ question: question })
      .toArray();
    const output: Set<Response> = new Set();
    responses.forEach((responseDoc) => {
      output.add(responseDoc._id);
    });
    return { responses: output };
  }
}
