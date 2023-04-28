import { rest } from "msw";
import { genSampleWorkouts } from "../utils/test/genSampleWorkouts";

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
    const { email } = await req.json();
    return res(
      ctx.status(200),
      ctx.json({
        id: "userid",
        email: email,
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

    const page = req.query.p || 0;
    const search = req.query.search || null;
    const itemsPerPage = 3;
    const { allUserWorkoutsByQuery, workoutsChunk, noWorkoutsByQuery } =
      genSampleWorkouts(search, page, itemsPerPage);
    return res(
      ctx.status(200),
      ctx.json({
        allUserWorkoutsByQuery: allUserWorkoutsByQuery,
        workoutsChunk: workoutsChunk,
        limit: itemsPerPage,
        noWorkoutsByQuery: noWorkoutsByQuery,
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
];
