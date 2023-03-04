const request = require("supertest");
const app = require("../../server");
const db = require("../../database.config");

const agent = request.agent(app);

beforeAll(async () => await db.connect());
afterAll(async () => {
   await db.clear()
   await db.close()
});

describe("authController", () => {
    let user;
  describe("POST /signup", () => {    
    it("should send error response for trying to sign up with invalid email", async () => {
      user = { email: "invalidemail", password: "abcABC123!" };
      const res = await agent.post("/api/users/signup").send(user);
      expect(res._body.id).toBeFalsy();
      expect(res._body.token).toBeFalsy();
      expect(res._body).toHaveProperty(
        "error",
        "Please enter valid email address"
      );
    });

    it("should send error response for trying to sign up with a weak password", async () => {
      user = { email: "keech@validemail.com", password: "abc" };
      const res = await agent.post("/api/users/signup").send(user);
      expect(res._body.id).toBeFalsy();
      expect(res._body.token).toBeFalsy();
      expect(res._body).toHaveProperty("error", "Password not strong enough");
    });

    it("should post user and return id and account confirmation token", async () => {
      user = { email: "keech@validemail.com", password: "abcABC123!" };
      const res = await agent.post("/api/users/signup").send(user);
      if(res.ok){
        user = res._body
      }
      expect(res._body.id).toBeTruthy();
      expect(res._body.token).toBeTruthy();
    });
    
  });

  describe("GET /:accountConfirmationToken", () => {
    it("should send error if the confirmation token is invalid", async () => {
      const notVerified = {
        badToken: "fakeOrExpired",
      };
      const res = await agent.get(`/api/users/${notVerified.badToken}`
    );
      expect(res._body).toHaveProperty("error", "User not found.");
    });

    it("should send success message if the confirmation token is valid", async () => {
      const res = await agent.get(`/api/users/${user.token}`);
      expect(res._body).toHaveProperty(
        "success",
        "Success! You may log in with your account now."
      );
    });

  });

});
