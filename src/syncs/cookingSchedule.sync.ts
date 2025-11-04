import {
  CookingSchedule,
  Requesting,
  Session,
  UserAuthentication,
} from "@concepts";
import { actions, Sync } from "@engine";

// FOODSTUD SPECIFIC CONTROLS

// addPeriod

export const AddPeriodRequest: Sync = (
  { request, session, period, current, actingUser, isFoodStud },
) => ({
  when: actions([Requesting.request, { path: "/addPeriod", period, current }, {
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
    { path: "/removePeriod", period },
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
  when: actions([Requesting.request, { path: "/openPeriod", period }, {
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
  when: actions([Requesting.request, { path: "/closePeriod", period }, {
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
  { request, session, user, actingUser, isUser, isFoodStud },
) => ({
  when: actions([Requesting.request, { path: "/addCook", user }, {
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
  then: actions([CookingSchedule.addCook, { user }]),
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
  { request, session, user, actingUser, isUser, isFoodStud },
) => ({
  when: actions([Requesting.request, { path: "/removeCook", user }, {
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
  then: actions([CookingSchedule.removeCook, { user }]),
});

export const RemoveCookResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/removeCook" }, { request }],
    [CookingSchedule.removeCook, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "added cook",
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
  when: actions([Requesting.request, { path: "/addCookingDate", date }, {
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
  when: actions([Requesting.request, { path: "/removeCookingDate", date }, {
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

// assignAssistant

// removeAssignment

// generateAssignments

// generateAssignmentsWithLLM

// USER SPECIFIC CONTROLS

// uploadPreference

// addAvailability

// removeAvailability
