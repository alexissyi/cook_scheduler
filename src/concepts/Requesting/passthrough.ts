/**
 * The Requesting concept exposes passthrough routes by default,
 * which allow POSTs to the route:
 *
 * /{REQUESTING_BASE_URL}/{Concept name}/{action or query}
 *
 * to passthrough directly to the concept action or query.
 * This is a convenient and natural way to expose concepts to
 * the world, but should only be done intentionally for public
 * actions and queries.
 *
 * This file allows you to explicitly set inclusions and exclusions
 * for passthrough routes:
 * - inclusions: those that you can justify their inclusion
 * - exclusions: those to exclude, using Requesting routes instead
 */

/**
 * INCLUSIONS
 *
 * Each inclusion must include a justification for why you think
 * the passthrough is appropriate (e.g. public query).
 *
 * inclusions = {"route": "justification"}
 */

export const inclusions: Record<string, string> = {
  // Feel free to delete these example inclusions

  "/api/CookingSchedule/_isRegisteredPeriod": "public query",
  "/api/CookingSchedule/_isCurrentPeriod": "public query",
  "/api/CookingSchedule/_isOpen": "public query",
  "/api/CookingSchedule/_getCooks": "public query",
  "/api/CookingSchedule/_isRegisteredCook": "public query",
  "/api/CookingSchedule/_getCookingDates": "public query",
  "/api/CookingSchedule/_getCurrentPeriod": "public query",
  "/api/CookingSchedule/_getAssignment": "public query",
  "/api/CookingSchedule/_getAssignments": "public query",
  "/api/CookingSchedule/_getUserAssignments": "public query",
  "/api/CookingSchedule/_getAvailability": "public query",
  "/api/CookingSchedule/_getPreference": "public query",
  "/api/CookingSchedule/_getCandidateCooks": "public query",
  "/api/CookingSchedule/_isAssigned": "public query",
  "/api/UserAuthentication/_getCostcoFoodStudKerb": "public query",
  "/api/UserAuthentication/_getProduceFoodStudKerb": "public query",
  "/api/UserAuthentication/_isLoggedIn": "public query",
  "/api/UserAuthentication/_isFoodStud": "public query",
  "/api/UserAuthentication/_isAdmin": "public query",
};

/**
 * EXCLUSIONS
 *
 * Excluded routes fall back to the Requesting concept, and will
 * instead trigger the normal Requesting.request action. As this
 * is the intended behavior, no justification is necessary.
 *
 * exclusions = ["route"]
 */

export const exclusions: Array<string> = [
  // Feel free to delete these example exclusions

  "/api/CookingSchedule/addCook",
  "/api/CookingSchedule/removeCook",
  "/api/CookingSchedule/addPeriod",
  "/api/CookingSchedule/removePeriod",
  "/api/CookingSchedule/setCurrentPeriod",
  "/api/CookingSchedule/addCookingDate",
  "/api/CookingSchedule/removeCookingDate",
  "/api/CookingSchedule/openPeriod",
  "/api/CookingSchedule/closePeriod",
  "/api/CookingSchedule/uploadPreference",
  "/api/CookingSchedule/addAvailability",
  "/api/CookingSchedule/removeAvailability",
  "/api/CookingSchedule/assignLead",
  "/api/CookingSchedule/assignAssistant",
  "/api/CookingSchedule/removeAssignment",
  "/api/CookingSchedule/deleteIncompatibleAssignments",
  "/api/CookingSchedule/generateAssignments",
  "/api/CookingSchedule/generateAssignmentsWithLLM",
  "/api/CookingSchedule/createPrompt",
  "/api/CookingSchedule/parseAndApplyAssignments",
  "/api/CookingSchedule/clearAssignments",
  "/api/UserAuthentication/initialize",
  "/api/UserAuthentication/uploadUser",
  "/api/UserAuthentication/removeUser",
  "/api/UserAuthentication/updateKerb",
  "/api/UserAuthentication/updatePassword",
  "/api/UserAuthentication/login",
  "/api/UserAuthentication/logout",
  "/api/UserAuthentication/setProduceFoodStud",
  "/api/UserAuthentication/setCostcoFoodStud",
  "/api/UserAuthentication/verifyFoodStud",
  "/api/UserAuthentication/_getUsers",
  "/api/UserAuthentication/_getUser",
  "/api/UserAuthentication/_getKerb",
];
