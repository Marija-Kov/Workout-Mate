import { http, HttpResponse } from "msw";
const url = import.meta.env.VITE_API || "http://localhost:6060";

export const handlers = [
  /* User routes */

  http.post(`${url}/api/users/signup`, () => {
    return HttpResponse.json(
      {
        success:
          "Account created and pending confirmation. Please check your inbox.",
      },
      { status: 200 }
    );
  }),

  http.get(`${url}/api/users/confirmaccount/*`, () => {
    return HttpResponse.json(
      {
        success: "Account confirmed, you may log in",
      },
      { status: 200 }
    );
  }),

  http.post(`${url}/api/users/login`, async () => {
    return HttpResponse.json(
      {
        username: undefined,
        profileImg: undefined,
      },
      { status: 200 }
    );
  }),

  http.patch(`${url}/api/users`, () => {
    return HttpResponse.json(
      {
        user: {
          profileImg: "newMockProfileImage",
        },
        success: "Profile updated",
      },
      { status: 200 }
    );
  }),

  http.get(`${url}/api/users/download`, () => {
    return HttpResponse.json(
      {
        user: {},
        workouts: [],
      },
      { status: 200 }
    );
  }),

  http.delete(`${url}/api/users`, () => {
    return HttpResponse.json(
      {
        success: "Account deleted successfully",
      },
      { status: 200 }
    );
  }),

  http.post(`${url}/api/users/logout`, () => {
    return HttpResponse.json(
      {
        loggedOut: true,
      },
      { status: 200 }
    );
  }),

  /* Workouts routes */

  http.patch(`${url}/api/workouts/*`, () => {
    return HttpResponse.json({
      title: "squats",
      reps: 30,
      load: 22,
    });
  }),

  http.delete(`${url}/api/workouts`, () => {
    return HttpResponse.json(
      {
        success: "all workouts deleted",
      },
      { status: 200 }
    );
  }),

  http.delete(`${url}/api/workouts/*`, () => {
    return HttpResponse.json(
      {
        workout: {
          _id: "w7", // in every test, this must be an id from the chunk
          // the data below is irrelevant for the outcome of the tests as they are
          title: "lunges",
          muscle_group: "leg",
          reps: 84,
          load: 42,
          user_id: "userid",
        },
      },
      { status: 200 }
    );
  }),

  http.post(`${url}/api/workouts`, () => {
    return HttpResponse.json(
      {
        title: "squats",
        muscle_group: "leg",
        reps: 20,
        load: 15,
      },
      { status: 200 }
    );
  }),

  http.get(`${url}/api/workouts/*`, () => {
    // TODO: all mock items used in one test should come from one source
    return HttpResponse.json(
      {
        chunk: [
          {
            id: "mockId1",
            title: "lunges",
            muscle_group: "leg",
            reps: "44",
            load: "21",
            user_id: "userid",
            createdAt: "2023-04-10T13:01:15.208+00:00",
          },
          {
            id: "mockId2",
            title: "pushups",
            muscle_group: "chest",
            reps: "44",
            load: "21",
            user_id: "userid",
            createdAt: "2023-04-10T13:01:15.208+00:00",
          },
        ],
        allMuscleGroups: ["leg", "chest"],
        foundCount: 2,
        limit: 3,
        noneFound: false,
      },
      { status: 200 }
    );
  }),

  /* Password reset routes */

  http.post(`${url}/api/reset-password`, () => {
    return HttpResponse.json(
      {
        success: "Reset link sent to inbox",
      },
      { status: 200 }
    );
  }),

  http.patch(`${url}/api/reset-password/*`, () => {
    return HttpResponse.json(
      {
        success: "Password reset successfully",
      },
      { status: 200 }
    );
  }),
];
