const request = require("supertest");
const app = require("../../server");
const db = require("../../database.config");

const agent = request.agent(app);

beforeAll(async () => await db.connect());
afterAll(async () => {
  await db.clear();
  await db.close();
});

describe("workoutController", () => {
    
    describe("POST /api/workouts/", () => {
   
        it("should send error if no authorization token was found", async () => {
         const workout = { title: "Situps", reps: 30, load: 0 };
         const res = (
           await agent
             .post("/api/workouts/")
             .send(workout)
         )._body;
         expect(res.error).toBeTruthy();
         expect(res.error).toMatch(/authorization token required/i);
        });

        it("should send failure message if the user is authorized, but at least one required property value is not provided", async () => {
            const user = await mockUser("poozh@ploppers.com", "abcABC123!");
            const workout = {title:"Pullups", reps: undefined, load: 20};
            const res = (await agent
              .post("/api/workouts/")
              .send(workout)
              .set("Authorization", `Bearer ${user.token}`))._body;
            expect(res.error).toBeTruthy();
            expect(res.error).toMatch(/workout validation failed/i)
        });

        it("should return workout details and id given that the user is authorized and all required property values were provided", async () => {
            const user = await mockUser("buster@ploppers.com", "abcABC123!");
            const workout = { title: "Bench press", reps: 20, load: 20 }; 
            const res = (
              await agent
                .post("/api/workouts/")
                .send(workout)
                .set("Authorization", `Bearer ${user.token}`)
            )._body;
            expect(res).toHaveProperty("title", `${workout.title.toLowerCase()}`)
            expect(res).toHaveProperty("reps", workout.reps);
            expect(res).toHaveProperty("load", workout.load);
            expect(res._id).toBeTruthy();
        });

    });

    describe("GET /api/workouts/", () => {

        it("should send error if no authorization token was found", async () => {
          const res = (await agent.get("/api/workouts/"))._body;
          expect(res.error).toBeTruthy();
          expect(res.error).toMatch(/authorization token required/i);
        });

        it("should get all workouts if no search query was specified", async () => {
            const user = await mockUserWithWorkouts("cecee@thehouse.com", "abcABC123!");
            const res = (
              await agent
                .get("/api/workouts/")
                .set("Authorization", `Bearer ${user.user.token}`)
            )._body;
            expect(res.allUserWorkoutsByQuery).toBeTruthy();
            expect(res.allUserWorkoutsByQuery.length).toBeTruthy();
            expect(res.allUserWorkoutsByQuery.length).toEqual(user.workouts.length);
        });

        it("should get workouts by search query provided that they exist", async () => {
          const user = await mockUserWithWorkouts(
            "cecee@theyard.com",
            "abcABC123!"
          );
          const query = "pu";
          const res = (
            await agent
              .get(`/api/workouts/?search=${query}`)
              .set("Authorization", `Bearer ${user.user.token}`)
          )._body;
          expect(res.allUserWorkoutsByQuery).toBeTruthy();
          expect(res.allUserWorkoutsByQuery[0].title).toMatch(/^pu/i);
          expect(res.allUserWorkoutsByQuery.length).toBeTruthy();
          expect(res.allUserWorkoutsByQuery.length).toBeLessThan(user.workouts.length);
        });

        it("should return no workouts if the workouts by search query don't exist", async () => {
          const user = await mockUserWithWorkouts(
            "nebojs@thewindow.com",
            "abcABC123!"
          );
          const query = "qx";
          const res = (
            await agent
              .get(`/api/workouts/?search=${query}`)
              .set("Authorization", `Bearer ${user.user.token}`)
          )._body;
         expect(res.allUserWorkoutsByQuery.length).toEqual(0);
         expect(res.noWorkoutsByQuery).toMatch(/no workouts found/i);
        })

        it("should get workouts from a specified page query", async () => {
           const user = await mockUserWithWorkouts(
             "poozh@thehouse.com",
             "abcABC123!"
           );
           const query = 1;
           const res = (
             await agent
               .get(`/api/workouts/?p=${query}`)
               .set("Authorization", `Bearer ${user.user.token}`)
           )._body;
           const firstDateOnTheQueriedPage = res.workoutsChunk[0].createdAt;
           const lastDateOnTheFirstPage = res.allUserWorkoutsByQuery[2].createdAt;
           expect(
             ISO8601ToMilliseconds(firstDateOnTheQueriedPage)
           ).toBeLessThan(ISO8601ToMilliseconds(lastDateOnTheFirstPage));
        });
    })

});

async function mockUser(email, password, authenticated=true){
 const newUserPending = (
   await agent
     .post("/api/users/signup")
     .send({ email: email, password: password })
  )._body;
  await agent.get(`/api/users/${newUserPending.token}`);
  const res = (await agent.post("/api/users/login").send({email: email, password: password}))._body;
  return res
}

async function mockUserWithWorkouts(email, password) {
    const sampleWorkouts = [
        {title:"Bench Press", reps: 20, load: 20},
        {title:"Pushups", reps: 30, load: 0},
        {title:"Situps", reps: 40, load: 0},
        {title:"Squats", reps: 20, load: 23},
        {title:"Pullups", reps: 15, load: 0},
    ]
    const newUserPending = (
    await agent
      .post("/api/users/signup")
      .send({ email: email, password: password })
  )._body;
  await agent.get(`/api/users/${newUserPending.token}`);
  const user = (
    await agent
      .post("/api/users/login")
      .send({ email: email, password: password })
  )._body;
  const workouts = [];
  let len = sampleWorkouts.length;
  while(--len+1){
    let workout = (
      await agent
        .post("/api/workouts/")
        .send(sampleWorkouts[len])
        .set("Authorization", `Bearer ${user.token}`)
    )._body;
    workouts.unshift(workout);
  }
  return {user, workouts};
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


