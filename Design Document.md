Some old documentation of changes is also available here: [Changes](./design/changes.md)

## Major Changes

### 1. Consolidation of Concepts

Previously, I had 4 separate Form, CookingSchedule, Availabilities and Preferences concepts. Due to overlapping concerns across each, I consolidated them all into a single concept, CookingSchedule. An entire separate Form concept was unnecessary because the questions I was thinking to ask were closely tied to the CookingSchedule concept and did not need to be expanded beyond CookingSchedule concerns. Availabilities and Preferences were basically just states for CookingSchedule, and separating them resulted in loss of modularity, so I consolidated them. 

### 2. Addition of Concepts

Previously I had no UserAuthentication or Session concept. For Assignment 4B I had UserAuthentication, but only for Assignment 4C did I add Session. UserAuthentication became necessary once I saw that I only wanted certain users with special privileges to do some of the actions in my concepts. Session became necessary when I realized that I didn't want a user to have to provide credentials for every single action. 

### 3. Various Tweaks to State Management Within Concepts

Most of the changes occurred within the UserAuthentication concept. I previously had no Admin role, but I realized I needed to create one in order to be able to restrict the power to designate Food Stud roles to one user. Otherwise anyone could just make themselves a FoodStud. This would negate the point of having special FoodStud roles in the first place. 

Within UserAuthentication, I originally had separate states designating FoodStuds and Admin as Users, but I decided it was cleaner for each User to just have an isAdmin or isProduceFoodStud/isCostcoFoodStud attribute. 

### 4. Addition of Queries

I added a lot of queries to CookingSchedule and UserAuthentication concepts, especially CookingSchedule, that I hadn't originally planned for. I realized these were necessary in order to display relevant information in my UI calendar displays, even though a lot of times these queries had redundant information. Some of these were kind of complicated, like the _getCandidateCooks query in the CookingSchedule concept, but doing the calculation in the backend was better than doing it in the frontend. 
