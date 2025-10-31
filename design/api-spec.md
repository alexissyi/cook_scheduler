# API Specification: CookScheduler Concept

**Purpose:** To create cooking assignments for the month so we know who cooks when

---

## API Endpoints

### POST /api/cookScheduler/addCook

**Description:** Registers a new User via their kerb

**Requirements:**
- no User in Cooks has this kerb

**Effects:**
- creates a new User with this kerb, adds it to Cooks and returns it

**Request Body:**
```json
{
  "kerb": "string",
}
```

**Success Response Body (Action):**
```json
{
  "user": "string",
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/cookScheduler/removeCook

**Description:** Remove an existing User

**Requirements:**
- user is in Cooks and no Assignment is associated with user

**Effects:**
- removes user and any associated Preference or Availability

**Request Body:**
```json
{
  "user": "string",
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
### POST /api/cookScheduler/addPeriod

**Description:** Registers a cooking period

**Requirements:**
- nothing

**Effects:**
- creates a new Period with month, year and current
- if current is True, marks all other Periods as not current (current = False) - returns new Period

**Request Body:**
```json
{
  "month": "number",
  "year": "number",
}
```

**Success Response Body (Action):**
```json
{
  "period": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/cookScheduler/setCurrentPeriod

**Description:** Sets a period as the current period for scheduling

**Requirements:**
- there is a Period in Periods with month and year

**Effects:**
- marks that corresponding Period as current
- marks all other Periods as not current

**Request Body:**
```json
{
  "month": "number",
  "year": "number",
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/cookScheduler/addCookingDate

**Description:** Adds a date as a cooking date to be assigned

**Requirements:**
- date is not in CookingDates and date is in a Period in Periods
- date is in YYYY-MM-DD format

**Effects:**
- adds date to CookingDates

**Request Body:**
```json
{
  "date": "string",
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/cookScheduler/removeCookingDate

**Description:** Removes a date from the cooking dates

**Requirements:**
- date is in CookingDates
- date is in YYYY-MM-DD format

**Effects:**
- removes date from CookingDates

**Request Body:**
```json
{
  "date": "string",
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/cookScheduler/removeCookingDate

**Description:** Removes a date from the cooking dates

**Requirements:**
- date is in CookingDates
- date is in YYYY-MM-DD format

**Effects:**
- removes date from CookingDates

**Request Body:**
```json
{
  "date": "string",
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/cookScheduler/assignLead

**Description:** Assigns a user as lead cook for a date

**Requirements:**
- date is in CookingDates
- date is in YYYY-MM-DD format
- user is in the set of Users
- user has CanLead or CanSolo marked as True in their associated Preference

**Effects:**
- creates a new Assignment with date and Lead set to user if there is no existing Assignment for this date
- otherwise, updates an existing Assignment if there already is an Assignment for this date

**Request Body:**
```json
{
  "user": "string",
  "date": "string",
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
### POST /api/cookScheduler/assignAssistant

**Description:** Assigns a user as an assistant cook for a date

**Requirements:**
- date is in CookingDates
- date is in YYYY-MM-DD format
- user is in the set of Users
- user has CanAssist marked as True in their associated Preference
- there is already an Assignment with this date in the set of Assignments and the lead for that assignment has CanLead marked as True in their associated Preference

**Effects:**
- sets Assistant in the existing Assignment for this date to be user

**Request Body:**
```json
{
  "user": "string",
  "date": "string",
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/cookScheduler/removeAssignment

**Description:** Removes an assignment for a cooking date

**Requirements:**
- date is in CookingDates
- date is in YYYY-MM-DD format
- there is an Assignment with this date in the set of Assignments

**Effects:**
- removes this Assignment from the set of Assignments

**Request Body:**
```json
{
  "date": "string",
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/cookScheduler/uploadPreference

**Description:** Uploads preferences for a User

**Requirements:**
- user is in Cooks
- period is in Periods
- maxCookingDays is a nonnegative integer

**Effects:**
- creates a new Preference with the inputted settings and adds it to Preferences if there is no preference for this user and period already
- updates Preferences if there is already a preference for user and period, removes all incompatible Assignments

**Request Body:**
```json
{
  "user": "string",
  "period": "string",
  "canSolo": "boolean",
  "canLead": "boolean",
  "canAssist": "boolean",
  "maxCookingDays": "number"
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/cookScheduler/removeAssignment

**Description:** Removes an assignment for a cooking date

**Requirements:**
- date is in CookingDates
- date is in YYYY-MM-DD format
- there is an Assignment with this date in the set of Assignments

**Effects:**
- removes this Assignment from the set of Assignments

**Request Body:**
```json
{
  "date": "string",
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/cookScheduler/addAvailability

**Description:** Adds a date to a user's available dates

**Requirements:**
- user is in Cooks
- date is in YYYY-MM-DD format
- date is in CookingDates

**Effects:**
- adds this date to Availabilities
- removes all incompatible Assignments

**Request Body:**
```json
{
  "user": "string",
  "date": "string"
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/cookScheduler/removeAvailability

**Description:** Removes a date from a user's available dates

**Requirements:**
- user is in Cooks
- date is in YYYY-MM-DD format
- date is in CookingDates
- there is an Availability with this user and date in Availabilities

**Effects:**
-  removes corresponding Availability from Availabilities and removes all incompatible Assignments

**Request Body:**
```json
{
  "user": "string",
  "date": "string"
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
### POST /api/cookScheduler/generateAssignments

**Description:** Generates and creates a set of assignments algorithmically based on preferences and availabilities

**Requirements:**
- no existing Assignments violate Availabilities and Preferences
- there is exactly one Period with current set to True

**Effects:**
-  generates an assignment of Users to the CookingDates in the current Period via an algorithm that violates no constraints in Availabilities or Preferences and satisfies all prior existing Assignments

**Request Body:**
```json
{
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/cookScheduler/generateAssignmentsWithLLM

**Description:** Generates and creates a set of assignments algorithmically based on preferences and availabilities

**Requirements:**
- no existing Assignments violate Availabilities and Preferences
- there is exactly one Period with current set to True

**Effects:**
-  generates an assignment of Users to the CookingDates with an LLM that violates no constraints in Availabilities or Preferences and satisfies all prior existing Assignments

**Request Body:**
```json
{
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/cookScheduler/\_getCooks

**Description:** Get all registered Users

**Requirements:**
- period is in Periods

**Effects:**
-  returns Users associated with period

**Request Body:**
```json
{
  "period": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "user": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/cookScheduler/\_getCookingDates

**Description:** Get all cooking dates associated with a given period

**Requirements:**
- period is in Periods

**Effects:**
-  returns Users associated with period

**Request Body:**
```json
{
  "period": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "cookingDate": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/cookScheduler/\_getCurrentPeriod

**Description:** Get the current period

**Requirements:**
- there exists a current Period in Periods

**Effects:**
-  returns the Period where current is True

**Request Body:**
```json
{
}
```

**Success Response Body (Query):**
```json
[
  {
    "period": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/cookScheduler/\_getAssignments

**Description:** Get all assignments for a given period

**Requirements:**
- period is in Periods

**Effects:**
- returns the Assignments for period

**Request Body:**
```json
{
  "period": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "assignment": {
      "lead": "string",
      "assistant": "string | undefined",
      "date": "string"
    }
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/cookScheduler/\_getKerb

**Description:** Get the kerb of a User

**Requirements:**
- user is in Cooks

**Effects:**
- returns the kerb of user

**Request Body:**
```json
{
  "user": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "kerb": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/cookScheduler/\_getCook

**Description:** Get the User associated with a kerb

**Requirements:**
- there is a User with kerb in Cooks

**Effects:**
- returns User associated with kerb

**Request Body:**
```json
{
  "kerb": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "user": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

# API Specification: UserAuthentication Concept

**Purpose:** To verify whether certain users are allowed to perform certain actions, like editing the cooking assignments

---

## API Endpoints

### POST /api/userAuthentication/initialize

**Description:** initializes the authenticator by setting ProduceFoodStud and CostcoFoodStud to null

**Requirements:**
- no Users have been uploaded

**Effects:**
- sets ProduceFoodStud and CostcoFoodStud to null

**Request Body:**
```json
{
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/userAuthentication/uploadUser

**Description:** Registers a User with a kerb and password

**Requirements:**
- no User in Users has the same kerb or the same password

**Effects:**
- creates a new User with kerb and password and adds it to Users, returns that User

**Request Body:**
```json
{
  "kerb": "string",
  "password": "string"
}
```

**Success Response Body (Action):**
```json
{
  "user": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/userAuthentication/removeUser

**Description:** Deregisters a User

**Requirements:**
- user is in Users
- user is not ProduceFoodStud
- user is not CostcoFoodStud

**Effects:**
- removes user from Users

**Request Body:**
```json
{
  "user": "string"
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/userAuthentication/updatePassword

**Description:** Updates a User's Password

**Requirements:**
- user is in Users
- newPassword is distinct from that user's original Password and all other Passwords in Users

**Effects:**
- sets Password of user to newPassword

**Request Body:**
```json
{
  "user": "string",
  "newPassword": "string"
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/userAuthentication/login

**Description:** Return a User for a given Kerb and Password

**Requirements:**
- a User exists in Users with the same kerb and password

**Effects:**
- returns the associated User

**Request Body:**
```json
{
  "kerb": "string",
  "password": "string"
}
```

**Success Response Body (Action):**
```json
{
  "user": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/userAuthentication/setProduceFoodStud

**Description:** Sets ProduceFoodStud to a given User

**Requirements:**
- user is in Users

**Effects:**
- sets ProduceFoodStud to user

**Request Body:**
```json
{
  "user": "string"
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/userAuthentication/setCostcoFoodStud

**Description:** Sets CostcoFoodStud to a given User

**Requirements:**
- user is in Users

**Effects:**
- sets CostcoFoodStud to user

**Request Body:**
```json
{
  "user": "string"
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/userAuthentication/verifyFoodStud

**Description:** Only runs without error if a given User is a Foodstud

**Requirements:**
- either ProduceFoodStud or CostcoFoodStud is user

**Effects:**
- nothing

**Request Body:**
```json
{
  "user": "string"
}
```

**Success Response Body (Action):**
```json
{
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### GET /api/userAuthentication/_getCostcoFoodStudKerb

**Description:** Get kerb of CostcoFoodStud

**Requirements:**
- CostcoFoodStud is set

**Effects:**
- returns kerb of CostcoFoodStud

**Request Body:**
```json
{
}
```

**Success Response Body (Query):**
```json
[
  {
    "costcoFoodStudKerb": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### GET /api/userAuthentication/_getProduceFoodStudKerb

**Description:** Get kerb of ProduceFoodStud

**Requirements:**
- ProduceFoodStud is set

**Effects:**
- returns kerb of ProduceFoodStud

**Request Body:**
```json
{
}
```

**Success Response Body (Query):**
```json
[
  {
    "produceFoodStudKerb": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### GET /api/userAuthentication/_getUsers

**Description:** Get all registered Users

**Requirements:**

**Effects:**
- returns Users

**Request Body:**
```json
{
}
```

**Success Response Body (Query):**
```json
[
  {
    "user": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### GET /api/userAuthentication/_getKerb

**Description:** Get the kerb of a given User

**Requirements:**
- user is in Users

**Effects:**
- returns the kerb of user

**Request Body:**
```json
{
  "user": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "kerb": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### GET /api/userAuthentication/_getUser

**Description:** Get the User associated with a given Kerb

**Requirements:**
- there is a User with kerb in Cooks

**Effects:**
- returns User associated with kerb

**Request Body:**
```json
{
  "kerb": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "string": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

