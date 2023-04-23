import { setupServer } from "msw/node";
import { rest } from "msw";
import uuid from "react-uuid";

const handlers = [
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

  rest.all("/api/workouts/", (req, res, ctx) => {
    console.log(req)
    // const page = req.query.p || 0;
    // const search = req.query.search || null;
    // const sampleWorkouts = genSampleWorkouts(search, page);
    // const itemsPerPage = 3;
    return res(
      ctx.status(200),
      // ctx.json({
      //   allUserWorkoutsByQuery: sampleWorkouts,
      //   workoutsChunk: sampleWorkouts.slice(itemsPerPage),
      //   limit: itemsPerPage,
      //   noWorkoutsByQuery: false,
      // })
    );
  }),
];

function genSampleWorkouts(searchFor, page){
  const workoutTitles = ['bench press', 'pullups', 'pushups', 'burpees', 'squats', 'arm curls'];
  const workouts = [];
  for(let i = 0; i < workoutTitles.length; ++i){
    workouts.push({
      _id: uuid(),
      title: workoutTitles[i],
      reps: Math.floor(Math.random() * 99) + 1,
      load: Math.floor(Math.random() * 50),
      user_id: "userid"
    });
  }
  return workouts.filter(e => {
    const regExp = `^${searchFor}`;
    e.title.match(regExp);
    //take page number into account
  })
}

const server = setupServer(...handlers);

export { server, rest, genSampleWorkouts }

