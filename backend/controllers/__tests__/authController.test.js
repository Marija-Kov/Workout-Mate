const request = require("supertest");
const app = require("../../server");
const { connect, clear, close } = require("../test-utils/database.config");
const agent = request.agent(app);
const { mockUser } = require("../test-utils/testData");

beforeAll(async () => await connect());
afterEach(async () => await clear());
afterAll(async () => await close());

describe("authController", () => {
  describe("POST /api/users/signup", () => {
    it("should respond with error on attempt to sign up with an invalid email", async () => {
      const user = { email: "invalidemail", password: "abcABC123!" };
      const res = await agent.post("/api/users/signup").send(user);
      expect(res.body.id).toBeFalsy();
      expect(res.body).toHaveProperty(
        "error",
        "Please enter valid email address"
      );
    });

    it("should respond with error on attempt to sign up with a weak password", async () => {
      const user = { email: "keech@validemail.com", password: "abc" };
      const res = await agent.post("/api/users/signup").send(user);
      expect(res.body.id).toBeFalsy();
      expect(res.body).toHaveProperty("error", "Password not strong enough");
    });

    it("should respond with error on attempt to sign up with an email that already exists in the database", async () => {
      const user = { email: "a@b.c", password: "abcABC123!" };
      await mockUser("confirmed", agent);
      const res = (await agent.post("/api/users/signup").send(user)).body;
      expect(res.error).toBeTruthy();
    });

    it("should respond with the user id and account confirmation token and success message given that email is valid and password strong enough", async () => {
      const user = { email: "a@b.c", password: "abcABC123!" };
      const res = await agent.post("/api/users/signup").send(user);
      expect(res.body.id).toBeTruthy();
      expect(res.body.token).toBeTruthy();
      expect(res.body.success).toBeTruthy();
      expect(res.body.success).toMatch(/pending confirmation/i);
    });

    it("should delete oldest user in the database given that the number of users has reached the limit", async () => {
      const dbLimit = process.env.TEST_MAX_USERS;
      const users = ["a@a.a", "b@b.b", "c@c.c", "d@d.d", "e@e.e"];
      const oldestUserPendingToken = (
        await mockUser("pending", agent, {
          email: users[0],
          password: "abcABC123!",
        })
      ).token;
      const secondOldestUserPendingToken = (
        await mockUser("pending", agent, {
          email: users[1],
          password: "abcABC123!",
        })
      ).token;
      for (let i = 2; i <= dbLimit; ++i) {
        await mockUser("pending", agent, {
          email: users[i],
          password: "abcABC123!",
        });
      }
      const canNotFindOldestUser = (
        await agent.get(`/api/users/${oldestUserPendingToken}`)
      ).body.error;
      const canFind2ndOldestUser = (
        await agent.get(`/api/users/${secondOldestUserPendingToken}`)
      ).body.success;
      expect(canNotFindOldestUser).toBeTruthy();
      expect(canFind2ndOldestUser).toBeTruthy();
    });
  });

  describe("GET /api/users/:accountConfirmationToken", () => {
    it("should respond with error if the confirmation token was invalid", async () => {
      const res = await agent.get(`/api/users/forgedOrExpiredToken`);
      expect(res.body).toHaveProperty(
        "error",
        "Couldn't find user with provided confirmation token - this might be because the account has already been confirmed"
      );
    });

    it("should respond with success message if the confirmation token was valid", async () => {
      const user = { email: "a@b.c", password: "abcABC123!" };
      const { token } = (await agent.post("/api/users/signup").send(user)).body;
      const res = await agent.get(`/api/users/${token}`);
      expect(res.body).toHaveProperty(
        "success",
        "Success! You may log in with your account now."
      );
    });
  });

  describe("POST /api/users/login", () => {
    it("should respond with error if login was attempted without email and/or password", async () => {
      await mockUser("confirmed", agent);
      const user = { email: "a@b.c", password: "" };
      const res = await agent.post(`/api/users/login`).send(user);
      expect(res.body).toHaveProperty("error", "All fields must be filled");
    });

    it("should respond with error if the password is wrong", async () => {
      await mockUser("confirmed", agent);
      const user = {
        email: "a@b.c",
        password: "wrongPassword",
      };
      const res = await agent.post(`/api/users/login`).send(user);
      expect(res.body).toHaveProperty("error", "Wrong password");
    });

    it("should respond with error if the email is not registered in the database", async () => {
      const user = {
        email: "a@b.c",
        password: "somePassword",
      };
      const res = await agent.post(`/api/users/login`).send(user);
      expect(res.body).toHaveProperty(
        "error",
        "That email does not exist in our database"
      );
    });

    it("should respond with error if the user has been registered but not confirmed", async () => {
      await mockUser("pending", agent);
      const user = {
        email: "a@b.c",
        password: "abcABC123!",
      };
      await agent.post("/api/users/signup").send(user);
      const res = await agent.post(`/api/users/login`).send(user);
      expect(res.body).toHaveProperty(
        "error",
        "You must verify your email before you log in"
      );
    });

    it("should respond with a login token if the user has been registered, confirmed and credentials are correct", async () => {
      await mockUser("confirmed", agent);
      const user = {
        email: "a@b.c",
        password: "abcABC123!",
      };
      const res = await agent.post("/api/users/login").send(user);
      expect(res.body.token).toBeTruthy();
    });
  });

  describe("PATCH /api/users/:id", () => {
    it("should respond with error in case of unauthorized update attempt", async () => {
      const { id, token } = await mockUser("confirmed", agent);
      const newUsername = "theDawg76";
      const res = (
        await agent
          .patch(`/api/users/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ username: newUsername })
      ).body;
      expect(res.error).toBeTruthy();
    });

    it("should respond with user details updated with the new username given that the user is authorized and a new username is submitted", async () => {
      const { id, token } = await mockUser("logged-in", agent);
      const newUsername = "the_Dawg.78";
      const res = (
        await agent
          .patch(`/api/users/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ username: newUsername })
      ).body;
      expect(res.user).toHaveProperty("username", newUsername);
    });

    it("should respond with user details updated with the new profile image given that the user is authorized and a new image is submitted", async () => {
      const { id, token } = await mockUser("logged-in", agent);
      const newProfileImg =
        "data:image/jpeg;base64,/9j/4QEKRXhpZgAATU0AKgAAAAgACAEbAAUAAAABA";
      const res = (
        await agent
          .patch(`/api/users/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ profileImg: newProfileImg })
      ).body;
      expect(res.user).toHaveProperty("profileImg", newProfileImg);
    });

    it("should respond with error if file type is wrong", async () => {
      const { id, token } = await mockUser("logged-in", agent);
      const newProfileImg = "data:image/psd;4QEKRXhpZgAATU0AKgAAAAgACAEbAAU";
      const res = (
        await agent
          .patch(`/api/users/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ profileImg: newProfileImg })
      ).body;
      console.log(res)
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/bad input/i);
    });

    it("should respond with error if file is too large", async () => {
      const { id, token } = await mockUser("logged-in", agent);
      const tooLarge = (() => {
        let str = "data:image/jpeg";
        for (let i = 0; i < 1049000; ++i) {
          str += "1";
        }
        return str;
      })();
      const res = (
        await agent
          .patch(`/api/users/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ profileImg: tooLarge })
      ).body;
      console.log(res)
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/image too big/i);
    });

    it("should respond with error if username is too long", async () => {
      const { id, token } = await mockUser("logged-in", agent);
      const newUsername = "abcabcabcabcabcabcacb";
      const res = (
        await agent
          .patch(`/api/users/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ username: newUsername })
      ).body;
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/too long/i);
    });

    it("should respond with error if username contains invalid characters", async () => {
      const { id, token } = await mockUser("logged-in", agent);
      const newUsername = "the,d@^^g!";
      const res = (
        await agent
          .patch(`/api/users/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ username: newUsername })
      ).body;
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(
        /may only contain letters, numbers, dots and underscores/i
      );
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should respond with error if no authorization token was found", async () => {
      const { id, token } = await mockUser("confirmed", agent);
      const res = (
        await agent
          .delete(`/api/users/${id}`)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.error).toBeTruthy();
    });

    it("should return no error upon signup attempt with the email of the user that has been deleted", async () => {
      const { id, token } = await mockUser("logged-in", agent);
      await agent
        .delete(`/api/users/${id}`)
        .set("Authorization", `Bearer ${token}`);
      const res = await mockUser("pending", agent);
      expect(res.error).toBeFalsy();
    });
  });

  describe("GET /api/users/download/:id", () => {
    it("should respond with error if no authorization token was found", async () => {
      const { id, token } = await mockUser("confirmed", agent);
      const res = (
        await agent
          .get(`/api/users/download/${id}`)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.error).toBeTruthy();
    });

    it("should return no error when the download started", async () => {
      const { id, token } = await mockUser("logged-in", agent);
      const res = (
        await agent
          .get(`/api/users/download/${id}`)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(res.user).toBeTruthy();
      expect(res.user._id).toBe(id);
      expect(res.workouts).toBeTruthy();
    });
  });

  describe("ANY /api/users", () => {
    it("should respond with error if too many requests were sent in a short amount of time", async () => {
      const maxReq = process.env.TEST_MAX_API_USERS_REQS;
      let res;
      for (let i = 0; i <= maxReq; ++i) {
        res = await agent.post("/api/users/signup").send({});
      }
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/too many requests/i);
    });
  });
});
