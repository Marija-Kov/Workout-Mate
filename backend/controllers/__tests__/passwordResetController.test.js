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
        it("should send error message if the email address is not registered", async () => {
         const res = await mockPasswordResetResponse_POST(true);
         expect(res).toHaveProperty(
           "error",
           "That email does not exist in our database"
         );
        });

        it("should send error message if the user with the entered email is not confirmed", async () => {
          const res = await mockPasswordResetResponse_POST(
            "poozh@validemail.com", true, false
          );
          expect(res).toHaveProperty(
            "error",
            "The account with that email address has not yet been confirmed"
          );
        });

        it("should send reset link sent message if the confirmed user with the entered email was found", async () => {
            const res = await mockPasswordResetResponse_POST(
              "cecee@validemail.com"
            );
            expect(res).toHaveProperty(
              "success",
              "Reset link was sent to your inbox."
            );
        })
    })

    describe("PATCH /api/reset-password/:token", () => {
        it("should return error message if no user with the received reset password token was found", async () => {
           const res = await mockPasswordResetResponse_PATCH(false);
           expect(res).toHaveProperty("error", "Invalid token");
        });

        it("should return error message if the token is valid but passwords don't match", async () => {
            const res = await mockPasswordResetResponse_PATCH(
              true,
              "nebojs@daredev.com",
              "f0rgetTh!sP@ssw",
              "abcABC123!",
              "abcABC123!@#"
            );
            expect(res).toHaveProperty("error", "Passwords must match"); 
        });

        it("should return error message if the token is valid but the new password isn't strong enough", async () => {
             const res = await mockPasswordResetResponse_PATCH(
               true,
               "choco@blok45.com",
               "f0rgetTh!sP@ssw",
               "abcABC",
               "abcABC"
             );
             expect(res).toHaveProperty(
               "error",
               "Password not strong enough"
             ); 
          });

        it("should send success message if the reset token is valid, password is strong enough and matches confirm password", async () => {
            const res = await mockPasswordResetResponse_PATCH(
              true,
              "runda@blok45.com",
              "f0rgetTh!sP@ssw",
              "abcABC123!@#",
              "abcABC123!@#"
            );
             expect(res).toHaveProperty(
               "success",
               "Password reset successfully"
             ); 
        });
    });
});

async function mockPasswordResetResponse_POST(email, registered=true, confirmed=true){
    if(registered){
      const newUserPending = (
      await agent
        .post("/api/users/signup")
        .send({ email: email, password: "5tr0ng+P@ssw0rd" })
    )._body;
      if(confirmed) await agent.get(`/api/users/${newUserPending.token}`);  
     
    }
    
    const res = (await agent
      .post(`/api/reset-password`)
      .send({ email: email }))._body;
    return res
}

async function mockPasswordResetResponse_PATCH(token=true, email, forgottenPassw, newPassw, confirmNewPassw) {
  let res;
  if (!token) {
    res = (
      await agent.patch("/api/reset-password/expiredOrForgedToken").send({
        password: "somePassword123!",
        confirmPassword: "somePassword123!",
      })
    )._body;
  } else {
    const newUserPending = (
      await agent
        .post("/api/users/signup")
        .send({ email: email, password: forgottenPassw })
    )._body;
    await agent.get(`/api/users/${newUserPending.token}`);
    const resetToken = (
      await agent.post(`/api/reset-password`).send({ email: email })
    )._body.resetToken;
    res = (
      await agent.patch(`/api/reset-password/${resetToken}`).send({
        password: newPassw,
        confirmPassword: confirmNewPassw,
      })
    )._body;
  }
  return res;
}