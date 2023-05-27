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
    
  describe("POST /signup", () => {    
    it("should respond with error on attempt to sign up with an invalid email", async () => {
      const user = { email: "invalidemail", password: "abcABC123!" };
      const res = await agent.post("/api/users/signup").send(user);
      expect(res._body.id).toBeFalsy();
      expect(res._body).toHaveProperty(
        "error",
        "Please enter valid email address"
      );
    });

    it("should respond with error on attempt to sign up with a weak password", async () => {
      const user = { email: "keech@validemail.com", password: "abc" };
      const res = await agent.post("/api/users/signup").send(user);
      expect(res._body.id).toBeFalsy();
      expect(res._body).toHaveProperty("error", "Password not strong enough");
    });

    it("should respond with error on attempt to sign up with an email that already exists in the database", async () => {
      const user = { email: "poozh@validemail.yu", password: "abcABC123!" };
      await mockUser(user.email, user.password, "confirmed");
      const res = (await agent.post("/api/users/signup").send(user))._body;
      expect(res.error).toBeTruthy();
    });

    it("should respond with the user id and account confirmation token given that email is valid and password strong enough", async () => {
      const user = { email: "keech@validemail.com", password: "abcABC123!" };
      const res = await agent.post("/api/users/signup").send(user);
      expect(res._body.id).toBeTruthy();
      expect(res._body.token).toBeTruthy();
    });

    it("should delete oldest user in the database given that the number of users has reached the limit", async () => {
      const dbLimit = 5;
      const users = [
        "abc@mail.yu",
        "def@mail.yu",
        "ghi@mail.yu",
        "jkl@mail.yu",
        "mno@mail.yu"
      ]; 
      const oldestUserPendingToken = (await mockUser(users[0], "abcABC123!", "pending")).token;
      const secondOldestUserPendingToken = (await mockUser(users[1], "abcABC123!", "pending")).token;
      for(let i = 2; i <= dbLimit; ++i){
        await mockUser(users[i], "abcABC123!", "pending");
      }
      const canNotFindOldestUser = (await agent.get(`/api/users/${oldestUserPendingToken}`))._body.error;
      const canFind2ndOldestUser = (await agent.get(`/api/users/${secondOldestUserPendingToken}`))._body.success;
      expect(canNotFindOldestUser).toBeTruthy();
      expect(canFind2ndOldestUser).toBeTruthy();
    })
    
  });

  describe("GET /:accountConfirmationToken", () => {
    it("should respond with error if the confirmation token was invalid", async () => {
      const res = await agent.get(`/api/users/forgedOrExpiredToken`);
      expect(res._body).toHaveProperty("error", "User not found.");
    });

    it("should respond with success message if the confirmation token was valid", async () => {
      const user = { email: "keech2@validemail.com", password: "abcABC123!" };
      const confirmedUser = (await agent.post("/api/users/signup").send(user))
        ._body;
      const res = await agent.get(`/api/users/${confirmedUser.token}`);
      expect(res._body).toHaveProperty(
        "success",
        "Success! You may log in with your account now."
      );
    });

  });
  
  describe("POST /login" , () => {
    it("should respond with error if login was attempted without email and/or password", async () => {
      await mockUser("poozh@thedoor.rs", "abcABC123!", "confirmed");
      const user = { email: "poozh2@thedoor.rs", password: "" };
      const res = await agent.post(`/api/users/login`).send(user);
      expect(res._body).toHaveProperty("error", "All fields must be filled");
    })

    it("should respond with error if the password is wrong", async () => {
      await mockUser("keech@validemail.yu", "abcABC123!", "confirmed");
      const user = {
        email: "keech@validemail.yu",
        password: "wrongPassword",
      };
      const res = await agent.post(`/api/users/login`).send(user);
      expect(res._body).toHaveProperty("error", "Wrong password");
    });

    it("should respond with error if the email is not registered in the database", async () => {
      const user = {
        email: "keech@notregistered.com",
        password: "somePassword",
      };
      const res = await agent.post(`/api/users/login`).send(user);
      expect(res._body).toHaveProperty(
        "error",
        "That email does not exist in our database"
      );
    });

    it("should respond with error if the user has been registered but not confirmed", async () => {
      const user = {
        email: "poozh@validemail.com",
        password: "5tr0ng+P@ssw0rd",
      };
      await mockUser(user.email, user.password, "pending");
      await agent.post("/api/users/signup").send(user);
      const res = await agent.post(`/api/users/login`).send(user);
      expect(res._body).toHaveProperty(
        "error",
        "You must verify your email before you log in"
      );
    });

    it("should respond with a login token if the user has been registered, confirmed and credentials are correct", async () => {
      const user = {
        email: "keechy@validemail.com",
        password: "abcABC123!",
      };
       await mockUser(user.email, user.password, "confirmed");
      const res = await agent
        .post("/api/users/login")
        .send(user);
        expect(res._body.token).toBeTruthy();
    });
  })

  describe("PATCH /:id", () => {
    it("should respond with error in case of unauthorized update attempt", async () => {
        const user = {
         email: "crickets@grass.tk",
         password: "5tr0ng+P@ssw0rd",
       };
       const userConfirmed = await mockUser(user.email, user.password, "confirmed");
       const newUsername = "theDawg76";
       const res = (
         await agent
           .patch(`/api/users/${userConfirmed.id}`)
           .set("Authorization", `Bearer ${userConfirmed.token}`)
           .send({ username: newUsername })
       )._body;
       expect(res.error).toBeTruthy();
    });

    it("should respond with user details updated with the new username given that the user is authorized and a new username is submitted", async () => {
    const user = { email: "cecee@hello.com", password: "5tr0ng+P@ssw0rd" };
    const userLoggedIn = await mockUser(user.email, user.password, "logged-in")
    const newUsername = "theDawg78";
    const res = (
      await agent
        .patch(`/api/users/${userLoggedIn.id}`)
        .set("Authorization", `Bearer ${userLoggedIn.token}`)
        .send({ username: newUsername })
    )._body;
    expect(res).toHaveProperty("username", newUsername);
    });
   
    it ("should respond with user details updated with the new profile image given that the user is authorized and a new image is submitted", async () => {
      const user = { email: "cecee@hello.yu", password: "5tr0ng+P@ssw0rd" };
      const userLoggedIn = await mockUser(user.email, user.password, "logged-in");
      const newProfileImg = "selectedImageEncodedToBase64akaAVeryLargeString";
      const res = (
        await agent
          .patch(`/api/users/${userLoggedIn.id}`)
          .set("Authorization", `Bearer ${userLoggedIn.token}`)
          .send({ profileImg: newProfileImg })
      )._body;
      expect(res).toHaveProperty("profileImg", newProfileImg);
    });
  });

  describe("DELETE /:id", () => {
    it("should respond with error if no authorization token was found", async () => {
       const user = {
         email: "crickets@grass.roots",
         password: "5tr0ng+P@ssw0rd",
       };
       const userConfirmed = await mockUser(user.email, user.password, "confirmed");
       const res = (await agent.delete(`/api/users/${userConfirmed.id}`)
       .set("Authorization", `Bearer ${userConfirmed.token}`))._body;
       expect(res.error).toBeTruthy();
    });

    it("should return no error upon signup attempt with the email of the user that has been deleted", async () => {  
      const user = {
        email: "crickets@grass.com",
        password: "5tr0ng+P@ssw0rd",
      };
      const userLoggedIn = await mockUser(user.email, user.password, "logged-in");
      await agent
        .delete(`/api/users/${userLoggedIn.id}`)
        .set("Authorization", `Bearer ${userLoggedIn.token}`);
      const res = await mockUser(user.email, user.password, "pending");
      expect(res.error).toBeFalsy();
    });
  });

});

async function mockUser(email, password, status){
  const user = {
    email: email,
    password: password,
  };
  const userPending = (await agent.post("/api/users/signup").send(user))._body;
  if(status==="pending") return userPending;

  const userConfirmed = (await agent.get(`/api/users/${userPending.token}`))
    ._body;
  if(status==="confirmed") return userConfirmed

  const userLoggedIn = (await agent.post("/api/users/login").send(user))._body;
  if(status==="logged-in") return userLoggedIn

}
