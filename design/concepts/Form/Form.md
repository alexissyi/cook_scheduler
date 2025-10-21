**concept** FormQuestion\[User\]

**purpose** take in and store user responses for a set of questions

**principle** can upload questions into the form and open the form; users can respond to the questions; the responses can be used to guide decisionmaking

**state**

a set of Question Questions with 

&ensp; a String QuestionText

a set of Response Responses with

&ensp; a User

&ensp; a Question 

&ensp; a String or Boolean or Number ResponseContent

a Boolean Open

**actions**

initialize()

**requires** no Questions have been added

**effect** sets Open to False

submitResponse(user: User, question: Question, responseContent: String or Boolean or Number)

**requires** Open is True, question is in Questions

**effect** creates a new Response with user, question and responseText and adds it to Responses if there is no Response associated with user and question yet; otherwise, updates Response to responseContent for the Response associated with user and question

addQuestion(questionText: QuestionText): Question

**requires** Open is False

**effect** creates a new Question with QuestionText set to questionText and adds it to Questions, returns that Question

deleteResponse(user: User, question: Question)

**requires** Open is False, there exists a Reponse associated with user and question in Responses

**effect** removes the Response associated with user and question from Responses

deleteQuestion(question: Question)

**requires** question exists in Questions and has no associated Response in Responses

**effect** removes question from Questions

lock()

**requires** Open is True

**effect** sets Open to False

unlock()

**requires** Open is False

**effect** sets Open to True

**queries**

_getResponseContent(user: User, question: Question): Array of String or Boolean or Number

**requires** question is in Questions, there is a Response associated with user and question in Responses

**effect** returns the responseContent of that associated Response

_isOpen(): boolean

**requires** nothing

**effect** returns Open

_getResponses(question: Question): Set of Response

**requires** question is in Questiosn

**effect** returns all Responses associated with question