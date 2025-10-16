**concept** FormQuestion\[User\]

**purpose** take in user input for a questions

**principle** after users have filled out a form questions, the responses can be used to guide decisionmaking

**state**

a Question with

&ensp; a string QuestionText

a set of Response Responses with

&ensp; a User

&ensp; a String or Boolean ResponseContent

a Boolean Open

**actions**

submitResponse(user: User, responseContent: String or Boolean)

**requires** Open is True

**effect** creates a new Response with user and responseText and adds it to Responses if there is no Response associated with user yet; otherwise, updates Response to responseContent for the Response associated with user

writeQuestion(questionText: QuestionText)

**requires** Responses is empty and Open is False

**effect** sets QuestionText to questionText

deleteResponse(user: User)

**requires** there exists a Reponse associated with user in Responses

**effect** removes the Response associated with user from Responses

lockFormQuestion()

**requires** Open is True

**effect** sets Open to False

openFormQuestion()

**requires** Open is False and questionText has been set to a nonempty string

**effect** sets Open to True