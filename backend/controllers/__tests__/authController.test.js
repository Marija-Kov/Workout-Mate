const request = require("supertest");
const app = require("../../server");
const db = require("../../database.config");

const agent = request.agent(app);

beforeAll(async () => await db.connect());
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

describe("authController", () => {
  describe("POST /signup", () => {
    it("should post user and return id and account confirmation token", async () => {
      const user = { email: "keech@validemail.com", password: "abcABC123!" };
      const res = await agent.post("/api/users/signup").send(user);
      expect(res._body.id).toBeTruthy();
      expect(res._body.token).toBeTruthy();
    });

    it("should send error response for trying to sign up with invalid email", async () => {
      const user = { email: "invalidemail", password: "abcABC123!" };
      const res = await agent.post("/api/users/signup").send(user);
      expect(res._body.id).toBeFalsy();
      expect(res._body.token).toBeFalsy();
      expect(res._body).toHaveProperty(
        "error",
        "Please enter valid email address"
      );
    });

    it("should send error response for trying to sign up with a weak password", async () => {
      const user = { email: "keech@validemail.com", password: "abc" };
      const res = await agent.post("/api/users/signup").send(user);
      console.log(res._body);
      expect(res._body.id).toBeFalsy();
      expect(res._body.token).toBeFalsy();
      expect(res._body).toHaveProperty("error", "Password not strong enough");
    });
  });
});
