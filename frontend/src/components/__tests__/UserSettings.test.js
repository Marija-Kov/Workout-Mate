import UserSettings from "../UserSettings";
import user from "@testing-library/user-event";
import { render, screen, cleanup } from "@testing-library/react";
import { WorkoutContext } from "../../context/WorkoutContext";
import { AuthContext } from "../../context/AuthContext";
import { server } from "../../mocks/server";

let mockUser;
let mockWorkouts;

beforeAll(() => {
  server.listen();
  mockUser = {
    id: "userid",
    email: "keech@mail.yu",
    token: "authorizationToken",
    username: undefined,
    profileImg: undefined,
    tokenExpires: Date.now() + 3600000,
  };
  mockWorkouts = {
    allUserWorkoutsByQuery: [],
    workoutsChunk: [],
    limit: 3,
    noWorkoutsByQuery: false,
  };
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => {
  server.close();
  mockUser = null;
  mockWorkouts = null;
});

describe("<UserSettings/>", () => {
    it("should render UserSettings component correctly", async () => {
      render(
      <AuthContext.Provider value={{user: mockUser}}>
        <WorkoutContext.Provider value={{workouts: mockWorkouts}}>
            <UserSettings />
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
      const userSettings = await screen.findByLabelText(/user settings/i);
      const closeForm = await screen.findByLabelText(/close form/i);
      const newUsername = await screen.findByLabelText(/new username/i);
      const newProfileImage = await screen.findByLabelText(/new profile image/i);
      const upload = await screen.findByLabelText(/update profile button/i);
      const deleteAccount = await screen.findByLabelText(/delete account button/i);
      expect(userSettings).toBeInTheDocument();
      expect(closeForm).toBeInTheDocument();
      expect(newUsername).toBeInTheDocument();
      expect(newProfileImage).toBeInTheDocument();
      expect(upload).toBeInTheDocument();
      expect(deleteAccount).toBeInTheDocument();
    });

    it("should focus elements in correct order", async () => {
      user.setup();
      render(
        <AuthContext.Provider value={{ user: mockUser }}>
          <WorkoutContext.Provider value={{ workouts: mockWorkouts }}>
            <UserSettings />
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
      const closeForm = await screen.findByLabelText(/close form/i);
      const newUsername = await screen.findByLabelText(/new username/i);
      const newProfileImage = await screen.findByLabelText(/new profile image/i);
      const upload = await screen.findByLabelText(/update profile button/i);
      const deleteAccount = await screen.findByLabelText(/delete account button/i);
      await user.tab();
      expect(closeForm).toHaveFocus();
      await user.tab();
      expect(newUsername).toHaveFocus();
      await user.tab();
      expect(newProfileImage).toHaveFocus();
      await user.tab();
      expect(upload).toHaveFocus();
      await user.tab();
      expect(deleteAccount).toHaveFocus();
    });

    it("should update new username input value when user types", async () => {
      user.setup();
      render(
        <AuthContext.Provider value={{ user: mockUser }}>
          <WorkoutContext.Provider value={{ workouts: mockWorkouts }}>
            <UserSettings />
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
      const newUsername = await screen.findByLabelText(/new username/i);
      await user.type(newUsername, "daredev");
      expect(newUsername).toHaveValue("daredev");
    });

    it("should render error message and disable upload button if name is too long", async () => {
      user.setup();
      render(
        <AuthContext.Provider value={{ user: mockUser }}>
          <WorkoutContext.Provider value={{ workouts: mockWorkouts }}>
            <UserSettings />
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
      const newUsername = await screen.findByLabelText(/new username/i);
      await user.type(newUsername, "daredev3343554543543553454");
      const error = await screen.findByRole('alert');
      const upload = await screen.findByLabelText(/update profile button/i);
      expect(error).toBeInTheDocument();
      expect(error.textContent).toMatch(/too long/i);
      expect(upload).toHaveAttribute("disabled");
      
    });

    it("should respond with success message if profile was updated successfully", async () => {
      user.setup();
      render(
        <AuthContext.Provider value={{ user: mockUser, dispatch: () => {} }}>
          <WorkoutContext.Provider
            value={{ workouts: mockWorkouts, dispatch: () => {} }}
          >
            <UserSettings />
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
      const newUsername = await screen.findByLabelText(/new username/i);
      await user.type(newUsername, "daredev");
      const upload = await screen.findByLabelText(/update profile button/i);
      await user.click(upload);
      const successMessage = await screen.findByText(/success/i);
      expect(successMessage).toBeInTheDocument();
    });

    it("should render delete account dialogue component when 'delete account' button is clicked", async () => {
      user.setup();
      render(
        <AuthContext.Provider value={{ user: mockUser }}>
          <WorkoutContext.Provider value={{ workouts: mockWorkouts }}>
            <UserSettings />
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
      const deleteAccount = await screen.findByLabelText(
        /delete account button/i
      );
      await user.click(deleteAccount);
      const deleteAccountDialogue = await screen.findByLabelText(
        /delete account dialogue/i
      );
      expect(deleteAccountDialogue).toBeInTheDocument();
    });

});