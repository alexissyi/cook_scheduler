## Main Changes

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