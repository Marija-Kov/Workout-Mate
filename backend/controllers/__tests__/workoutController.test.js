const request = require("supertest");
const app = require("../../server");
const { connect, clear, close } = require("../../database.config");

const agent = request.agent(app);

beforeAll(async () => await connect());
afterAll(async () => {
  await clear();
  await close();
});

describe("workoutController", () => {
    
    describe("POST /api/workouts/", () => {
   
        it("should respond with error if no authorization token was found", async () => {
         const user = await mockUser("chocula@thepark.yu", "confirmed");
         const workout = { title: "Situps", muscle_group: "ab", reps: 30, load: 0 };
         const res = (
           await agent
             .post("/api/workouts/")
             .send(workout)
             .set("Authorization", `Bearer ${user.token}`)
         )._body;
         expect(res.error).toBeTruthy();
         expect(res.error).toMatch(/not authorized/i);
        });

        it("should respond with error if the user is authorized, but at least one required property value is not provided", async () => {
          const user = await mockUser("poozh@ploppers.com", "logged-in");
          const workout = { title: "Pullups",  muscle_group: "forearm and grip", reps: undefined, load: 20 };
          const res = (
            await agent
              .post("/api/workouts/")
              .send(workout)
              .set("Authorization", `Bearer ${user.token}`)
          )._body;
          expect(res.error).toBeTruthy();
          expect(res.error).toMatch(/workout validation failed/i);
        });

        it("should delete oldest workout given that the amount of workouts exceeds the limit", async () => {
         const user = await mockUser("buster@mail.com", "logged-in");
         const samples = [{ title: "Oldest workout", muscle_group: "chest", reps: 20, load: 20 }, { title: "Second oldest workout", muscle_group: "chest", reps: 20, load: 20 }];
         const oldestWorkoutId = (
           await agent
             .post("/api/workouts/")
             .send(samples[0])
             .set("Authorization", `Bearer ${user.token}`)
         )._body._id;
         const secondOldestWorkoutId = (
           await agent
             .post("/api/workouts/")
             .send(samples[1])
             .set("Authorization", `Bearer ${user.token}`)
         )._body._id;
         await maxOutWorkouts(user);
         const canNotFindOldestWorkout = (
           await agent
             .delete(`/api/workouts/${oldestWorkoutId}`)
             .set("Authorization", `Bearer ${user.token}`)
         )._body.error;
         const canFind2ndOldestWorkout = (
           await agent
             .delete(`/api/workouts/${secondOldestWorkoutId}`)
             .set("Authorization", `Bearer ${user.token}`)
         )._body.workout;
         expect(canNotFindOldestWorkout).toBeTruthy();
         expect(canFind2ndOldestWorkout).toBeTruthy();
        });

        it("should respond with workout details and id given that the user is authorized and all required property values were provided", async () => {
            const user = await mockUser("buster@ploppers.com", "logged-in");
            const workout = { title: "Bench press", muscle_group:"chest", reps: 20, load: 20 }; 
            const res = (
              await agent
                .post("/api/workouts/")
                .send(workout)
                .set("Authorization", `Bearer ${user.token}`)
            )._body;
            expect(res).toHaveProperty("title", `${workout.title.toLowerCase()}`)
            expect(res).toHaveProperty("reps", workout.reps);
            expect(res).toHaveProperty("load", workout.load);
            expect(res).toHaveProperty("muscle_group", workout.muscle_group);
            expect(res._id).toBeTruthy();
        });

    });

    describe("GET /api/workouts/", () => {

        it("should respond with error if no authorization token was found", async () => {
          const user = await mockUser("ice@ploppers.com", "confirmed");
          const res = (
            await agent
              .get("/api/workouts/")
              .set("Authorization", `Bearer ${user.token}`)
          )._body;
          expect(res.error).toBeTruthy();
          expect(res.error).toMatch(/not authorized/i);
        });

        it("should respond with all workouts if no search query was specified", async () => {
            const user = await mockUser("cecee@thehouse.com", "has-workouts");
            const res = (
              await agent
                .get("/api/workouts/")
                .set("Authorization", `Bearer ${user.userLoggedIn.token}`)
            )._body;
            expect(res.allUserWorkoutsByQuery).toBeTruthy();
            expect(res.allUserWorkoutsByQuery.length).toBeTruthy();
            expect(res.allUserWorkoutsByQuery.length).toEqual(user.workouts.length);
        });

        it("should respond with workouts by search query provided that they exist", async () => {
          const user = await mockUser( "cecee@theyard.com", "has-workouts");
          const query = "pu";
          const res = (
            await agent
              .get(`/api/workouts/?search=${query}`)
              .set("Authorization", `Bearer ${user.userLoggedIn.token}`)
          )._body;
          expect(res.allUserWorkoutsByQuery).toBeTruthy();
          expect(res.allUserWorkoutsByQuery[0].title).toMatch(/^pu/i);
          expect(res.allUserWorkoutsByQuery.length).toBeTruthy();
          expect(res.allUserWorkoutsByQuery.length).toBeLessThan(user.workouts.length);
        });

        it("should respond with no workouts if the workouts by search query don't exist", async () => {
          const user = await mockUser("nebojs@thewindow.com", "has-workouts");
          const query = "qx";
          const res = (
            await agent
              .get(`/api/workouts/?search=${query}`)
              .set("Authorization", `Bearer ${user.userLoggedIn.token}`)
          )._body;
         expect(res.allUserWorkoutsByQuery.length).toEqual(0);
         expect(res.noWorkoutsByQuery).toMatch(/no workouts found/i);
        })

        it("should respond with workouts from a specified page query", async () => {
           const user = await mockUser("poozh@thehouse.com", "has-workouts");
           const query = 1;
           const res = (
             await agent
               .get(`/api/workouts/?p=${query}`)
               .set("Authorization", `Bearer ${user.userLoggedIn.token}`)
           )._body;
           const firstDateOnTheQueriedPage = res.workoutsChunk[0].createdAt;
           const lastDateOnTheFirstPage = res.allUserWorkoutsByQuery[2].createdAt;
           expect(
             ISO8601ToMilliseconds(firstDateOnTheQueriedPage)
           ).toBeLessThan(ISO8601ToMilliseconds(lastDateOnTheFirstPage));
        });

    })

    describe("PATCH /api/workouts/:id", () => {
        it("should respond with error if no authorization token was found", async () => {
            const user = await mockUser("keech@thecouch.com", "has-workouts");
            user.userLoggedIn.token = undefined;
            const updateWorkout = {
                id: user.workouts[1]._id,
                body: {
                    reps: 33
                }
            };
            const res = (
              await agent
                .patch(`/api/workouts/${updateWorkout.id}`)
                .send(updateWorkout.body)
                .set("Authorization", `Bearer ${user.userLoggedIn.token}`)
            )._body;
            expect(res.error).toBeTruthy();
            expect(res.error).toMatch(/not authorized/i);
        });

        it("should respond with error if there was an attempt to update with an invalid value(s)", async () => {
           const user = await mockUser("poozh@thedoor.com", "has-workouts"); 
           const updateWorkout = {
             id: user.workouts[1]._id,
             body: {
               reps: "",
             },
           };
           const res = (
             await agent
               .patch(`/api/workouts/${updateWorkout.id}`)
               .send(updateWorkout.body)
               .set("Authorization", `Bearer ${user.userLoggedIn.token}`)
           )._body;
           expect(res.error).toBeTruthy();
           expect(res.error).toMatch(/validation failed/i);
        });

        it("should respond with the updated version of the workout provided all the values are valid", async () => {
             const user = await mockUser("cecee@thedoor.com", "has-workouts");
             const updateWorkout = {
               id: user.workouts[1]._id,
               body: {
                 reps: 40,
               },
             };
             const res = (
               await agent
                 .patch(`/api/workouts/${updateWorkout.id}`)
                 .send(updateWorkout.body)
                 .set("Authorization", `Bearer ${user.userLoggedIn.token}`)
             )._body;
             expect(res.reps).toEqual(updateWorkout.body.reps);
             expect(res.updatedAt).not.toMatch(user.workouts[1].updatedAt);
        });

    });

    describe("DELETE /api/workouts/:id", () => {
      it("should respond with error if no authorization token was found", async () => {
        const user = await mockUser("keech@thepark.com", "has-workouts");
        user.userLoggedIn.token = undefined;
        const deleteWorkoutId = user.workouts[1]._id;
        const res = (
          await agent
            .delete(`/api/workouts/${deleteWorkoutId}`)
            .set("Authorization", `Bearer ${user.userLoggedIn.token}`)
        )._body;
        expect(res.error).toBeTruthy();
        expect(res.error).toMatch(/not authorized/i);
      });  

      it("should respond with error if the provided workout id is invalid", async () => {
        const user = await mockUser("chook@thepark.com", "has-workouts");
        const res = (
          await agent
            .delete(`/api/workouts/invalidWorkoutId`)
            .set("Authorization", `Bearer ${user.userLoggedIn.token}`)
        )._body;
        expect(res.error).toBeTruthy();
        expect(res.error).toMatch(/invalid workout id/i);
      });

      it("should respond with error if the workout with the provided id doesn't exist", async () => {
        const user = await mockUser("lebowski@thepark.com", "has-workouts");
        const deleteWorkoutId = user.workouts[1]._id;
          await agent
            .delete(`/api/workouts/${deleteWorkoutId}`)
            .set("Authorization", `Bearer ${user.userLoggedIn.token}`);
        const res = (
          await agent
            .delete(`/api/workouts/${deleteWorkoutId}`)
            .set("Authorization", `Bearer ${user.userLoggedIn.token}`)
        )._body;
        expect(res.error).toBeTruthy();
        expect(res.error).toMatch(/does not exist/i);
      });

      it("should respond with the deleted workout details and the number of remaining workouts", async () => {
       const user = await mockUser("poozh@thepark.com", "has-workouts");
       const totalWorkouts = user.workouts.length;
       const deleteWorkoutId = user.workouts[1]._id;
       const res = (
         await agent
           .delete(`/api/workouts/${deleteWorkoutId}`)
           .set("Authorization", `Bearer ${user.userLoggedIn.token}`)
       )._body;
       expect(res.workout._id).toMatch(deleteWorkoutId);
       expect(res.remaining).toEqual(totalWorkouts-1);
      });

      it("should respond with the number of deleted workouts which should be the total number of workouts", async () => {
        const user = await mockUser("poozh@thegate.com", "has-workouts");
        const res = (
         await agent
          .delete(`/api/workouts/`)
          .set("Authorization", `Bearer ${user.userLoggedIn.token}`)
        )._body;
        expect(res.deletedCount).toBeTruthy();
        expect(res.deletedCount).toEqual(user.workouts.length)
      })


    });

    describe("ANY /api/workouts/", () => {
      
       it("should respond with error if too many requests were sent in a short amount of time", async () => {
         const user = await mockUser("icey@ploppers.com", "logged-in");
         await maxOutRequests(user);
         const tooManyRequests = (
           await agent
             .get("/api/workouts/")
             .set("Authorization", `Bearer ${user.token}`)
         )._body.error;

        expect(tooManyRequests).toBeTruthy();
       });        
      
    });

});

async function mockUser(email, status) {
  const user = {
    email: email,
    password: "abcABC123!",
  };
  const userPending = (await agent.post("/api/users/signup").send(user))._body;
  if (status === "pending") return userPending;

  const userConfirmed = (await agent.get(`/api/users/${userPending.token}`))
    ._body;
  if (status === "confirmed") return userConfirmed;

  const userLoggedIn = (await agent.post("/api/users/login").send(user))._body;
  if (status === "logged-in") return userLoggedIn;

 const userHasWorkouts = await addWorkouts();
 if (status === "has-workouts") return userHasWorkouts;

  async function addWorkouts() {
     const sampleWorkouts = [
       { title: "Bench Press", muscle_group:"chest", reps: 20, load: 20 },
       { title: "Pushups", muscle_group:"chest", reps: 30, load: 0 },
       { title: "Situps", muscle_group:"ab", reps: 40, load: 0 },
       { title: "Squats", muscle_group:"leg", reps: 20, load: 23 },
       { title: "Pullups", muscle_group:"forearm and grip", reps: 15, load: 0 },
     ];
     const workouts = [];
     let len = sampleWorkouts.length;
     while (--len + 1) {
       let workout = (
         await agent
           .post("/api/workouts/")
           .send(sampleWorkouts[len])
           .set("Authorization", `Bearer ${userLoggedIn.token}`)
       )._body;
       workouts.unshift(workout);
     }
     return { userLoggedIn, workouts };
   }  
}

async function maxOutWorkouts(user) {
  const limit_minus = Number(process.env.TEST_MAX_WORKOUTS_PER_USER);
  const sampleWorkouts = [
    { title: "Bench Press", muscle_group: "chest", reps: 20, load: 20 },
    { title: "Pushups", muscle_group: "chest", reps: 30, load: 0 },
    { title: "Situps", muscle_group: "ab", reps: 40, load: 0 },
    { title: "Squats", muscle_group: "leg", reps: 20, load: 23 }
  ];
  for (let i = 0; i < limit_minus; ++i) {
    await agent
      .post("/api/workouts/")
      .send(sampleWorkouts[i])
      .set("Authorization", `Bearer ${user.token}`);
  }

}

async function maxOutRequests(user) {
  const max = Number(process.env.TEST_MAX_API_WORKOUTS_REQS);
  for (let i = 0; i < max; ++i) {
    await agent
      .get("/api/workouts/")
      .set("Authorization", `Bearer ${user.token}`);
  }
}

function ISO8601ToMilliseconds(ISO8601){
    let ms = Number(ISO8601.slice(20, 23));
    let s = Number(ISO8601.slice(17, 19));
    let min = Number(ISO8601.slice(14, 16));
    let h = Number(ISO8601.slice(11, 13));
    let d = Number(ISO8601.slice(8, 10));
    let m = Number(ISO8601.slice(5, 7));
    let y = Number(ISO8601.slice(0, 4));
    return ms + 1000 * (s + 60 * (min + 60 * (h + 24 * (d + 30 * (m + y * 12)))))
}


