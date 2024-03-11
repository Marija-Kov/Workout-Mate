async function mockUser(
  status,
  agent,
  user = {
    email: "a@b.c",
    password: "abcABC123!",
  }
) {
  const userPending = (await agent.post("/api/users/signup").send(user)).body;
  if (status === "pending") return userPending;

  const userConfirmed = (await agent.get(`/api/users/${userPending.token}`))
    .body;
  if (status === "confirmed") return userConfirmed;

  const resLoggedIn = await agent.post("/api/users/login").send(user);
  const userLoggedIn = { ...resLoggedIn.body, token: getToken(resLoggedIn) };
  if (status === "logged-in") return userLoggedIn;

  const userHasWorkouts = await addWorkouts(userLoggedIn, agent);
  if (status === "has-workouts") return userHasWorkouts;
}

async function addWorkouts(userLoggedIn, agent) {
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
        .set("Cookie", `token=${userLoggedIn.token}`)
    ).body;
    workouts.unshift(workout);
  }
  return { userLoggedIn, workouts };
}

async function maxOutWorkouts(user, agent) {
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
      .set("Cookie", `token=${user.token}`);
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
  maxOutWorkouts,
  ISO8601ToMilliseconds,
  getToken,
};
