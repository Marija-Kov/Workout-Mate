import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import Navbar from "../Navbar";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { WorkoutContext } from "../../context/WorkoutContext";

let mockUser;

beforeAll(() => {
  mockUser = {
    id: "userid",
    email: "keech@mail.yu",
    token: "authorizationToken",
    username: undefined,
    profileImg: undefined,
    tokenExpires: Date.now() + 3600000,
  };
});

afterAll(() => {
  mockUser = null;
});

describe("<Navbar />", ()=>{
    it("should render the navbar correctly when the user is not logged in", () => {
      render(
        <AuthContext.Provider value={{ user: undefined }}>
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        </AuthContext.Provider>
      );
      const aboutLink = screen.getByLabelText(/about/i);
      const loginLink = screen.getByLabelText(/login/i);
      const signupLink = screen.getByLabelText(/signup/i);
      expect(aboutLink).toBeInTheDocument();
      expect(signupLink).toBeInTheDocument();
      expect(loginLink).toBeInTheDocument();
    });

    it("should focus navbar elements in the right order", async () => {
      user.setup();
      render(
        <AuthContext.Provider value={{ user: undefined }}>
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        </AuthContext.Provider>
      );
      const aboutLink = screen.getByLabelText(/about/i);
      const loginLink = screen.getByLabelText(/login/i);
      const signupLink = screen.getByLabelText(/signup/i);
      await user.tab();
      await user.tab();
      expect(aboutLink).toHaveFocus();
      await user.tab();
      expect(loginLink).toHaveFocus();
      await user.tab();
      expect(signupLink).toHaveFocus();
    });

    it("should render the navbar correctly when the user is logged in as well as focus the elements in the right order", async () => {
      user.setup();
      render(
        <AuthContext.Provider value={{ user: mockUser }}>
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        </AuthContext.Provider>
      );
      const helloUser = screen.getByLabelText(/user menu/i);
      await user.tab();
      await user.tab();
      expect(helloUser).toBeInTheDocument();
      expect(helloUser).toHaveFocus();
    });

    it("should render User menu once user clicks on avatar", async () => {
      user.setup();
      render(
        <WorkoutContext.Provider value={{ workouts: [] }}>
          <AuthContext.Provider value={{ user: mockUser }}>
            <BrowserRouter>
              <Navbar />
            </BrowserRouter>
          </AuthContext.Provider>
        </WorkoutContext.Provider>
      );   
      const helloUser = screen.getByLabelText(/user menu/i);
      user.click(helloUser);
      const openUserSettings = await screen.findByLabelText(/open user settings/i);
      const logOut = await screen.findByLabelText(/log out/i);
      expect(openUserSettings).toBeInTheDocument();
      expect(logOut).toBeInTheDocument();
    });

})