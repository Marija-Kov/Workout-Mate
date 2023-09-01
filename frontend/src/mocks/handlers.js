import { rest } from "msw";

export const handlers = [
  rest.post(
    `${process.env.REACT_APP_API}/api/users/signup`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          success: "Account created and pending confirmation. Please check your inbox.",
        })
      );
    }
  ),

  rest.get(`${process.env.REACT_APP_API}/api/users/*`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: "Account confirmed, you may log in",
      })
    );
  }),

  rest.post(
    `${process.env.REACT_APP_API}/api/users/login`,
    async (req, res, ctx) => {
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
    }
  ),

  rest.patch(`${process.env.REACT_APP_API}/api/workouts/*`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        title: "workout title",
        reps: "workout reps",
        load: "workout loads",
      })
    );
  }),

  rest.delete(`${process.env.REACT_APP_API}/api/workouts`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: "all workouts deleted",
      })
    );
  }),

  rest.delete(
    `${process.env.REACT_APP_API}/api/workouts/*`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: "mockWorkoutId",
        })
      );
    }
  ),

  rest.post(`${process.env.REACT_APP_API}/api/workouts`, (req, res, ctx) => {
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

  rest.get(`${process.env.REACT_APP_API}/api/workouts/*`, (req, res, ctx) => {
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

  rest.patch(`${process.env.REACT_APP_API}/api/users/*`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: "Profile updated",
      })
    );
  }),

  rest.delete(`${process.env.REACT_APP_API}/api/users/*`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: "User deleted successfully",
      })
    );
  }),

  rest.post(
    `${process.env.REACT_APP_API}/api/reset-password`,
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
    `${process.env.REACT_APP_API}/api/reset-password/*`,
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
