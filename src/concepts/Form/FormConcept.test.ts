import {
  assert,
  assertEquals,
  assertExists,
  assertNotEquals,
} from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { Question, Response, User } from "./FormConcept.ts";
import FormConcept from "./FormConcept.ts";

import { ID } from "@utils/types.ts";

Deno.test("Operational Principle: can upload question into the form and open the form; user can respond to the question; the response can be used to guide decisionmaking", async () => {
  console.log("\n🧪 TEST CASE 1: Operational principle");
  console.log("==================================");
  const [db, client] = await testDb();
  try {
    const form = new FormConcept(db);
    await form.initialize();

    const formStatus = await form._isOpen();

    assert(!formStatus);

    const question = await form.addQuestion({
      questionText: "What's your name?",
    }) as Question;

    const user = "user1" as User;

    await form.unlock();

    assert(await form._isOpen());

    const responseContent1 = "Bob";

    await form.submitResponse({
      question: question,
      user: user,
      responseContent: responseContent1,
    }) as Response;

    const retrievedResponse = await form._getResponseContent({
      user: user,
      question: question,
    });

    assertEquals(responseContent1, retrievedResponse);
  } finally {
    await client.close();
  }
});

Deno.test("Operational Principle: can upload multiple questions into the form and open the form; multiple users can respond to the questions; the responses can be used to guide decisionmaking", async () => {
  console.log("\n🧪 TEST CASE 2: Operational principle, more complex");
  console.log("==================================");
  const [db, client] = await testDb();
  try {
    const form = new FormConcept(db);
    await form.initialize();

    const formStatus = await form._isOpen();

    assert(!formStatus);

    const question1 = await form.addQuestion({
      questionText: "What's your name?",
    }) as Question;
    const question2 = await form.addQuestion({
      questionText: "How old are you?",
    }) as Question;

    const user1 = "user1" as User;
    const user2 = "user2" as User;

    await form.unlock();

    assert(await form._isOpen());

    const responseContent1 = 45;
    await form.submitResponse({
      question: question2,
      user: user1,
      responseContent: responseContent1,
    }) as Response;

    const responseContent2 = 13;
    await form.submitResponse({
      question: question2,
      user: user2,
      responseContent: responseContent2,
    }) as Response;

    await form.submitResponse({
      question: question1,
      user: user1,
      responseContent: "Bob",
    });

    await form.submitResponse({
      question: question1,
      user: user2,
      responseContent: "Ally",
    });

    const retrievedResponse1 = await form._getResponseContent({
      user: user1,
      question: question2,
    });

    const retrievedResponse2 = await form._getResponseContent({
      user: user2,
      question: question2,
    });

    assertEquals(retrievedResponse1, responseContent1);
    assertEquals(retrievedResponse2, responseContent2);
  } finally {
    await client.close();
  }
});

Deno.test("Action: deleteResponse and deleteQuestion", async () => {
  console.log("\n🧪 TEST CASE 3: Action: deleteResponse and deleteQuestion");
  console.log("==================================");
  const [db, client] = await testDb();
  try {
    const form = new FormConcept(db);
    await form.initialize();

    const formStatus = await form._isOpen();

    assert(!formStatus);

    const question1 = await form.addQuestion({
      questionText: "What's your name?",
    }) as Question;

    const user1 = "user1" as User;

    await form.unlock();

    assert(await form._isOpen());

    const response = await form.submitResponse({
      question: question1,
      user: user1,
      responseContent: "Bob",
    }) as Response;

    await form.lock();

    await form.deleteResponse({ user: user1, question: question1 });

    const responses = await form._getResponses({ question: question1 }) as Set<
      Response
    >;

    assert(!responses.has(response));

    await form.deleteQuestion({ question: question1 });
  } finally {
    await client.close();
  }
});
