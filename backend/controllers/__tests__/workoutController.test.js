const request = require("supertest");
const app = require("../../server");
const { connect, clear, close } = require("../../database.config");

const agent = request.agent(app);

beforeAll(async () => await connect());
afterEach(async () => await clear());
afterAll(async () => await close());

describe("workoutController", () => {
  describe("POST /api/workouts/", () => {
    it("should respond with error if no authorization token was found", async () => {
      const { token } = await mockUser("confirmed");
      const workout = {
        title: "Situps",
        muscle_group: "ab",
        reps: 30,
        load: 0,
      };
      const res = (
        await agent
          .post("/api/workouts/")
          .send(workout)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/not authorized/i);
    });

    it("should respond with error if at least one input value is not provided", async () => {
      const { token } = await mockUser("logged-in");
      const workout = {
        title: undefined,
        muscle_group: "forearm and grip",
        reps: undefined,
        load: 20,
      };
      const res = (
        await agent
          .post("/api/workouts/")
          .send(workout)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/please fill out the empty fields/i);
    });

    it("should respond with error if title input value is too long", async () => {
      const { token } = await mockUser("logged-in");
      const workout = {
        title: "Pullupsssssssssssssssssssssssssssssssss",
        muscle_group: "forearm and grip",
        reps: 20,
        load: 20,
      };
      const res = (
        await agent
          .post("/api/workouts/")
          .send(workout)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/too long title - max 30 characters/i);
    });

    it("should respond with error if title input value contains non-alphabetic characters", async () => {
      const { token } = await mockUser("logged-in");
      const workout = {
        title: "<Pullups>",
        muscle_group: "forearm and grip",
        reps: 20,
        load: 20,
      };
      const res = (
        await agent
          .post("/api/workouts/")
          .send(workout)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/title may contain only letters/i);
    });

    it("should respond with error if reps input value is too large", async () => {
      const { token } = await mockUser("logged-in");
      const workout = {
        title: "Pullups",
        muscle_group: "forearm and grip",
        reps: 20000,
        load: 20,
      };
      const res = (
        await agent
          .post("/api/workouts/")
          .send(workout)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/reps value too large/i);
    });

    it("should respond with error if load input value is too large", async () => {
      const { token } = await mockUser("logged-in");
      const workout = {
        title: "Pullups",
        muscle_group: "forearm and grip",
        reps: 20,
        load: 20000,
      };
      const res = (
        await agent
          .post("/api/workouts/")
          .send(workout)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/load value too large/i);
    });

    it("should delete oldest workout given that the amount of workouts exceeds the limit", async () => {
      const user = await mockUser("logged-in");
      const { token } = user;
      const samples = [
        { title: "Oldest workout", muscle_group: "chest", reps: 20, load: 20 },
        {
          title: "Second oldest workout",
          muscle_group: "chest",
          reps: 20,
          load: 20,
        },
      ];
      const oldestWorkoutId = (
        await agent
          .post("/api/workouts/")
          .send(samples[0])
          .set("Authorization", `Bearer ${token}`)
      ).body._id;
      const secondOldestWorkoutId = (
        await agent
          .post("/api/workouts/")
          .send(samples[1])
          .set("Authorization", `Bearer ${token}`)
      ).body._id;
      await maxOutWorkouts(user);
      const canNotFindOldestWorkout = (
        await agent
          .delete(`/api/workouts/${oldestWorkoutId}`)
          .set("Authorization", `Bearer ${token}`)
      ).body.error;
      const canFind2ndOldestWorkout = (
        await agent
          .delete(`/api/workouts/${secondOldestWorkoutId}`)
          .set("Authorization", `Bearer ${token}`)
      ).body.workout;
      expect(canNotFindOldestWorkout).toBeTruthy();
      expect(canFind2ndOldestWorkout).toBeTruthy();
    });

    it("should respond with workout details and id given that the user is authorized and all required input values were provided", async () => {
      const { token } = await mockUser("logged-in");
      const workout = {
        title: "Bench press",
        muscle_group: "chest",
        reps: 20,
        load: 20,
      };
      const res = (
        await agent
          .post("/api/workouts/")
          .send(workout)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res).toHaveProperty("title", `${workout.title.toLowerCase()}`);
      expect(res).toHaveProperty("reps", workout.reps);
      expect(res).toHaveProperty("load", workout.load);
      expect(res).toHaveProperty("muscle_group", workout.muscle_group);
      expect(res._id).toBeTruthy();
    });
  });

  describe("GET /api/workouts/", () => {
    it("should respond with error if no authorization token was found", async () => {
      const { token } = await mockUser("confirmed");
      const res = (
        await agent
          .get("/api/workouts/")
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/not authorized/i);
    });

    it("should respond with all workouts if no search query was specified", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts");
      const { token } = userLoggedIn;
      const res = (
        await agent
          .get("/api/workouts/")
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.total).toEqual(workouts.length);
    });

    it("should respond with workouts by search query provided that they exist", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts");
      const { token } = userLoggedIn;
      const query = "pu";
      const res = (
        await agent
          .get(`/api/workouts/?search=${query}`)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.workoutsChunk.length).toBeTruthy();
      expect(res.workoutsChunk[0].title).toMatch(/^pu/i);
      expect(res.total).toBeTruthy();
      expect(res.total).toBeLessThan(workouts.length);
    });

    it("should respond with no workouts if the workouts by search query don't exist", async () => {
      const { userLoggedIn } = await mockUser("has-workouts");
      const { token } = userLoggedIn;
      const query = "qx";
      const res = (
        await agent
          .get(`/api/workouts/?search=${query}`)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.total).toEqual(0);
      expect(res.noWorkoutsByQuery).toMatch(/no workouts found/i);
    });

    it("should respond with workouts from a specified page query", async () => {
      const { userLoggedIn } = await mockUser("has-workouts");
      const { token } = userLoggedIn;
      const query = 1;
      const res1 = (
        await agent
          .get(`/api/workouts/`)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      const res2 = (
        await agent
          .get(`/api/workouts/?p=${query}`)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      const firstDateOnTheQueriedPage = res2.workoutsChunk[0].createdAt;
      const lastDateOnTheFirstPage = res1.workoutsChunk[2].createdAt;
      expect(ISO8601ToMilliseconds(firstDateOnTheQueriedPage)).toBeLessThan(
        ISO8601ToMilliseconds(lastDateOnTheFirstPage)
      );
    });
  });

  describe("PATCH /api/workouts/:id", () => {
    it("should respond with error if no authorization token was found", async () => {
      const { workouts } = await mockUser("has-workouts");
      const updateWorkout = {
        id: workouts[1]._id,
        body: {
          reps: 33,
        },
      };
      const res = (
        await agent
          .patch(`/api/workouts/${updateWorkout.id}`)
          .send(updateWorkout.body)
          .set("Authorization", `Bearer ${undefined}`)
      ).body;
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/not authorized/i);
    });

    it("should respond with error if there was an attempt to update with title value that is too long", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts");
      const { token } = userLoggedIn;
      const updateWorkout = {
        id: workouts[1]._id,
        body: {
          title: "Pullupsssssssssssssssssssssssssssssssss",
        },
      };
      const res = (
        await agent
          .patch(`/api/workouts/${updateWorkout.id}`)
          .send(updateWorkout.body)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/too long title - max 30 characters/i);
    });

    it("should respond with error if there was an attempt to update with title value that contains non-alphabetic characters", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts");
      const { token } = userLoggedIn;
      const updateWorkout = {
        id: workouts[1]._id,
        body: {
          title: "<Pullups>",
        },
      };
      const res = (
        await agent
          .patch(`/api/workouts/${updateWorkout.id}`)
          .send(updateWorkout.body)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/title may contain only letters/i);
    });

    it("should respond with error if there was an attempt to update with reps value that is too large", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts");
      const { token } = userLoggedIn;
      const updateWorkout = {
        id: workouts[1]._id,
        body: {
          reps: 20000,
        },
      };
      const res = (
        await agent
          .patch(`/api/workouts/${updateWorkout.id}`)
          .send(updateWorkout.body)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/reps value too large/i);
    });

    it("should respond with error if there was an attempt to update with load value that is too large", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts");
      const { token } = userLoggedIn;
      const updateWorkout = {
        id: workouts[1]._id,
        body: {
          load: 20000,
        },
      };
      const res = (
        await agent
          .patch(`/api/workouts/${updateWorkout.id}`)
          .send(updateWorkout.body)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/load value too large/i);
    });

    it("should respond with the updated version of the workout provided all the values are valid", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts");
      const { token } = userLoggedIn;
      const updateWorkout = {
        id: workouts[1]._id,
        body: {
          reps: 40,
        },
      };
      const res = (
        await agent
          .patch(`/api/workouts/${updateWorkout.id}`)
          .send(updateWorkout.body)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.reps).toEqual(updateWorkout.body.reps);
      expect(res.updatedAt).not.toMatch(workouts[1].updatedAt);
    });
  });

  describe("DELETE /api/workouts/:id", () => {
    it("should respond with error if no authorization token was found", async () => {
      const { workouts } = await mockUser("has-workouts");
      const deleteWorkoutId = workouts[1]._id;
      const res = (
        await agent
          .delete(`/api/workouts/${deleteWorkoutId}`)
          .set("Authorization", `Bearer ${undefined}`)
      ).body;
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/not authorized/i);
    });

    it("should respond with error if the provided workout id is invalid", async () => {
      const { userLoggedIn } = await mockUser("has-workouts");
      const { token } = userLoggedIn;
      const res = (
        await agent
          .delete(`/api/workouts/invalidWorkoutId`)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/invalid workout id/i);
    });

    it("should respond with error if the workout with the provided id doesn't exist", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts");
      const { token } = userLoggedIn;
      const deleteWorkoutId = workouts[1]._id;
      await agent
        .delete(`/api/workouts/${deleteWorkoutId}`)
        .set("Authorization", `Bearer ${token}`);
      const res = (
        await agent
          .delete(`/api/workouts/${deleteWorkoutId}`)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/does not exist/i);
    });

    it("should respond with the deleted workout details and the number of remaining workouts", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts");
      const { token } = userLoggedIn;
      const totalWorkouts = workouts.length;
      const deleteWorkoutId = workouts[1]._id;
      const res = (
        await agent
          .delete(`/api/workouts/${deleteWorkoutId}`)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.workout._id).toMatch(deleteWorkoutId);
      expect(res.remaining).toEqual(totalWorkouts - 1);
    });
  });

  describe("DELETE /api/workouts/", () => {
    it("should respond with error given that the user is not authorized", async () => {
      await mockUser("has-workouts");
      const res = (await agent.delete(`/api/workouts/`)).body;
      expect(res.deletedCount).toBeFalsy();
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/not authorized/i);
    });

    it("should delete all workouts given that the user is authorized", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts");
      const { token } = userLoggedIn;
      const res = (
        await agent
          .delete(`/api/workouts/`)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.error).toBeFalsy();
      expect(res.deletedCount).toBeTruthy();
      expect(res.deletedCount).toEqual(workouts.length);
    });
  });

  describe("ANY /api/workouts/", () => {
    it("should respond with error if too many requests were sent in a short amount of time", async () => {
      const { token } = await mockUser("logged-in");
      const maxReq = Number(process.env.TEST_MAX_API_WORKOUTS_REQS);
      let res;
      for (let i = 0; i <= maxReq + 1; ++i) {
        res = await agent
          .get("/api/workouts/")
          .set("Authorization", `Bearer ${token}`);
      }
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/too many requests/i);
    });
  });
});

async function mockUser(status) {
  const user = {
    email: "a@b.c",
    password: "abcABC123!",
  };
  const userPending = (await agent.post("/api/users/signup").send(user)).body;
  if (status === "pending") return userPending;

  const userConfirmed = (await agent.get(`/api/users/${userPending.token}`))
    .body;
  if (status === "confirmed") return userConfirmed;

  const userLoggedIn = (await agent.post("/api/users/login").send(user)).body;
  if (status === "logged-in") return userLoggedIn;

  const userHasWorkouts = await addWorkouts();
  if (status === "has-workouts") return userHasWorkouts;

  async function addWorkouts() {
    const sampleWorkouts = [
      { title: "Bench Press", muscle_group: "chest", reps: 20, load: 20 },
      { title: "Pushups", muscle_group: "chest", reps: 30, load: 0 },
      { title: "Situps", muscle_group: "ab", reps: 40, load: 0 },
      { title: "Squats", muscle_group: "leg", reps: 20, load: 23 },
      { title: "Pullups", muscle_group: "forearm and grip", reps: 15, load: 0 },
    ];
    const workouts = [];
    for (let i = 0; i < sampleWorkouts.length; ++i) {
      let workout = (
        await agent
          .post("/api/workouts/")
          .send(sampleWorkouts[i])
          .set("Authorization", `Bearer ${userLoggedIn.token}`)
      ).body;
      workouts.unshift(workout);
    }
    return { userLoggedIn, workouts };
  }
}

async function maxOutWorkouts(user) {
  /*
    limit = process.env.TEST_MAX_WORKOUTS_PER_USER;
    sampleWorkouts.length must be limit - 1
    if the condition for deletion of the oldest entry is number of workouts being 
    EQUAL TO limit and given that the test is asserting the existence of each of
    the two previously posted workouts where more recent one is supposed to exist
    and the less recent one not to exist.
  */
  const sampleWorkouts = [
    { title: "Bench Press", muscle_group: "chest", reps: 20, load: 20 },
    { title: "Pushups", muscle_group: "chest", reps: 30, load: 0 },
    { title: "Situps", muscle_group: "ab", reps: 40, load: 0 },
    { title: "Squats", muscle_group: "leg", reps: 20, load: 23 },
  ];
  for (let i = 0; i < sampleWorkouts.length; ++i) {
    await agent
      .post("/api/workouts/")
      .send(sampleWorkouts[i])
      .set("Authorization", `Bearer ${user.token}`);
  }
}

function ISO8601ToMilliseconds(ISO8601) {
  let ms = Number(ISO8601.slice(20, 23));
  let s = Number(ISO8601.slice(17, 19));
  let min = Number(ISO8601.slice(14, 16));
  let h = Number(ISO8601.slice(11, 13));
  let d = Number(ISO8601.slice(8, 10));
  let m = Number(ISO8601.slice(5, 7));
  let y = Number(ISO8601.slice(0, 4));
  return ms + 1000 * (s + 60 * (min + 60 * (h + 24 * (d + 30 * (m + y * 12)))));
}
