import { rest } from "msw";
const url = process.env.REACT_APP_API || "http://localhost:6060";

export const handlers = [
  /* User routes */

  rest.post(
    `${url}/api/users/signup`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          success:
            "Account created and pending confirmation. Please check your inbox.",
        })
      );
    }
  ),

  rest.get(`${url}/api/users/confirmaccount/*`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: "Account confirmed, you may log in",
      })
    );
  }),

  rest.post(
    `${url}/api/users/login`,
    async (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          username: undefined,
          profileImg: undefined,
        })
      );
    }
  ),

  rest.patch(`${url}/api/users`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          username: "keech.rr_",
          profileImg: "profileImgString",
        },
        success: "Profile updated",
      })
    );
  }),

  rest.get(`${url}/api/users/download`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {},
        workouts: [],
      })
    );
  }),

  rest.delete(`${url}/api/users`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: "Account deleted successfully",
      })
    );
  }),

  rest.post(`${url}/api/users/logout`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        loggedOut: true,
      })
    );
  }),

  /* Workouts routes */

  rest.patch(`${url}/api/workouts/*`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        title: "workout title",
        reps: "workout reps",
        load: "workout loads",
      })
    );
  }),

  rest.delete(`${url}/api/workouts`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: "all workouts deleted",
      })
    );
  }),

  rest.delete(
    `${url}/api/workouts/*`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: "mockWorkoutId",
        })
      );
    }
  ),

  rest.post(`${url}/api/workouts`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        title: "workout title",
        muscle_group: "leg",
        reps: "workout reps",
        load: "workout loads",
      })
    );
  }),

  rest.get(`${url}/api/workouts/*`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        workoutsChunk: [{}, {}, {}],
        allUserWorkoutsMuscleGroups: ["leg", "ab", "back", "leg", "biceps"],
        total: 5,
        limit: 3,
        noWorkoutsByQuery: false,
      })
    );
  }),

  /* Password reset routes */

  rest.post(
    `${url}/api/reset-password`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          success: "Reset link sent to inbox",
        })
      );
    }
  ),

  rest.patch(
    `${url}/api/reset-password/*`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          success: "Password reset successfully",
        })
      );
    }
  ),
];
