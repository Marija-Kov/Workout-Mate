const request = require("supertest");
const app = require("../../server");
const { connect, clear, close } = require("../test-utils/mongo.config");
const { clearSqlite, closeSqlite } = require("../test-utils/sqlite.config");
const {
  mockUser,
  maxOutWorkouts,
  ISO8601ToMilliseconds,
} = require("../test-utils/testData");
const agent = request.agent(app);

beforeAll(async () => await connect());
afterEach(async () => {
  await clear();
  await clearSqlite();
});
afterAll(async () => {
  await close();
  await closeSqlite();
});

describe("workoutController", () => {
  describe("POST /api/workouts/", () => {
    it("should respond with error if no authorization token was found", async () => {
      const workout = {
        title: "Situps",
        muscle_group: "ab",
        reps: 30,
        load: 0,
      };
      const res = await agent.post("/api/workouts/").send(workout);
      expect(res.status).toBe(401);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/not authorized/i);
    });

    it("should respond with error if at least one input value is missing", async () => {
      const { token } = await mockUser("logged-in", agent);
      const workout = {
        title: undefined,
        muscle_group: "forearm and grip",
        reps: undefined,
        load: 20,
      };
      const res = await agent
        .post("/api/workouts/")
        .send(workout)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(422);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/please fill out the empty fields/i);
    });

    it("should respond with error if title input value is too long", async () => {
      const { token } = await mockUser("logged-in", agent);
      const workout = {
        title: "Pullupsssssssssssssssssssssssssssssssss",
        muscle_group: "forearm and grip",
        reps: 20,
        load: 20,
      };
      const res = await agent
        .post("/api/workouts/")
        .send(workout)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(422);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/too long title - max 30 characters/i);
    });

    it("should respond with error if title input value contains non-alphabetic characters", async () => {
      const { token } = await mockUser("logged-in", agent);
      const workout = {
        title: "<Pullups>",
        muscle_group: "forearm and grip",
        reps: 20,
        load: 20,
      };
      const res = await agent
        .post("/api/workouts/")
        .send(workout)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(422);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/title may contain only letters/i);
    });

    it("should respond with error if reps is not a number/numerical string", async () => {
      const { token } = await mockUser("logged-in", agent);
      const workout = {
        title: "Pullups",
        muscle_group: "forearm and grip",
        reps: "abc",
        load: 20,
      };
      const res = await agent
        .post("/api/workouts/")
        .send(workout)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(422);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/reps must be a number/i);
    });

    it("should respond with error if reps input value is too large", async () => {
      const { token } = await mockUser("logged-in", agent);
      const workout = {
        title: "Pullups",
        muscle_group: "forearm and grip",
        reps: 20000,
        load: 20,
      };
      const res = await agent
        .post("/api/workouts/")
        .send(workout)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(422);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/reps value too large/i);
    });

    it("should respond with error if load is not a number/numerical string", async () => {
      const { token } = await mockUser("logged-in", agent);
      const workout = {
        title: "Pullups",
        muscle_group: "forearm and grip",
        reps: 20,
        load: "abc",
      };
      const res = await agent
        .post("/api/workouts/")
        .send(workout)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(422);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/load must be a number/i);
    });

    it("should respond with error if load input value is too large", async () => {
      const { token } = await mockUser("logged-in", agent);
      const workout = {
        title: "Pullups",
        muscle_group: "forearm and grip",
        reps: 20,
        load: 20000,
      };
      const res = await agent
        .post("/api/workouts/")
        .send(workout)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(422);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/load value too large/i);
    });

    it("should delete oldest workout given that the amount of workouts exceeds the limit", async () => {
      const user = await mockUser("logged-in", agent);
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
          .set("Cookie", `token=${token}`)
      ).body._id;
      const secondOldestWorkoutId = (
        await agent
          .post("/api/workouts/")
          .send(samples[1])
          .set("Cookie", `token=${token}`)
      ).body._id;
      await maxOutWorkouts(user, agent);
      const resOldestWorkout = await agent
        .delete(`/api/workouts/${oldestWorkoutId}`)
        .set("Cookie", `token=${token}`);
      const res2ndOldestWorkout = await agent
        .delete(`/api/workouts/${secondOldestWorkoutId}`)
        .set("Cookie", `token=${token}`);
      expect(resOldestWorkout.status).toBe(404);
      expect(res2ndOldestWorkout.status).toBe(200);
      expect(resOldestWorkout.body).toHaveProperty(
        "error",
        `Workout id (${oldestWorkoutId}) does not exist`
      );
      expect(res2ndOldestWorkout.body.workout).toBeTruthy();
      expect(res2ndOldestWorkout.body.workout).toHaveProperty(
        "_id",
        `${secondOldestWorkoutId}`
      );
    });

    it("should respond with workout details and id given that the user is authorized and all required input values were provided", async () => {
      const { token } = await mockUser("logged-in", agent);
      const workout = {
        title: "Bench press",
        muscle_group: "chest",
        reps: 20,
        load: 20,
      };
      const res = await agent
        .post("/api/workouts/")
        .send(workout)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "title",
        `${workout.title.toLowerCase()}`
      );
      expect(res.body).toHaveProperty("reps", workout.reps);
      expect(res.body).toHaveProperty("load", workout.load);
      expect(res.body).toHaveProperty("muscle_group", workout.muscle_group);
      expect(res.body._id).toBeTruthy();
    });
  });

  describe("GET /api/workouts/", () => {
    it("should respond with error if no authorization token was found", async () => {
      const { token } = await mockUser("confirmed", agent);
      const res = await agent
        .get("/api/workouts/")
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(401);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/not authorized/i);
    });

    it("should respond with all workouts if no search query was specified", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts", agent);
      const { token } = userLoggedIn;
      const res = await agent
        .get("/api/workouts/")
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(200);
      expect(res.body.total).toEqual(workouts.length);
    });

    it("should respond with workouts by search query provided that they exist", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts", agent);
      const { token } = userLoggedIn;
      const query = "pu";
      const res = await agent
        .get(`/api/workouts/?search=${query}`)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(200);
      expect(res.body.workoutsChunk.length).toBeTruthy();
      expect(res.body.workoutsChunk[0].title).toMatch(/^pu/i);
      expect(res.body.total).toBeTruthy();
      expect(res.body.total).toBeLessThan(workouts.length);
    });

    it("should respond with no workouts if the workouts by search query don't exist", async () => {
      const { userLoggedIn } = await mockUser("has-workouts", agent);
      const { token } = userLoggedIn;
      const query = "qx";
      const res = await agent
        .get(`/api/workouts/?search=${query}`)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(200);
      expect(res.body.total).toEqual(0);
      expect(res.body.noWorkoutsByQuery).toMatch(/no workouts found/i);
    });

    it("should respond with workouts from a specified page query", async () => {
      const { userLoggedIn } = await mockUser("has-workouts", agent);
      const { token } = userLoggedIn;
      const query = 2;
      const res1 = await agent
        .get(`/api/workouts/`)
        .set("Cookie", `token=${token}`);
      const res2 = await agent
        .get(`/api/workouts/?p=${query}`)
        .set("Cookie", `token=${token}`);
      const firstDateOnTheQueriedPage = res2.body.workoutsChunk[0].createdAt;
      const lastDateOnTheFirstPage = res1.body.workoutsChunk[2].createdAt;
      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);
      expect(ISO8601ToMilliseconds(firstDateOnTheQueriedPage)).toBeLessThan(
        ISO8601ToMilliseconds(lastDateOnTheFirstPage)
      );
    });
  });

  describe("PATCH /api/workouts/:id", () => {
    it("should respond with error if no authorization token was found", async () => {
      const { workouts } = await mockUser("has-workouts", agent);
      const updateWorkout = {
        id: workouts[1]._id,
        body: {
          reps: 33,
        },
      };
      const res = await agent
        .patch(`/api/workouts/${updateWorkout.id}`)
        .send(updateWorkout.body);
      expect(res.status).toBe(401);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/not authorized/i);
    });

    it("should respond with error if there was an attempt to update with title value that is too long", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts", agent);
      const { token } = userLoggedIn;
      const updateWorkout = {
        id: workouts[1]._id,
        body: {
          title: "Pullupsssssssssssssssssssssssssssssssss",
        },
      };
      const res = await agent
        .patch(`/api/workouts/${updateWorkout.id}`)
        .send(updateWorkout.body)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(422);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/too long title - max 30 characters/i);
    });

    it("should respond with error if there was an attempt to update with title value that contains non-alphabetic characters", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts", agent);
      const { token } = userLoggedIn;
      const updateWorkout = {
        id: workouts[1]._id,
        body: {
          title: "<Pullups>",
        },
      };
      const res = await agent
        .patch(`/api/workouts/${updateWorkout.id}`)
        .send(updateWorkout.body)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(422);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/title may contain only letters/i);
    });

    it("should respond with error if there was an attempt to update with reps value that is not a number/numerical string", async () => {
      const { token } = await mockUser("logged-in", agent);
      const workout = {
        reps: "abc",
      };
      const res = await agent
        .post("/api/workouts/")
        .send(workout)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(422);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/reps must be a number/i);
    });

    it("should respond with error if there was an attempt to update with reps value that is too large", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts", agent);
      const { token } = userLoggedIn;
      const updateWorkout = {
        id: workouts[1]._id,
        body: {
          reps: 20000,
        },
      };
      const res = await agent
        .patch(`/api/workouts/${updateWorkout.id}`)
        .send(updateWorkout.body)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(422);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/reps value too large/i);
    });

    it("should respond with error if there was an attempt to update with load value that is not a number/numerical string", async () => {
      const { token } = await mockUser("logged-in", agent);
      const workout = {
        load: "abc",
      };
      const res = await agent
        .post("/api/workouts/")
        .send(workout)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(422);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/load must be a number/i);
    });

    it("should respond with error if there was an attempt to update with load value that is too large", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts", agent);
      const { token } = userLoggedIn;
      const updateWorkout = {
        id: workouts[1]._id,
        body: {
          load: 20000,
        },
      };
      const res = await agent
        .patch(`/api/workouts/${updateWorkout.id}`)
        .send(updateWorkout.body)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(422);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/load value too large/i);
    });

    it("should respond with error if there was an attempt to update with invalid muscle group value", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts", agent);
      const { token } = userLoggedIn;
      const updateWorkout = {
        id: workouts[1]._id,
        body: {
          muscle_group: "gallbladder",
        },
      };
      const res = await agent
        .patch(`/api/workouts/${updateWorkout.id}`)
        .send(updateWorkout.body)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(422);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/invalid muscle group value/i);
    });

    it("should respond with the updated version of the workout provided all the values are valid", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts", agent);
      const { token } = userLoggedIn;
      const updateWorkout = {
        id: workouts[1]._id,
        body: {
          reps: 40,
        },
      };
      const res = await agent
        .patch(`/api/workouts/${updateWorkout.id}`)
        .send(updateWorkout.body)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(200);
      expect(res.body.reps).toEqual(updateWorkout.body.reps);
      expect(res.body.updatedAt).not.toMatch(workouts[1].updatedAt);
    });
  });

  describe("DELETE /api/workouts/:id", () => {
    it("should respond with error if no authorization token was found", async () => {
      const { workouts } = await mockUser("has-workouts", agent);
      const deleteWorkoutId = workouts[1]._id;
      const res = await agent.delete(`/api/workouts/${deleteWorkoutId}`);
      expect(res.status).toBe(401);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/not authorized/i);
    });

    it("should respond with error if the provided workout id is invalid", async () => {
      const { userLoggedIn } = await mockUser("has-workouts", agent);
      const { token } = userLoggedIn;
      const res = await agent
        .delete(`/api/workouts/invalidWorkoutId`)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/invalid workout id/i);
    });

    it("should respond with error if the workout with the provided id doesn't exist", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts", agent);
      const { token } = userLoggedIn;
      const deleteWorkoutId = workouts[1]._id;
      await agent
        .delete(`/api/workouts/${deleteWorkoutId}`)
        .set("Cookie", `token=${token}`);
      const res = await agent
        .delete(`/api/workouts/${deleteWorkoutId}`)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/does not exist/i);
    });

    it("should respond with the deleted workout details and the number of remaining workouts", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts", agent);
      const { token } = userLoggedIn;
      const totalWorkouts = workouts.length;
      const deleteWorkoutId = workouts[1]._id;
      const res = await agent
        .delete(`/api/workouts/${deleteWorkoutId}`)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(200);
      expect(res.body.workout._id).toMatch(deleteWorkoutId);
      expect(res.body.remaining).toEqual(totalWorkouts - 1);
    });
  });

  describe("DELETE /api/workouts/", () => {
    it("should respond with error given that the user is not authorized", async () => {
      await mockUser("has-workouts", agent);
      const res = await agent.delete(`/api/workouts/`);
      expect(res.status).toBe(401);
      expect(res.body.deletedCount).toBeFalsy();
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/not authorized/i);
    });

    it("should delete all workouts given that the user is authorized", async () => {
      const { userLoggedIn, workouts } = await mockUser("has-workouts", agent);
      const { token } = userLoggedIn;
      const res = await agent
        .delete(`/api/workouts/`)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(200);
      expect(res.body.error).toBeFalsy();
      expect(res.body.deletedCount).toBeTruthy();
      expect(res.body.deletedCount).toEqual(workouts.length);
    });
  });

  describe("ANY /api/workouts/", () => {
    it("should respond with error if too many requests were sent in a short amount of time", async () => {
      const express = require("express");
      const app = express();
      app.use(require("cookie-parser")());
      app.use(express.json());
      app.use(require("../../middleware/rateLimiters").api_workouts);
      app.use("/api/workouts", require("../../routes/workouts"));
      app.use("/api/users", require("../../routes/users"));
      const agent = request.agent(app);
      const { token } = await mockUser("logged-in", agent);
      const maxReq = Number(process.env.MAX_API_WORKOUTS_REQS) || 20;
      let res;
      for (let i = 0; i <= maxReq + 1; ++i) {
        res = await agent.get("/api/workouts/").set("Cookie", `token=${token}`);
      }
      expect(res.status).toBe(429);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/too many requests/i);
    });
  });
});
