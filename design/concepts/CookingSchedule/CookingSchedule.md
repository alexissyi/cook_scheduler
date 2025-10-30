**concept** CookScheduler

**purpose** create cooking assignments for the month so we know who cooks when

**principle** user availabilities and preferences are uploaded by all users independently; cooking dates are added based on WILG meal plan calendar; can then use LLM to generate cooking assignments that satisfy the constraints; can also edit the resulting assignments;

**state** 

a set of Period Periods with 

&ensp; a boolean Open

&ensp; a boolean Current

&ensp; a set of User Cooks

a set of Date CookingDates

a set of Availability Availabilities with

&ensp; a User

&ensp; a Date

a set of Preference Preferences with

&ensp; a User

&ensp; a Period
    
&ensp; a boolean CanSolo
    
&ensp; a boolean CanLead
    
&ensp; a boolean CanAssist
    
&ensp; a number MaxCookingDays
    
a set of Assignment Assignments with
    
&ensp; a Date
    
&ensp; a User Lead
    
&ensp; an optional User Assistant

**invariants**

all dates in CookingDates are within some Period in Periods

every Assignment in Assignments has a Date in CookingDates and a Lead in Cooks for the Period associated with Date; if it has an Assistant, the Assistant is in the same Cooks set

at most one Period has Current set to True

**actions**    

addPeriod(period: Period, current: boolean)

**requires** nothing

**effect**  adds period to Periods with Current set to current; if current is True, marks all other Periods as not current (current = False)

removePeriod(period: Period, current: boolean)

**requires** period is in Periods

**effect**  removes period from Periods and removes all associated Dates in CookingDates, all associated Preferences, all associated Availabilities, all associated Assignments

setCurrentPeriod(period: Period)

**requires** period is in Periods

**effect** period as current, marks all other Periods as not current

addCook(user: User, period: Period): User

**requires** period is in Periods, User is not in Cooks for period

**effect** adds User to Cooks for period

removeCook(user: User):

**requires** user is in Cooks and no Assignment is associated with user
        
**effect** removes user and any associated Preference or Availability

addCookingDate(date: Date):

**requires** date is not in CookingDates and date is in a Period in Periods

**effect** adds date to CookingDates

removeCookingDate(date: Date):

**requires** date is in CookingDates

**effect** removes date from CookingDates

assignLead(user: User, date: Date):

**requires** date is in CookingDates; user is in Cooks for the Period associated with date; user has CanLead or CanSolo marked as True for this Period in the associated Preference

**effect** creates a new Assignment with date and Lead set to user if there is no existing Assignment for this date, or updates an existing Assignment if there already is an Assignment for this date

assignAssistant(user: User, date: Date)

**requires** date is in CookingDates; user is in Cooks for the Period associated with date; there is already an Assignment with this date in the set of Assignments, the lead for that assignment has CanLead marked as True in their associated Preference for this Period; user has CanAssist marked as True in their associated Preference for this Period

**effect** sets Assistant in the existing Assignment for this date to be user

removeAssignment(date: Date)

**requires** there is an Assignment with this date in the set of Assignments

**effect** removes this Assignment from the set of Assignments

uploadPreference(user: User, period: Period, canSolo: boolean, canLead: boolean, canAssist: boolean, maxCookingDays: boolean)

**requires** user is in Cooks for period, period is in Periods, maxCookingDays is a nonnegative integer

**effect** creates a new Preference with these fields and adds it to Preferences, or updates Preferences if there is already a preference for user and period, removes all incompatible Assignments

async addAvailability(user: User, date: Date)

**requires** user is in Cooks; date is in CookingDates

**effect** adds this date to Availabilities

async removeAvailability(user: User, date: Date)

**requires** user is in Cooks; date is in CookingDates; there is an Availability with this user and date in Availabilities

**effect** removes corresponding Availability from Availabilities and removes all incompatible Assignments

async generateAssignments()

**requires**  no existing Assignments violate Availabilities and Preferences and there is exactly one Period with current set to True

**effect** generates an assignment of Users to the CookingDates in the current Period via an algorithm that violates no constraints in Availabilities or Preferences and satisfies all prior existing Assignments

async generateAssignmentsWithLLM()

**requires** no existing Assignments violate Availabilities and Preferences and there is exactly one Period with current set to True

**effect** generates an assignment of Users to the CookingDates with an LLM that violates no constraints in Availabilities or Preferences and satisfies all prior existing Assignments

**queries**

_isRegistered(period: Period): Array of Boolean

_isOpen(period: Period): Array of Boolean

_getCooks(period: Period): Array of User

**requires** period is in Periods

**effect** returns Users associated with period

_getCookingDates(period: Period): Array of Date

**requires** period is in Periods

**effect** returns CookingDates associated with period

_getCurrentPeriod(): Array of Period

**requires** there exists a current Period in Periods

**effect** returns the Period where current is True

_getAssignment(date: Date): Array of Assignment

_getAssignments(period: Period): Array of Assignment

**requires** period is in Periods

**effect** returns the Assignments for period

_getAvailability(user: User, period: Period): Array of Date

_getPreference(user: User, period: Period): Array of Preference
    