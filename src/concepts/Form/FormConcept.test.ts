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

    const formStatusObject = await form._isOpen() as Array<{ open: boolean }>;
    const formStatus = formStatusObject[0].open;

    assert(!formStatus);

    const questionObject = await form.addQuestion({
      questionText: "What's your name?",
    }) as { question: Question };
    const question = questionObject.question;

    const user = "user1" as User;

    await form.unlock();

    const openObject = await form._isOpen() as Array<{ open: boolean }>;

    assert(openObject[0].open);

    const responseContent1 = "Bob";

    const responseObject = await form.submitResponse({
      question: question,
      user: user,
      responseContent: responseContent1,
    }) as { response: Response };

    const retrievedResponse = await form._getResponseContent({
      user: user,
      question: question,
    }) as Array<{ responseContent: boolean | number | string }>;

    assertEquals(responseContent1, retrievedResponse[0].responseContent);
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

    const question1Object = await form.addQuestion({
      questionText: "What's your name?",
    }) as { question: Question };

    const question1 = question1Object.question;
    const question2Object = await form.addQuestion({
      questionText: "How old are you?",
    }) as { question: Question };
    const question2 = question2Object.question;

    const user1 = "user1" as User;
    const user2 = "user2" as User;

    await form.unlock();

    const responseContent1 = 45;
    await form.submitResponse({
      question: question2,
      user: user1,
      responseContent: responseContent1,
    });

    const responseContent2 = 13;
    await form.submitResponse({
      question: question2,
      user: user2,
      responseContent: responseContent2,
    });

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
    }) as Array<{ responseContent: boolean | number | string }>;

    const retrievedResponse2 = await form._getResponseContent({
      user: user2,
      question: question2,
    }) as Array<{ responseContent: boolean | number | string }>;

    assertEquals(retrievedResponse1[0].responseContent, responseContent1);
    assertEquals(retrievedResponse2[0].responseContent, responseContent2);
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

    const question1Object = await form.addQuestion({
      questionText: "What's your name?",
    }) as { question: Question };
    const question1 = question1Object.question;

    const user1 = "user1" as User;

    await form.unlock();

    const responseObject = await form.submitResponse({
      question: question1,
      user: user1,
      responseContent: "Bob",
    }) as { response: Response };

    const response = responseObject.response;

    await form.lock();

    await form.deleteResponse({ user: user1, question: question1 });

    const responsesObject = await form._getResponses({
      question: question1,
    }) as Array<{
      response: Response;
    }>;

    const responsesSet: Set<Response> = new Set();
    responsesObject.forEach((responseObject) => {
      responsesSet.add(responseObject.response);
    });

    assert(!responsesSet.has(response));

    await form.deleteQuestion({ question: question1 });
  } finally {
    await client.close();
  }
});
