**concept** UserAuthentication

**purpose** to verify whether certain users are allowed to perform certain actions, like editing the cooking assignments

**principle** two users are designated foodstuds; a user must be verified as a foodstud before generating cooking assignments or editing the cooking assignments; users are verified before editing user preferences or availability

**state**

a User ProduceFoodStud

a User CostcoFoodStud

a Set of User Users with

  a String Kerb

  a String Password

**invariants**

ProduceFoodStud is also in Users

CostcoFoodStud is also in Users

**actions**

uploadUser(kerb: String, password: String): User

**requires** no User in Users has the same kerb or the same password

**effect** creates a new User with kerb and password and adds it to Users, returns that User

removeUser(user: User)

**requires** user is in Users, user is not ProduceFoodStud, user is not CostcoFoodStud

**effect** removes user from Users

updatePassword(user: User, newPassword: String)

**requires** user is in Users, newPassword is distinct from that user's original Password and is distinct from all other Passwords in Users

**effect** sets Password of user to password

login(kerb: String, password: String): User

**requires** a User exists in Users with the same kerb and password

**effect** returns that User

setProduceFoodStud(user: User)

**requires** user is in Users

**effect** sets ProduceFoodStud to user

setCostcoFoodStud(user: User)

**requires** user is in Users

**effect** sets CostcoFoodStud to user

verifyFoodStud(user: User)

**requires** either ProduceFoodStud or CostcoFoodStud is user

**effect** nothing

verifyUser(actingUser: User, targetUser: User):

**requires** actingUser is equal to targetUser, both are in Users

**effect** nothing