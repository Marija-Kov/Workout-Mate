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
