const request = require("supertest");
const app = require("../../server");
const { clearSqlite, closeSqlite } = require("../test-utils/sqlite.config");
const agent = request.agent(app);

afterEach(async () => await clearSqlite());
afterAll(async () => await closeSqlite());

describe("passwordResetController", () => {
  describe("POST /api/reset-password/", () => {
    it("should respond with error if the user is not registered", async () => {
      const res = await mockPasswordResetResponse_POST("not-registered");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty(
        "error",
        "That email does not exist in our database"
      );
    });

    it("should respond with error if the user is not confirmed", async () => {
      const res = await mockPasswordResetResponse_POST("registered");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty(
        "error",
        "The account with that email address has not yet been confirmed"
      );
    });

    it("should respond with 'reset link sent' message if the user is confirmed", async () => {
      const res = await mockPasswordResetResponse_POST("confirmed");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "success",
        "Reset link was sent to your inbox."
      );
    });
  });

  describe("PATCH /api/reset-password/:token", () => {
    it("should respond with error if no user with the received token was found", async () => {
      const res = await mockPasswordResetResponse_PATCH("invalid-token");
      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty("error", "Invalid token");
    });

    it("should return error message if the token is valid but passwords don't match", async () => {
      const res = await mockPasswordResetResponse_PATCH(
        "passwords-not-matching"
      );
      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty("error", "Passwords must match");
    });

    it("should respond with error if the token is valid but the new password isn't strong enough", async () => {
      const res = await mockPasswordResetResponse_PATCH("password-weak");
      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty("error", "Password not strong enough");
    });

    it("should respond with success message if the reset token is valid, password is strong enough and matches confirm password", async () => {
      const res = await mockPasswordResetResponse_PATCH("reset-success");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", "Password reset successfully");
    });
  });

  describe("ANY /api/reset-password", () => {
    it("should respond with error if too many requests were sent in a short amount of time", async () => {
      const app = require("express")();
      app.use(require("../../middleware/rateLimiters").api_reset_password);
      app.use("/api/reset-password", require("../../routes/resetPassword"));
      app.use("/api/users", require("../../routes/users"));
      const agent = request.agent(app);
      const max = Number(process.env.MAX_API_RESET_PASSWORD_REQS) || 20;
      let res;
      for (let i = 0; i <= max; ++i) {
        res = await mockPasswordResetResponse_POST("registered", agent);
      }
      expect(res.status).toBe(429);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toMatch(/too many requests/i);
    });
  });
});

async function mockPasswordResetResponse_POST(status, a = agent) {
  if (!a) {
    console.error("Agent not found");
    return;
  }
  const email = "a@b.c";
  const password = "5tr0ng+P@ssw0rd";
  if (status === "registered") {
    await a.post("/api/users/signup").send({ email, password });
    return await a.post(`/api/reset-password`).send({ email });
  }
  if (status === "confirmed") {
    const user = (
      await a.post("/api/users/signup").send({ email, password })
      ).body;
      await a.get(`/api/users/confirmaccount/${user.token}`);
      const res = await a.post(`/api/reset-password`).send({ email });
      return res;
  }
  return await a.post(`/api/reset-password`).send({ email });
}

async function mockPasswordResetResponse_PATCH(test) {
  const email = "a@b.c";
  if (test === "invalid-token") {
    await mockPasswordResetResponse_POST("confirmed");
    const resetToken = (await agent.post(`/api/reset-password`).send({ email }))
      .body.resetToken;
    await agent.patch(`/api/reset-password/${resetToken}`).send({
      password: "abcABC123!@#",
      confirmPassword: "abcABC123!@#",
    });
    return await agent.patch(`/api/reset-password/${resetToken}`).send({
      password: "abcABC123!@#",
      confirmPassword: "abcABC123!@#",
    });
  }

  if (test === "passwords-not-matching") {
    await mockPasswordResetResponse_POST("confirmed");
    const resetToken = (await agent.post(`/api/reset-password`).send({ email }))
      .body.resetToken;
    return await agent.patch(`/api/reset-password/${resetToken}`).send({
      password: "abcABC123!@#",
      confirmPassword: "abcABC123",
    });
  }

  if (test === "password-weak") {
    await mockPasswordResetResponse_POST("confirmed");
    const resetToken = (await agent.post(`/api/reset-password`).send({ email }))
      .body.resetToken;
    return await agent.patch(`/api/reset-password/${resetToken}`).send({
      password: "abcABC",
      confirmPassword: "abcABC",
    });
  }

  if (test === "reset-success") {
    await mockPasswordResetResponse_POST("confirmed");
    const resetToken = (await agent.post(`/api/reset-password`).send({ email }))
      .body.resetToken;
    return await agent.patch(`/api/reset-password/${resetToken}`).send({
      password: "abcABC123!",
      confirmPassword: "abcABC123!",
    });
  }
}
