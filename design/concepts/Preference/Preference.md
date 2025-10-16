**concept** Preference\[User\]

**purpose** store cooking role preferences for scheduling

**principle** after collecting user preferences, cooking assignments can be made that only assign people one of their preferred roles each day they cook

**state**

a User Cook

a boolean CanSolo

a boolean CanLead

a boolean CanAssist

an int MaxCookingDays

**actions**

setCook(user: User)

**requires** nothing

**effect** sets Cook to User

updateSolo(canSolo: boolean)

**requires** nothing

**effect** updates CanSolo to canSolo

updateLead(canLead: boolean)

**requires** nothing

**effect** updates CanLead to canLead

updateAssist(canAssist: boolean)

**requires** nothing

**effect** updates CanAssist to canAssist

updateMaxCookingDays(maxCookingDays: int)

**requires** maxCookingDays is nonnegative

**effect** updates MaxCookingDays to maxCookingDays