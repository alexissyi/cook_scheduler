## CookScheduler Tests Output

Operational principle: users upload availability and preferences, can manually assign cooks ...
------- output -------

🧪 TEST CASE 1: Manual Scheduling
==================================
Successfully added current month and year
Successfully added two cooking dates
Successfully added two cooks
Successfully added availabilities
Successfully uploaded preferences
Successfully made assignments
Successfully removed assignments
Successfully removed cook
Successfully removed cooking date
----- output end -----
Operational principle: users upload availability and preferences, can manually assign cooks ... ok (2s)
Operational principle: user upload availability and preferences, algorithm assigns them ...
------- output -------

🧪 TEST CASE 2: Algorithmic Scheduling
========================================
Successfully set month and year
Successfully added cooking dates
Successfully added cooks
Successfully uploaded availabilities
Successfully uploaded preferences
Finished algorithmic generation
Successfully made assignments algorithmically
in finally block
client closed
----- output end -----
Operational principle: user upload availability and preferences, algorithm assigns them ... ok (1s)
Action: generateAssignments ...
------- output -------

🧪 TEST CASE 3: Algorithmic Scheduling
========================================
Successfully set month and year
Successfully added four cooking dates
Successfully added three cooks
Successfully uploaded availabilities
Successfully uploaded preferences
Successfully made assignments
----- output end -----
Action: generateAssignments ... ok (1s)
Operational principle: user upload availability and preferences, LLM assigns them automatically ...
------- output -------

🧪 TEST CASE 4: LLM-Assisted Scheduling
========================================
Successfully set month and year
Successfully added cooking dates
Successfully added cooks
Successfully uploaded availabilities
Successfully uploaded preferences
✅ Received response from Gemini AI!

🤖 RAW GEMINI RESPONSE
======================
```json
{
  "assignments": [
    {
      "date": "2025-10-01",
      "lead": "0199ff9c-3056-7fb7-b35a-85488456d2c5",
      "assistant": null
    }
  ]
}
```
======================

Generated following assignments
[
  {
    date: "2025-10-01",
    lead: "0199ff9c-3056-7fb7-b35a-85488456d2c5",
    assistant: null
  }
]
Finished applying assignments
Successfully made assignments with LLM
----- output end -----
Operational principle: user upload availability and preferences, LLM assigns them automatically ... ok (2s)
Action: generateAssignmentsWithLLM ...
------- output -------

🧪 TEST CASE 5: LLM-Assisted Scheduling
========================================
Successfully set month and year
Successfully added four cooking dates
Successfully added three cooks
Successfully uploaded availabilities
Successfully uploaded preferences
✅ Received response from Gemini AI!

🤖 RAW GEMINI RESPONSE
======================
```json
{
  "assignments": [
    {
      "date": "2025-10-01",
      "lead": "0199ff9c-387f-7766-9564-3ff1304cda65",
      "assistant": null
    },
    {
      "date": "2025-10-02",
      "lead": "0199ff9c-387f-7766-9564-3ff1304cda65",
      "assistant": null
    },
    {
      "date": "2025-10-03",
      "lead": "0199ff9c-38ae-7975-9241-ffd3970ff155",
      "assistant": "0199ff9c-38d0-718c-8f9d-20a75396d48a"
    },
    {
      "date": "2025-10-04",
      "lead": "0199ff9c-38d0-718c-8f9d-20a75396d48a",
      "assistant": null
    }
  ]
}
```
======================

Generated following assignments
[
  {
    date: "2025-10-01",
    lead: "0199ff9c-387f-7766-9564-3ff1304cda65",
    assistant: null
  },
  {
    date: "2025-10-02",
    lead: "0199ff9c-387f-7766-9564-3ff1304cda65",
    assistant: null
  },
  {
    date: "2025-10-03",
    lead: "0199ff9c-38ae-7975-9241-ffd3970ff155",
    assistant: "0199ff9c-38d0-718c-8f9d-20a75396d48a"
  },
  {
    date: "2025-10-04",
    lead: "0199ff9c-38d0-718c-8f9d-20a75396d48a",
    assistant: null
  }
]
Finished applying assignments
Successfully made assignments
----- output end -----
Action: generateAssignmentsWithLLM ... ok (3s)
Impossible case ...
------- output -------

🧪 TEST CASE 5: LLM-Assisted Scheduling
========================================
Successfully set month and year
Successfully added four cooking dates
Successfully added three cooks
Successfully uploaded availabilities
Successfully uploaded preferences
✅ Received response from Gemini AI!

🤖 RAW GEMINI RESPONSE
======================
```json
{
  "assignments": [
    {
      "date": "2025-10-01",
      "lead": "0199ff9c-46dd-75cc-ae92-7fdaa4c11bf0",
      "assistant": "0199ff9c-472d-7b2c-8acb-d318e12b99e0"
    },
    {
      "date": "2025-10-02",
      "lead": "0199ff9c-46dd-75cc-ae92-7fdaa4c11bf0",
      "assistant": null
    },
    {
      "date": "2025-10-03",
      "lead": "0199ff9c-470c-75cb-aae5-43e52474f7fb",
      "assistant": "0199ff9c-472d-7b2c-8acb-d318e12b99e0"
    },
    {
      "date": "2025-10-04",
      "lead": "0199ff9c-472d-7b2c-8acb-d318e12b99e0",
      "assistant": null
    }
  ]
}
```
======================

Generated following assignments
[
  {
    date: "2025-10-01",
    lead: "0199ff9c-46dd-75cc-ae92-7fdaa4c11bf0",
    assistant: "0199ff9c-472d-7b2c-8acb-d318e12b99e0"
  },
  {
    date: "2025-10-02",
    lead: "0199ff9c-46dd-75cc-ae92-7fdaa4c11bf0",
    assistant: null
  },
  {
    date: "2025-10-03",
    lead: "0199ff9c-470c-75cb-aae5-43e52474f7fb",
    assistant: "0199ff9c-472d-7b2c-8acb-d318e12b99e0"
  },
  {
    date: "2025-10-04",
    lead: "0199ff9c-472d-7b2c-8acb-d318e12b99e0",
    assistant: null
  }
]
Finished applying assignments
Successfully made assignments
----- output end -----
Impossible case ... ok (3s)
running 3 tests from ./src/concepts/Form/FormConcept.test.ts
Operational Principle: can upload question into the form and open the form; user can respond to the question; the response can be used to guide decisionmaking ...
------- post-test output -------

## Form Tests Output

🧪 TEST CASE 1: Operational principle
==================================
----- post-test output end -----
Operational Principle: can upload question into the form and open the form; user can respond to the question; the response can be used to guide decisionmaking ... ok (870ms)
Operational Principle: can upload multiple questions into the form and open the form; multiple users can respond to the questions; the responses can be used to guide decisionmaking ...
------- post-test output -------

🧪 TEST CASE 2: Operational principle, more complex
==================================
----- post-test output end -----
Operational Principle: can upload multiple questions into the form and open the form; multiple users can respond to the questions; the responses can be used to guide decisionmaking ... ok (939ms)
Action: deleteResponse and deleteQuestion ...
------- post-test output -------

🧪 TEST CASE 3: Action: deleteResponse and deleteQuestion
==================================
----- post-test output end -----
Action: deleteResponse and deleteQuestion ... ok (879ms)
running 5 tests from ./src/concepts/UserAuthentication/UserAuthenticationConcept.test.ts
Operational principle: upload users, designate users as foodstuds ...
------- post-test output -------

## UserAuthentication Tests Output

🧪 TEST CASE 1: Operational principle, simple
==================================
----- post-test output end -----
Operational principle: upload users, designate users as foodstuds, users can login ... ok (1s)
Action: updatePassword ...
------- post-test output -------

🧪 TEST CASE 2: Action updatePassword
==================================
----- post-test output end -----
Action: updatePassword ... ok (960ms)
Action: removeUser ...
------- post-test output -------

🧪 TEST CASE 3: Action removeUser
==================================
----- post-test output end -----
Action: removeUser ... ok (890ms)
Action: verifyFoodStud and verifyUser ...
------- post-test output -------

🧪 TEST CASE 4: Action verifyFoodStud and verifyUser
==================================
----- post-test output end -----
Action: verifyFoodStud and verifyUser ... ok (860ms)
running 5 tests from ./src/concepts/[EXAMPLE]LikertSurvey/LikertSurveyConcept.test.ts
Principle: Author creates survey, respondent answers, author views results ... ok (986ms)
Action: createSurvey requires scaleMin < scaleMax ... ok (546ms)
Action: addQuestion requires an existing survey ... ok (449ms)
Action: submitResponse requirements are enforced ... ok (841ms)
Action: updateResponse successfully updates a response and enforces requirements ... ok (883ms)

