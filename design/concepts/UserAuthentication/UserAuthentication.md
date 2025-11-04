**concept** UserAuthentication

**purpose** to verify whether certain users are allowed to perform certain actions, like editing the cooking assignments

**principle** users are uploaded with a kerb and password; two users are designated foodstuds; a user must be verified as a foodstud before generating cooking assignments or editing the cooking assignments; users are verified before editing user preferences or availability

**state**

a User Admin

a User ProduceFoodStud

a User CostcoFoodStud

a Set of User Users with

  a String Kerb

  a String Password

**invariants**

ProduceFoodStud is also in Users

CostcoFoodStud is also in Users

Admin is not in Users

**actions**

uploadUser(kerb: String, password: String): User

**requires** no User in Users has the same kerb, Admin does not have the same kerb

**effect** creates a new User with kerb and password and adds it to Users, returns that User

removeUser(user: User)

**requires** user is in Users, user is not ProduceFoodStud or CostcoFoodStud

**effect** removes user from Users

updatePassword(user: User, newPassword: String)

**requires** user is in Users, newPassword is distinct from user's original Password

**effect** sets Password of user to newPassword

updateKerb(user: User, newKerb: String)

**requires** user is in Users, newKerb is distinct from user's original kerb

**effect** sets Kerb of user to kerb

login(kerb: String, password: String): User

**requires** a User exists in Users with the same kerb and password

**effect** returns that User

setProduceFoodStud(user: User)

**requires** user is in Users

**effect** sets ProduceFoodStud to user

setCostcoFoodStud(user: User)

**requires** user is in Users

**effect** sets CostcoFoodStud to user

_isFoodStud(user: User): Array of Boolean

**requires** user is in Users

**effect** returns whether or not user is either CostcoFoodStud or ProduceFoodStud

_isAdmin(user: User): Array of Boolean

**requires** user is in Users

**effect** returns whether or not user is Admin

_getCostcoFoodStudKerb(): Array of String

**requires** CostcoFoodStud is set

**effect** returns kerb of CostcoFoodStud

_getProduceFoodStudKerb(): Array of String

**requires** ProduceFoodStud is set

**effect** returns kerb of ProduceFoodStud

_getUsers(): Array of User

**requires** nothing

**effect** returns Users

_getKerb(user: User): Array of String

**requires** user is in Users

**effect** returns the kerb of user

_getUser(kerb: String): Array of User

**requires** there is a User with kerb in Cooks

**effect** returns User associated with kerb

