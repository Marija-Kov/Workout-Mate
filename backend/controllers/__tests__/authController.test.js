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
  
  describe("POST /login", () => {
    it("should throw an error if input value is missing", async () => {
      const userMissingInputValue = {
        email: "keech@validemail.com",
        password: "",
      };
      const res = await agent.post(`/api/users/login`).send(userMissingInputValue);
      expect(res._body).toHaveProperty("error", "All fields must be filled");
    })

    it("should throw an error if the password is wrong", async () => {
     const userWrongPassword = {
      email: "keech@validemail.com", password: "wrongPassword"
     }
     const res = await agent.post(`/api/users/login`).send(userWrongPassword);
     expect(res._body).toHaveProperty("error", "Wrong password");
    });

    it("should throw an error if the email is not registered in the database", async () => {
      const notRegistered = {
        email: "keech@notregistered.com",
        password: "somePassword",
      };
      const res = await agent.post(`/api/users/login`).send(notRegistered);
      expect(res._body).toHaveProperty(
        "error",
        "That email does not exist in our database"
      );
    });

    it("should throw error if the user has been registered but not confirmed", async () => {
      const userPendingConfirmation = {
        email: "poozh@validemail.com",
        password: "5tr0ng+P@ssw0rd",
      };
      await agent.post("/api/users/signup").send(userPendingConfirmation); 
      const res = await agent
        .post(`/api/users/login`)
        .send(userPendingConfirmation);
        expect(res._body).toHaveProperty(
          "error",
          "You must verify your email before you log in"
        );
    });

    it("should send a login token if the user has been registered, confirmed and credentials are correct", async () => {
      const confirmedUser = {
        email: "keech@validemail.com",
        password: "abcABC123!",
      };
      const res = await agent
        .post("/api/users/login")
        .send(confirmedUser);
        expect(res._body.token).toBeTruthy();
    });
  })

  describe("PATCH /:id", () => {
    let userLoggedIn;
    it("should update username when the new username is entered", async () => {
    const newUserCredentials = { email: "cecee@hello.com", password: "5tr0ng+P@ssw0rd" };
    const newUserPending = (await agent.post("/api/users/signup").send(newUserCredentials))._body; 
    await agent.get(`/api/users/${newUserPending.token}`);
    userLoggedIn = (
      await agent.post("/api/users/login").send(newUserCredentials)
    )._body;
    const newUsername = "theDawg78";
    const userUsernameUpdated = (
      await agent
        .patch(`/api/users/${userLoggedIn.id}`)
        .set("Authorization", `Bearer ${userLoggedIn.token}`)
        .send({ username: newUsername })
    )._body;
    expect(userUsernameUpdated).toHaveProperty("username", newUsername);
    expect(userUsernameUpdated).toHaveProperty("success", "Profile updated.");
    });

    it ("should update the profile image when the new image is selected", async () => {
      const newProfileImg = "selectedImageEncodedToBase64akaAVeryLargeString";
      const userProfileImgUpdated = (
        await agent
          .patch(`/api/users/${userLoggedIn.id}`)
          .set("Authorization", `Bearer ${userLoggedIn.token}`)
          .send({ profileImg: newProfileImg })
      )._body;
      expect(userProfileImgUpdated).toHaveProperty("profileImg", newProfileImg);
      expect(userProfileImgUpdated).toHaveProperty(
        "success",
        "Profile updated."
      );
    });
  });

  describe("DELETE /:id", () => {
    it("should delete user and return deleted user's details", async () => {  
      const newUserCredentials = {
        email: "crickets@grass.com",
        password: "5tr0ng+P@ssw0rd",
      };
      const newUserPending = (
        await agent.post("/api/users/signup").send(newUserCredentials)
      )._body;
      const newUserConfirmed = (await agent.get(`/api/users/${newUserPending.token}`))._body;
      const deletedUser = (await agent.delete(`/api/users/${newUserConfirmed.id}`))._body;
      expect(deletedUser).toHaveProperty("email", newUserCredentials.email);
    })
  })

});
