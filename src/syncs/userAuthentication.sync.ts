import {
  CookingSchedule,
  Requesting,
  Session,
  UserAuthentication,
} from "@concepts";
import { actions, Sync } from "@engine";

// user login and session creation
export const LoginRequest: Sync = (
  { request, kerb, password },
) => ({
  when: actions([
    Requesting.request,
    { path: "/login", kerb, password },
    { request },
  ]),
  then: actions(
    [UserAuthentication.login, {
      kerb,
      password,
    }],
  ),
});

export const LoginCreateSession: Sync = (
  { user },
) => (
  {
    when: actions([UserAuthentication.login, {}, {
      user,
    }]),
    then: actions([
      Session.create,
      { user },
    ]),
  }
);

export const LoginResponseSuccess: Sync = (
  { request, user, isAdmin, isProduceFoodStud, isCostcoFoodStud, session },
) => (
  {
    when: actions(
      [
        Requesting.request,
        { path: "/login" },
        { request },
      ],
      [UserAuthentication.login, {}, {
        user,
        isAdmin,
        isProduceFoodStud,
        isCostcoFoodStud,
      }],
      [Session.create, { user }, { session }],
    ),
    then: actions([
      Requesting.respond,
      {
        user,
        request,
        session,
        isAdmin,
        isProduceFoodStud,
        isCostcoFoodStud,
        status: "logged in",
      },
    ]),
  }
);

export const LoginResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/login" }, { request }],
    [UserAuthentication.login, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// user logout
export const LogoutRequest: Sync = ({ request, session, user }) => ({
  when: actions([Requesting.request, { path: "/logout", session }, {
    request,
  }]),
  where: async (frames) =>
    await frames.query(Session._getUser, { session }, { user }),
  then: actions([Session.delete, { session }]),
});

export const LogoutResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/logout" }, { request }],
    [Session.delete, {}, {}],
  ),
  then: actions([Requesting.respond, { request, status: "logged_out" }]),
});

export const LogoutResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/logout" }, { request }],
    [Session.delete, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// remove user

export const RemoveUserRequest: Sync = (
  { request, session, user, actingUser, isAdmin },
) => ({
  when: actions([Requesting.request, { path: "/removeUser", user }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = await frames.query(UserAuthentication._isAdmin, {
      user: actingUser,
    }, { isAdmin });
    frames = frames.filter(($) => $[isAdmin] === true);
    return frames;
  },
  then: actions([UserAuthentication.removeUser, { user }]),
});

export const RemoveUserRemoveCook: Sync = ({ user }) => ({
  when: actions([UserAuthentication.removeUser, { user }, {}]),
  then: actions([
    CookingSchedule.removeCook,
    { user, all: true },
  ]),
});

export const RemoveUserResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/removeUser" }, { request }],
    [UserAuthentication.removeUser, {}, {}],
  ),
  then: actions([Requesting.respond, { request, status: "removed" }]),
});

export const RemoveUserResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/removeUser" }, { request }],
    [UserAuthentication.removeUser, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// password update

export const UpdatePasswordRequest: Sync = (
  { request, session, user, actingUser, newPassword },
) => ({
  when: actions([Requesting.request, {
    path: "/updatePassword",
    user,
    newPassword,
    session,
  }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = frames.filter(($) => $[actingUser] === user);
    return frames;
  },
  then: actions([UserAuthentication.updatePassword, { user, newPassword }]),
});

export const UpdatePasswordResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/updatePassword" }, { request }],
    [UserAuthentication.updatePassword, {}, {}],
  ),
  then: actions([Requesting.respond, { request, status: "updated password" }]),
});

export const UpdatePasswordResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/updatePassword" }, { request }],
    [UserAuthentication.updatePassword, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// kerb update

export const UpdateKerbRequest: Sync = (
  { request, session, user, actingUser, newKerb },
) => ({
  when: actions([Requesting.request, {
    path: "/updateKerb",
    user,
    newKerb,
    session,
  }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = frames.filter(($) => $[actingUser] === user);
    return frames;
  },
  then: actions([UserAuthentication.updateKerb, { user, newKerb }]),
});

export const UpdateKerbResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/updateKerb" }, { request }],
    [UserAuthentication.updateKerb, {}, {}],
  ),
  then: actions([Requesting.respond, { request, status: "updated kerb" }]),
});

export const UpdateKerbResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/updateKerb" }, { request }],
    [UserAuthentication.updateKerb, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// set produce food stud

export const SetProduceFoodStudRequest: Sync = (
  { request, session, user, actingUser, isAdmin },
) => ({
  when: actions([Requesting.request, {
    path: "/setProduceFoodStud",
    session,
    user,
  }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = await frames.query(UserAuthentication._isAdmin, {
      user: actingUser,
    }, { isAdmin });
    frames = frames.filter(($) => $[isAdmin] === true);
    return frames;
  },
  then: actions([UserAuthentication.setProduceFoodStud, { user }]),
});

export const SetProduceFoodStudResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/setProduceFoodStud" }, { request }],
    [UserAuthentication.setProduceFoodStud, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "set produce foodstud",
  }]),
});

export const SetProduceFoodStudResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/setProduceFoodStud" }, { request }],
    [UserAuthentication.setProduceFoodStud, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// set costco food stud

export const SetCostcoFoodStudRequest: Sync = (
  { request, session, user, actingUser, isAdmin },
) => ({
  when: actions([Requesting.request, {
    path: "/setCostcoFoodStud",
    user,
    session,
  }, {
    request,
  }]),
  where: async (frames) => {
    frames = await frames.query(Session._getUser, { session }, {
      user: actingUser,
    });
    frames = await frames.query(UserAuthentication._isAdmin, {
      user: actingUser,
    }, { isAdmin });
    frames = frames.filter(($) => $[isAdmin] === true);
    return frames;
  },
  then: actions([UserAuthentication.setCostcoFoodStud, { user }]),
});

export const SetCostcoFoodStudResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/setCostcoFoodStud" }, { request }],
    [UserAuthentication.setCostcoFoodStud, {}, {}],
  ),
  then: actions([Requesting.respond, {
    request,
    status: "set costco foodstud",
  }]),
});

export const SetCostcoFoodStudResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/setCostcoFoodStud" }, { request }],
    [UserAuthentication.setCostcoFoodStud, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});
