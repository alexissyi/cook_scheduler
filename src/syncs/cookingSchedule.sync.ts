import {
  CookingSchedule,
  Requesting,
  Session,
  UserAuthentication,
} from "@concepts";
import { actions, Sync } from "@engine";

// ------------------------ FOODSTUD SPECIFIC CONTROLS

// addPeriod

export const AddPeriodRequest: Sync = (
  { request, session, period, current, actingUser, isFoodStud },
) => ({
  when: actions([Requesting.request, {
    path: "/addPeriod",
    period,
    current,
    session,
  }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = await frames.query(UserAuthentication._isFoodStud, {
      user: actingUser,
    }, { isFoodStud });
    frames = frames.filter(($) => $[isFoodStud] === true);
    return frames;
  },
  then: actions([CookingSchedule.addPeriod, { period, current }]),
});

export const AddPeriodResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/addPeriod" }, { request }],
    [CookingSchedule.addPeriod, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "added period",
  }]),
});

export const AddPeriodResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/addPeriod" }, { request }],
    [CookingSchedule.addPeriod, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// removePeriod

export const RemovePeriodRequest: Sync = (
  { request, session, period, actingUser, isFoodStud },
) => ({
  when: actions([
    Requesting.request,
    { path: "/removePeriod", period, session },
    {
      request,
    },
  ]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = await frames.query(UserAuthentication._isFoodStud, {
      user: actingUser,
    }, { isFoodStud });
    frames = frames.filter(($) => $[isFoodStud] === true);
    return frames;
  },
  then: actions([CookingSchedule.removePeriod, { period }]),
});

export const RemovePeriodResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/removePeriod" }, { request }],
    [CookingSchedule.removePeriod, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "removed period",
  }]),
});

export const RemovePeriodResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/removePeriod" }, { request }],
    [CookingSchedule.removePeriod, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// setCurrentPeriod

export const SetCurrentPeriodRequest: Sync = (
  { request, session, period, actingUser, isFoodStud },
) => ({
  when: actions([Requesting.request, {
    path: "/setCurrentPeriod",
    session,
    period,
  }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = await frames.query(UserAuthentication._isFoodStud, {
      user: actingUser,
    }, { isFoodStud });
    frames = frames.filter(($) => $[isFoodStud] === true);
    return frames;
  },
  then: actions([CookingSchedule.setCurrentPeriod, { period }]),
});

export const SetCurrentPeriodResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/setCurrentPeriod" }, { request }],
    [CookingSchedule.setCurrentPeriod, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "set current period",
  }]),
});

export const SetCurrentPeriodResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/setCurrentPeriod" }, { request }],
    [CookingSchedule.setCurrentPeriod, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// openPeriod

export const OpenPeriodRequest: Sync = (
  { request, session, period, actingUser, isFoodStud },
) => ({
  when: actions([Requesting.request, { path: "/openPeriod", session, period }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = await frames.query(UserAuthentication._isFoodStud, {
      user: actingUser,
    }, { isFoodStud });
    frames = frames.filter(($) => $[isFoodStud] === true);
    return frames;
  },
  then: actions([CookingSchedule.openPeriod, { period }]),
});

export const OpenPeriodResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/openPeriod" }, { request }],
    [CookingSchedule.openPeriod, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "opened period",
  }]),
});

export const OpenPeriodResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/openPeriod" }, { request }],
    [CookingSchedule.openPeriod, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// closePeriod

export const ClosePeriodRequest: Sync = (
  { request, session, period, actingUser, isFoodStud },
) => ({
  when: actions([
    Requesting.request,
    { path: "/closePeriod", session, period },
    {
      request,
    },
  ]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = await frames.query(UserAuthentication._isFoodStud, {
      user: actingUser,
    }, { isFoodStud });
    frames = frames.filter(($) => $[isFoodStud] === true);
    return frames;
  },
  then: actions([CookingSchedule.closePeriod, { period }]),
});

export const ClosePeriodResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/closePeriod" }, { request }],
    [CookingSchedule.closePeriod, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "closed period",
  }]),
});

export const ClosePeriodResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/closePeriod" }, { request }],
    [CookingSchedule.closePeriod, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// addCook

export const AddCookRequest: Sync = (
  { request, session, period, user, actingUser, isUser, isFoodStud },
) => ({
  when: actions([Requesting.request, {
    path: "/addCook",
    session,
    period,
    user,
  }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = await frames.query(UserAuthentication._isUser, { user }, {
      isUser,
    });
    frames = frames.filter(($) => $[isUser] === true);
    frames = await frames.query(UserAuthentication._isFoodStud, {
      user: actingUser,
    }, { isFoodStud });
    frames = frames.filter(($) => $[isFoodStud] === true);
    return frames;
  },
  then: actions([CookingSchedule.addCook, { period, user }]),
});

export const AddCookResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/addCook" }, { request }],
    [CookingSchedule.addCook, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "added cook",
  }]),
});

export const AddCookResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/addCook" }, { request }],
    [CookingSchedule.addCook, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// removeCook

export const RemoveCookRequest: Sync = (
  { request, session, period, user, actingUser, isUser, isFoodStud },
) => ({
  when: actions([Requesting.request, {
    path: "/removeCook",
    session,
    period,
    user,
  }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = await frames.query(UserAuthentication._isUser, { user }, {
      isUser,
    });
    frames = frames.filter(($) => $[isUser] === true);
    frames = await frames.query(UserAuthentication._isFoodStud, {
      user: actingUser,
    }, { isFoodStud });
    frames = frames.filter(($) => $[isFoodStud] === true);
    return frames;
  },
  then: actions([CookingSchedule.removeCook, { period, user }]),
});

export const RemoveCookResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/removeCook" }, { request }],
    [CookingSchedule.removeCook, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "removed cook",
  }]),
});

export const RemoveCookResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/removeCook" }, { request }],
    [CookingSchedule.removeCook, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// addCookingDate

export const AddCookingDateRequest: Sync = (
  { request, session, date, actingUser, isFoodStud },
) => ({
  when: actions([
    Requesting.request,
    { path: "/addCookingDate", session, date },
    {
      request,
    },
  ]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = await frames.query(UserAuthentication._isFoodStud, {
      user: actingUser,
    }, { isFoodStud });
    frames = frames.filter(($) => $[isFoodStud] === true);
    return frames;
  },
  then: actions([CookingSchedule.addCookingDate, { date }]),
});

export const AddCookingDateResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/addCookingDate" }, { request }],
    [CookingSchedule.addCookingDate, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "added cooking date",
  }]),
});

export const AddCookingDateResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/addCookingDate" }, { request }],
    [CookingSchedule.addCookingDate, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// removeCookingDate

export const RemoveCookingDateRequest: Sync = (
  { request, session, date, actingUser, isFoodStud },
) => ({
  when: actions([Requesting.request, {
    path: "/removeCookingDate",
    session,
    date,
  }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = await frames.query(UserAuthentication._isFoodStud, {
      user: actingUser,
    }, { isFoodStud });
    frames = frames.filter(($) => $[isFoodStud] === true);
    return frames;
  },
  then: actions([CookingSchedule.removeCookingDate, { date }]),
});

export const RemoveCookingDateResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/removeCookingDate" }, { request }],
    [CookingSchedule.removeCookingDate, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "removed cooking date",
  }]),
});

export const RemoveCookingDateResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/removeCookingDate" }, { request }],
    [CookingSchedule.removeCookingDate, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// assignLead

export const AssignLeadRequest: Sync = (
  { request, session, user, date, actingUser, isFoodStud },
) => ({
  when: actions([Requesting.request, {
    path: "/assignLead",
    session,
    user,
    date,
  }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = await frames.query(UserAuthentication._isFoodStud, {
      user: actingUser,
    }, { isFoodStud });
    frames = frames.filter(($) => $[isFoodStud] === true);
    return frames;
  },
  then: actions([CookingSchedule.assignLead, { user, date }]),
});

export const AssignLeadResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/assignLead" }, { request }],
    [CookingSchedule.assignLead, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "assigned lead",
  }]),
});

export const AssignLeadResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/assignLead" }, { request }],
    [CookingSchedule.assignLead, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// assignAssistant

export const AssignAssistantRequest: Sync = (
  { request, session, user, date, actingUser, isFoodStud },
) => ({
  when: actions([Requesting.request, {
    path: "/assignAssistant",
    session,
    user,
    date,
  }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = await frames.query(UserAuthentication._isFoodStud, {
      user: actingUser,
    }, { isFoodStud });
    frames = frames.filter(($) => $[isFoodStud] === true);
    return frames;
  },
  then: actions([CookingSchedule.assignAssistant, { user, date }]),
});

export const AssignAssistantResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/assignAssistant" }, { request }],
    [CookingSchedule.assignAssistant, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "assigned assistant",
  }]),
});

export const AssignAssistantResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/assignAssistant" }, { request }],
    [CookingSchedule.assignAssistant, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// removeAssignment

export const RemoveAssignmentRequest: Sync = (
  { request, session, date, actingUser, isFoodStud },
) => ({
  when: actions([Requesting.request, {
    path: "/removeAssignment",
    session,
    date,
  }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = await frames.query(UserAuthentication._isFoodStud, {
      user: actingUser,
    }, { isFoodStud });
    frames = frames.filter(($) => $[isFoodStud] === true);
    return frames;
  },
  then: actions([CookingSchedule.removeAssignment, { date }]),
});

export const RemoveAssignmentResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/removeAssignment" }, { request }],
    [CookingSchedule.removeAssignment, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "removed assignment",
  }]),
});

export const RemoveAssignmentResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/removeAssignment" }, { request }],
    [CookingSchedule.removeAssignment, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// clearAssignments

export const ClearAssignmentsRequest: Sync = (
  { request, session, period, actingUser, isFoodStud },
) => ({
  when: actions([Requesting.request, {
    path: "/clearAssignments",
    period,
    session,
  }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = await frames.query(UserAuthentication._isFoodStud, {
      user: actingUser,
    }, { isFoodStud });
    frames = frames.filter(($) => $[isFoodStud] === true);
    return frames;
  },
  then: actions([CookingSchedule.clearAssignments, { period }]),
});

export const ClearAssignmentsResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/clearAssignments" }, { request }],
    [CookingSchedule.clearAssignments, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "cleared assignments",
  }]),
});

export const ClearAssignmentsResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/clearAssignments" }, { request }],
    [CookingSchedule.clearAssignments, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// generateAssignments

export const GenerateAssignmentsRequest: Sync = (
  { request, session, actingUser, isFoodStud },
) => ({
  when: actions([Requesting.request, {
    path: "/generateAssignments",
    session,
  }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = await frames.query(UserAuthentication._isFoodStud, {
      user: actingUser,
    }, { isFoodStud });
    frames = frames.filter(($) => $[isFoodStud] === true);
    return frames;
  },
  then: actions([CookingSchedule.generateAssignments, {}]),
});

export const GenerateAssignmentsResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/generateAssignments" }, { request }],
    [CookingSchedule.generateAssignments, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "generated assignments",
  }]),
});

export const GenerateAssignmentsResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/generateAssignments" }, { request }],
    [CookingSchedule.generateAssignments, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// generateAssignmentsWithLLM

export const GenerateAssignmentsWithLLMRequest: Sync = (
  { request, session, actingUser, isFoodStud },
) => ({
  when: actions([Requesting.request, {
    path: "/generateAssignmentsWithLLM",
    session,
  }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = await frames.query(UserAuthentication._isFoodStud, {
      user: actingUser,
    }, { isFoodStud });
    frames = frames.filter(($) => $[isFoodStud] === true);
    return frames;
  },
  then: actions([CookingSchedule.generateAssignmentsWithLLM, {}]),
});

export const GenerateAssignmentsWithLLMResponseSuccess: Sync = (
  { request },
) => ({
  when: actions(
    [Requesting.request, { path: "/generateAssignmentsWithLLM" }, { request }],
    [CookingSchedule.generateAssignmentsWithLLM, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "generated assignments with llm",
  }]),
});

export const GenerateAssignmentsWithLLMResponseError: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/generateAssignmentsWithLLM" }, { request }],
    [CookingSchedule.generateAssignmentsWithLLM, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// ----------------------------- USER SPECIFIC CONTROLS

// uploadPreference

export const UploadPreferenceRequest: Sync = (
  {
    request,
    session,
    user,
    period,
    canSolo,
    canLead,
    canAssist,
    maxCookingDays,
    actingUser,
  },
) => ({
  when: actions([Requesting.request, {
    path: "/uploadPreference",
    session,
    user,
    period,
    canSolo,
    canLead,
    canAssist,
    maxCookingDays,
  }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = frames.filter(($) => $[actingUser] === $[user]);
    return frames;
  },
  then: actions([CookingSchedule.uploadPreference, {
    user,
    period,
    canSolo,
    canLead,
    canAssist,
    maxCookingDays,
  }]),
});

export const UploadPreferenceResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/uploadPreference" }, { request }],
    [CookingSchedule.uploadPreference, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "uploaded preference",
  }]),
});

export const UploadPreferenceResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/uploadPreference" }, { request }],
    [CookingSchedule.uploadPreference, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// addAvailability

export const AddAvailabilityRequest: Sync = (
  {
    request,
    session,
    user,
    date,
    actingUser,
  },
) => ({
  when: actions([Requesting.request, {
    path: "/addAvailability",
    session,
    user,
    date,
  }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = frames.filter(($) => $[actingUser] === $[user]);
    return frames;
  },
  then: actions([CookingSchedule.addAvailability, {
    user,
    date,
  }]),
});

export const AddAvailabilityResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/addAvailability" }, { request }],
    [CookingSchedule.addAvailability, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "added availability",
  }]),
});

export const AddAvailabilityResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/addAvailability" }, { request }],
    [CookingSchedule.addAvailability, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// removeAvailability

export const RemoveAvailabilityRequest: Sync = (
  {
    request,
    session,
    user,
    date,
    actingUser,
  },
) => ({
  when: actions([Requesting.request, {
    path: "/removeAvailability",
    session,
    user,
    date,
  }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = frames.filter(($) => $[actingUser] === $[user]);
    return frames;
  },
  then: actions([CookingSchedule.removeAvailability, {
    user,
    date,
  }]),
});

export const RemoveAvailabilityResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/removeAvailability" }, { request }],
    [CookingSchedule.removeAvailability, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "removed availability",
  }]),
});

export const RemoveAvailabilityResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/removeAvailability" }, { request }],
    [CookingSchedule.removeAvailability, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});
