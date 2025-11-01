## Changes for Assignment 4B

### 1. Consolidated the Form concept into my CookingSchedule concept

I realized that the Form concept I originally had was actually extremely closely tied to my CookingSchedule concept, in that I already had a fixed number and type of questions in mind. So I decided to just integrate this concept into the CookingSchedule concept by adding extra state to the Period objects indicating whether they were open for people to input preferences and availabilities or not.

I was hesitant to do this because my CookingSchedule concept was already so gargantuan, but it really seemed like the different aspects of this concept could not really be divorced. 

### 2. Added many, many more queries

I did not realize how many different formats my frontend needed to get data in. This required me to create some more queries for my concepts, particularly for the CookingSchedule concept, that I previously thought were extraneous. However, I realized it was probably smarter to do most computation in the backend. 

### 3. Tweaked CookingSchedule concept state

I decided to assign cooks per period, rather than cooks over all. In my mind, it is possible that cooks might want different subsets of users cooking each month, or for some reason a user is on probation for a month because they were always late the previous month or something. 


## Changes for Assignment 4A

### 1. Consolidated overlapping concepts into one main concept CookScheduler

Previously, I had separate concepts for Availability, Preference, Assignment etc, but based on Assignment 2 feedback I learned that they were too related to be separated. I integrated them all into one big CookScheduler concept.

### 2. Created a new concept, UserAuthentication

I wanted to make sure only foodstuds had the privileges of making/adjusting the assignments, which required some kind of authentication system. I decided to also have this concept support basic passwords, just so it only allows approved users (e.g. only WILG people).

## Interesting Moments

Unfortunately I did not work incrementally enough and forgot to save snapshots.  But here is what I remember: 

### 1. Switching from local storage to MongoDB 

This actually simplified some of my implementations significantly, since MongoDB's document structure supports some pretty robust filtering. 

### 2. Reverting Form back to its original Assignment 2 state (instead of Assignment 3 state) to support multiple questions

I mainly did this because I realized it didn't make much sense to allow someone to toggle individual questions open or not open. It made a lot more sense to have one big form, with individual questions within it. 

### 3. Writing the algorithm to generate assignments

I went with a non-optimal algorithm that just greedily assigns people. Surprisingly, this still was able to come up with some pretty reasonable assignments. 

### 4. The importance of await

I'm not sure if this counts as an interesting moment, but I spent a long time debugging MongoDB session errors because of a single MongoDB API call that I had forgotten to await. I am now much more vigilant about await as I code. 