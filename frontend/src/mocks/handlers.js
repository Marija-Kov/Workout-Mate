import { rest } from "msw";

export const handlers = [
  rest.post("/api/users/signup", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: "Account created and pending confirmation",
      })
    );
  }),

  rest.get("/api/users/*", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: "Account confirmed, you may log in",
      })
    );
  }),

  rest.post("/api/users/login", async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: "userid",
        email: "keech@mail.yu",
        username: undefined,
        profileImg: undefined,
        token: "authorizationToken",
        tokenExpires: Date.now() + 3600000,
      })
    );
  }),

  rest.patch("/api/workouts/*", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        title: "workout title",
        reps: "workout reps",
        load: "workout loads",
      })
    );
  }),

  rest.delete("/api/workouts", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: "all workouts deleted",
      })
    );
  }),

  rest.delete("/api/workouts/*", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: "mockWorkoutId",
      })
    );
  }),

  rest.post("/api/workouts", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        title: "workout title",
        reps: "workout reps",
        load: "workout loads",
      })
    );
  }),

  rest.get("/api/workouts/*", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        allUserWorkoutsByQuery: [{}, {}, {}, {}, {}, {}],
        workoutsChunk: [{}, {}, {}],
        limit: 3,
        noWorkoutsByQuery: false,
      })
    );
  }),

  rest.patch("/api/users/*", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: "Updated successfully",
      })
    );
  }),

  rest.delete("/api/users/*", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: "User deleted successfully",
      })
    );
  }),

  rest.post("/api/reset-password", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: "Reset link sent to inbox",
      })
    );
  }),

  rest.patch("/api/reset-password/*", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: "Password reset successfully",
      })
    );
  }),
];
