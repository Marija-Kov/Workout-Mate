const request = require("supertest");
const app = require("../../server");
const { connect, clear, close } = require("../../database.config");

const agent = request.agent(app);

beforeAll(async () => await connect());
afterEach(async () => await clear());
afterAll(async () => await close());

describe("passwordResetController", () => {
  describe("POST /api/reset-password/", () => {
    it("should respond with error if the email address is not registered", async () => {
      const res = await mockPasswordResetResponse_POST("not-registered");
      expect(res).toHaveProperty(
        "error",
        "That email does not exist in our database"
      );
    });

    it("should respond with error if the user with the entered email is not confirmed", async () => {
      const res = await mockPasswordResetResponse_POST("registered");
      expect(res).toHaveProperty(
        "error",
        "The account with that email address has not yet been confirmed"
      );
    });

    it("should respond with 'reset link sent' message if the confirmed user with the entered email was found", async () => {
      const res = await mockPasswordResetResponse_POST("confirmed");
      expect(res).toHaveProperty(
        "success",
        "Reset link was sent to your inbox."
      );
    });
  });

  describe("PATCH /api/reset-password/:token", () => {
    it("should respond with error if no user with the received reset password token was found", async () => {
      const res = await mockPasswordResetResponse_PATCH("invalid-token");
      expect(res).toHaveProperty("error", "Invalid token");
    });

    it("should return error message if the token is valid but passwords don't match", async () => {
      const res = await mockPasswordResetResponse_PATCH(
        "passwords-not-matching"
      );
      expect(res).toHaveProperty("error", "Passwords must match");
    });

    it("should respond with error if the token is valid but the new password isn't strong enough", async () => {
      const res = await mockPasswordResetResponse_PATCH("password-weak");
      expect(res).toHaveProperty("error", "Password not strong enough");
    });

    it("should respond with success message if the reset token is valid, password is strong enough and matches confirm password", async () => {
      const res = await mockPasswordResetResponse_PATCH("reset-success");
      expect(res).toHaveProperty("success", "Password reset successfully");
    });
  });

  describe("ANY /api/reset-password", () => {
    it("should respond with error if too many requests were sent in a short amount of time", async () => {
      const max = Number(process.env.TEST_MAX_API_RESET_PASSWORD_REQS);
      for (let i = 0; i <= max; ++i) {
        await mockPasswordResetResponse_POST("a@b.c", "registered");
      }
      const res = await mockPasswordResetResponse_POST("a@b.c", "registered");
      expect(res.error).toBeTruthy();
      expect(res.error).toMatch(/too many requests/i);
    });
  });
});

async function mockPasswordResetResponse_POST(status) {
  const email = "a@b.c";
  const password = "5tr0ng+P@ssw0rd";
  if (status === "registered") {
    await agent
      .post("/api/users/signup")
      .send({ email, password });
    return (await agent.post(`/api/reset-password`).send({ email }))
      ._body;
  }
  if (status === "confirmed") {
    const user = (
      await agent
        .post("/api/users/signup")
        .send({ email, password })
    )._body;
    await agent.get(`/api/users/${user.token}`);
    return (await agent.post(`/api/reset-password`).send({ email }))
      ._body;
  }
  return (await agent.post(`/api/reset-password`).send({ email }))
    ._body;
}

async function mockPasswordResetResponse_PATCH(test) {
  const email = "a@b.c";
  if (test === "invalid-token") {
    await mockPasswordResetResponse_POST("confirmed");
    const resetToken = (
      await agent.post(`/api/reset-password`).send({ email })
    )._body.resetToken;
    await agent.patch(`/api/reset-password/${resetToken}`).send({
      password: "abcABC123!@#",
      confirmPassword: "abcABC123!@#",
    });
    return (
      await agent.patch(`/api/reset-password/${resetToken}`).send({
        password: "abcABC123!@#",
        confirmPassword: "abcABC123!@#",
      })
    )._body;
  }

  if (test === "passwords-not-matching") {
    await mockPasswordResetResponse_POST("confirmed");
    const resetToken = (
      await agent.post(`/api/reset-password`).send({ email })
    )._body.resetToken;
    return (
      await agent.patch(`/api/reset-password/${resetToken}`).send({
        password: "abcABC123!@#",
        confirmPassword: "abcABC123",
      })
    )._body;
  }

  if (test === "password-weak") {
    await mockPasswordResetResponse_POST("confirmed");
    const resetToken = (
      await agent.post(`/api/reset-password`).send({ email })
    )._body.resetToken;
    return (
      await agent.patch(`/api/reset-password/${resetToken}`).send({
        password: "abcABC",
        confirmPassword: "abcABC",
      })
    )._body;
  }

  if (test === "reset-success") {
    await mockPasswordResetResponse_POST("confirmed");
    const resetToken = (
      await agent.post(`/api/reset-password`).send({ email })
    )._body.resetToken;
    return (
      await agent.patch(`/api/reset-password/${resetToken}`).send({
        password: "abcABC123!",
        confirmPassword: "abcABC123!",
      })
    )._body;
  }
}
