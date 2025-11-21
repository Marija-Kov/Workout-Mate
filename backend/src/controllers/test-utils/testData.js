/**
 * Provides mock users at different phases of the user lifecycle.
 */
async function mockUser(
  status,
  agent,
  credentials = {
    email: "a@b.c",
    password: "abcABC123!",
  }
) {
  const userPending = (await agent.post("/api/users/signup").send(credentials))
    .body;
  if (status === "pending") return userPending;

  const userConfirmed = await mockConfirm(agent, userPending.token);
  if (status === "confirmed") return userConfirmed;

  const userLoggedIn = await mockLogin(agent, credentials);
  if (status === "logged-in") return userLoggedIn;

  const userHasWorkouts = await mockHasWorkouts(agent, userLoggedIn.token);
  if (status === "has-workouts") return userHasWorkouts;
}

async function mockConfirm(agent, token) {
  return (await agent.get(`/api/users/confirmaccount/${token}`)).body;
}

async function mockLogin(agent, credentials) {
  if (
    !credentials ||
    (credentials && !credentials.email) ||
    (credentials && !credentials.password)
  ) {
    console.error("testData.js > mockLogin: missing credentials");
    return;
  }
  const response = await agent.post("/api/users/login").send(credentials);
  return { status: response.status, token: getToken(response) };
}

async function mockHasWorkouts(agent, token) {
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
        .set("Cookie", `token=${token}`)
    ).body;
    workouts.unshift(workout);
  }
  return { workouts };
}

async function maxOutWorkouts(agent, token) {
  /*
   Since we need to max the workouts out to test whether the oldest workout 
   will be deleted, we want the setup where the number of workouts is just below
   the maximum workouts per user limit.
  */
  const limit = Number(process.env.MAX_WORKOUTS_PER_USER) || 5;
  const sampleWorkout = {
    title: "Bench Press",
    muscle_group: "chest",
    reps: 20,
    load: 20,
  };
  for (let i = 0; i < limit - 1; ++i) {
    await agent
      .post("/api/workouts/")
      .send(sampleWorkout)
      .set("Cookie", `token=${token}`);
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

function getToken(res) {
  const cookies = res.headers["set-cookie"];
  const tokenCookie = cookies.filter((e) => e.match(/token=/i))[0];
  const token = tokenCookie.split("; ")[0].split("=")[1];
  return token;
}

module.exports = {
  mockUser,
  mockLogin,
  mockConfirm,
  mockHasWorkouts,
  maxOutWorkouts,
  ISO8601ToMilliseconds,
  getToken,
};
