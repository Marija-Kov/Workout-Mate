const request = require("supertest");
const app = require("../../server");
const { connect, clear, close } = require("../test-utils/mongo.config");
const { clearSqlite, closeSqlite } = require("../test-utils/sqlite.config");
const {
  mockUser,
  mockLogin,
  maxOutWorkouts,
  ISO8601ToMilliseconds,
  mockHasWorkouts,
} = require("../test-utils/testData");
const agent = request.agent(app);

describe("workoutController", () => {
  let token = null;
  let workouts = null;
  const mockConfirmed = {
    email: "confirmed@email.com",
    password: "abcABC123!",
  };

  beforeAll(async () => {
    await connect();
    await mockUser("confirmed", agent, mockConfirmed);
    token = (await mockLogin(agent, mockConfirmed)).token;
    workouts = (await mockHasWorkouts(agent, token)).workouts;
  });

  afterAll(async () => {
    await clear();
    await close();
    await clearSqlite();
    await closeSqlite();
  });

  describe("POST /api/workouts/", () => {
    it("should respond with error if no authorization token was found", async () => {
      const workout = {
        title: "Situps",
        muscle_group: "ab",
        reps: 30,
        load: 0,
      };
      const res = await agent
        .post("/api/workouts/")
        .send(workout)
        .set("Cookie", `token=${null}`);
      expect(res.status).toBe(401);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/not authorized/i);
    });

    it("should respond with error if at least one input value is missing", async () => {
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

    it("should respond with error if muscle group input value is invalid", async () => {
      const workout = {
        title: "Pullups",
        muscle_group: "keech",
        reps: 20,
        load: 20,
      };
      const res = await agent
        .post("/api/workouts/")
        .send(workout)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(422);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/invalid muscle group value/i);
    });

    it("should respond with error if reps is not a number/numerical string", async () => {
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
      await maxOutWorkouts(agent, token);
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
        `Could not find workout id: ${oldestWorkoutId}`
      );
      expect(res2ndOldestWorkout.body.workout).toBeTruthy();
      expect(res2ndOldestWorkout.body.workout).toHaveProperty(
        "_id",
        `${secondOldestWorkoutId}`
      );
      // restore workouts to initial state
      await clear();
      workouts = (await mockHasWorkouts(agent, token)).workouts;
    });

    it("should respond with workout details and id given that the user is authorized and all required input values were provided", async () => {
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
      // restore workouts to initial state
      await clear();
      workouts = (await mockHasWorkouts(agent, token)).workouts;
    });
  });

  describe("GET /api/workouts/", () => {
    it("should respond with error if no authorization token was found", async () => {
      const res = await agent
        .get("/api/workouts/")
        .set("Cookie", `token=${null}`);
      expect(res.status).toBe(401);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/not authorized/i);
    });

    it("should respond with all workouts if no search query was specified", async () => {
      const res = await agent
        .get("/api/workouts/")
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(200);
      expect(res.body.foundCount).toEqual(workouts.length);
    });

    it("should respond with workouts by search query provided that they exist", async () => {
      const query = "pu";
      const res = await agent
        .get(`/api/workouts/?search=${query}`)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(200);
      expect(res.body.chunk.length).toBeTruthy();
      expect(res.body.chunk[0].title).toMatch(/^pu/i);
      expect(res.body.foundCount).toBeTruthy();
      expect(res.body.foundCount).toBeLessThan(workouts.length);
    });

    it("should respond with no workouts if the workouts by search query don't exist", async () => {
      const query = "qx";
      const res = await agent
        .get(`/api/workouts/?search=${query}`)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(200);
      expect(res.body.foundCount).toEqual(0);
      expect(res.body.noneFound).toMatch(/no workouts found/i);
    });

    it("should respond with workouts from a specified page query", async () => {
      const query = 2;
      const res1 = await agent
        .get("/api/workouts/")
        .set("Cookie", `token=${token}`);
      const res2 = await agent
        .get(`/api/workouts/?p=${query}`)
        .set("Cookie", `token=${token}`);
      const firstDateOnTheQueriedPage = res2.body.chunk[0].createdAt;
      const lastDateOnTheFirstPage = res1.body.chunk[2].createdAt;
      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);
      expect(ISO8601ToMilliseconds(firstDateOnTheQueriedPage)).toBeLessThan(
        ISO8601ToMilliseconds(lastDateOnTheFirstPage)
      );
    });
  });

  describe("PATCH /api/workouts/:id", () => {
    it("should respond with error if no authorization token was found", async () => {
      const updateWorkout = {
        id: workouts[1]._id,
        body: {
          reps: 33,
        },
      };
      const res = await agent
        .patch(`/api/workouts/${updateWorkout.id}`)
        .send(updateWorkout.body)
        .set("Cookie", `token=${null}`);
      expect(res.status).toBe(401);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/not authorized/i);
    });

    it("should respond with error if there was an attempt to update with title value that is too long", async () => {
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
      const updateWorkout = {
        id: workouts[1]._id,
        body: {
          reps: "abc",
        },
      };
      const res = await agent
        .patch(`/api/workouts/${updateWorkout.id}`)
        .send(updateWorkout.body)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(422);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/reps must be a number/i);
    });

    it("should respond with error if there was an attempt to update with reps value that is too large", async () => {
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
      const updateWorkout = {
        id: workouts[1]._id,
        body: {
          load: "abc",
        },
      };
      const res = await agent
        .patch(`/api/workouts/${updateWorkout.id}`)
        .send(updateWorkout.body)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(422);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/load must be a number/i);
    });

    it("should respond with error if there was an attempt to update with load value that is too large", async () => {
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
      const deleteWorkoutId = workouts[1]._id;
      const res = await agent
        .delete(`/api/workouts/${deleteWorkoutId}`)
        .set("Cookie", `token=${null}`);
      expect(res.status).toBe(401);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/not authorized/i);
    });

    it("should respond with error if the provided workout id is invalid", async () => {
      const res = await agent
        .delete("/api/workouts/invalidWorkoutId")
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/could not find workout id/i);
    });

    it("should respond with the deleted workout details and the number of remaining workouts", async () => {
      const foundCountWorkouts = workouts.length;
      const deleteWorkoutId = workouts[1]._id;
      const res = await agent
        .delete(`/api/workouts/${deleteWorkoutId}`)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(200);
      expect(res.body.workout._id).toMatch(deleteWorkoutId);
      expect(res.body.remaining).toEqual(foundCountWorkouts - 1);
      // restore workouts to initial state
      await clear();
      workouts = (await mockHasWorkouts(agent, token)).workouts;
    });
  });

  describe("DELETE /api/workouts/", () => {
    it("should respond with error given that the user is not authorized", async () => {
      const res = await agent
        .delete("/api/workouts/")
        .set("Cookie", `token=${null}`);
      expect(res.status).toBe(401);
      expect(res.body.deletedCount).toBeFalsy();
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/not authorized/i);
    });

    it("should delete all workouts given that the user is authorized", async () => {
      const res = await agent
        .delete("/api/workouts/")
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
