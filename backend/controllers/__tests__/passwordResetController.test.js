const request = require("supertest");
const app = require("../../server");
const db = require("../../database.config");

const agent = request.agent(app);

beforeAll(async () => await db.connect());
afterAll(async () => {
  await db.clear();
  await db.close();
});

describe("passwordResetController", () => {

    describe("POST /api/reset-password/", () => {
        it("should respond with error if the email address is not registered", async () => {
          const res = await mockPasswordResetResponse_POST("cecee@no.go", "not-registered");
          expect(res).toHaveProperty(
            "error",
            "That email does not exist in our database"
          );
        });

        it("should respond with error if the user with the entered email is not confirmed", async () => {
          const res = await mockPasswordResetResponse_POST("keech@not.confirmed", "registered");
          expect(res).toHaveProperty(
            "error",
            "The account with that email address has not yet been confirmed"
          );
        });

        it("should respond with 'reset link sent' message if the confirmed user with the entered email was found", async () => {
            const res = await mockPasswordResetResponse_POST("poozh@confirm.ed", "confirmed");
            expect(res).toHaveProperty(
              "success",
              "Reset link was sent to your inbox."
            );
        })
    })

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
});

async function mockPasswordResetResponse_POST(email, status){
    if(status === "registered"){
      await agent
        .post("/api/users/signup")
        .send({ email: email, password: "5tr0ng+P@ssw0rd" });
      return (
        await agent.post(`/api/reset-password`).send({ email: email })
      )._body;
    }
    if (status === "confirmed") {
      const user = (
        await agent
          .post("/api/users/signup")
          .send({ email: email, password: "5tr0ng+P@ssw0rd" })
      )._body;
        await agent.get(`/api/users/${user.token}`); 
        return (
          await agent
            .post(`/api/reset-password`)
            .send({ email: email })
        )._body; 
      }
   return (await agent.post(`/api/reset-password`).send({ email: email }))
     ._body; 
}

async function mockPasswordResetResponse_PATCH(test){
 if (test === "invalid-token"){
  await mockPasswordResetResponse_POST("cecee23@theroom.com", "confirmed");
  const resetToken = (
    await agent
      .post(`/api/reset-password`)
      .send({ email: "cecee23@theroom.com" })
  )._body.resetToken;
  await agent.patch(`/api/reset-password/${resetToken}`).send({
    password: "abcABC123!@#",
    confirmPassword: "abcABC123!@#",
  });
  return (await agent.patch(`/api/reset-password/${resetToken}`).send({
    password: "abcABC123!@#",
    confirmPassword: "abcABC123!@#",
  }))._body;

 }

 if(test === "passwords-not-matching"){
  await mockPasswordResetResponse_POST("cecee23@thebench.com", "confirmed");
  const resetToken = (
    await agent
      .post(`/api/reset-password`)
      .send({ email: "cecee23@thebench.com" })
  )._body.resetToken;
  return (
    await agent.patch(`/api/reset-password/${resetToken}`).send({
      password: "abcABC123!@#",
      confirmPassword: "abcABC123",
    })
  )._body;

 }

 if(test === "password-weak") {
    await mockPasswordResetResponse_POST("cecee22@thebench.com", "confirmed");
    const resetToken = (
      await agent
        .post(`/api/reset-password`)
        .send({ email: "cecee22@thebench.com" })
    )._body.resetToken;
    return (
      await agent.patch(`/api/reset-password/${resetToken}`).send({
        password: "abcABC",
        confirmPassword: "abcABC",
      })
    )._body;
 }

 if(test === "reset-success"){
     await mockPasswordResetResponse_POST("cecee23@thebeach.com", "confirmed");
     const resetToken = (
       await agent
         .post(`/api/reset-password`)
         .send({ email: "cecee23@thebeach.com" })
     )._body.resetToken;
     return (
       await agent.patch(`/api/reset-password/${resetToken}`).send({
         password: "abcABC123!",
         confirmPassword: "abcABC123!",
       })
     )._body;
 }

}