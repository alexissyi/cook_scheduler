**concept** Availability\[User, Month, Date\]

**purpose** store User cooking availability for scheduling

**principle** after collecting availability for all users, cooking assignments can be created that only assigns cooks to days they are available

**state**

a Month

a User Cook

a set of Dates AvailableDates

**actions**

setCook(user: User)

**requires** nothing

**effect** sets Cook to user

setMonth(month: Month)

**requires** all Dates in AvailableDates are in month

**effect** sets Month to month

addAvailability(date: Date)

**requires** date is not in AvailableDates and date is in Month

**effect** adds date to AvailableDates

removeAvailability(date: Date)

**requires** date is in AvailableDates

**effect** removes date from AvailableDates