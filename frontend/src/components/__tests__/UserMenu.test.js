import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import { AuthContext } from "../../context/AuthContext";
import { WorkoutContext } from "../../context/WorkoutContext";
import UserMenu from "../UserMenu";

let mockUser;
let mockWorkouts;

beforeAll(() => {
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

afterAll(() => {
  mockUser = null;
  mockWorkouts = null;
});

describe("<UserMenu />", () => {
    it("should render UserMenu correctly", async () => {
      user.setup();
      render(
        <WorkoutContext.Provider value={{ workouts: mockWorkouts }}>
          <AuthContext.Provider value={{ user: mockUser }}>
            <UserMenu />
          </AuthContext.Provider>
        </WorkoutContext.Provider>
      );
      const openUserSettings = await screen.findByLabelText(/open user settings/i);
      const logoutBtn = await screen.findByLabelText(/log out/i);
      expect(openUserSettings).toBeInTheDocument();
      expect(logoutBtn).toBeInTheDocument();
    });

    it("should focus UserMenu elements in correct order", async () => {
      user.setup();
      render(
        <WorkoutContext.Provider value={{ workouts: mockWorkouts }}>
          <AuthContext.Provider value={{ user: mockUser }}>
              <UserMenu />
          </AuthContext.Provider>
        </WorkoutContext.Provider>
      );
      const openUserSettings = await screen.findByLabelText(/open user settings/i);
      const logoutBtn = await screen.findByLabelText(/log out/i);
      await user.tab();
      expect(openUserSettings).toHaveFocus();
      await user.tab();
      expect(logoutBtn).toHaveFocus();
    })

    it("should render Profile settings component when user clicks on Settings in User menu", async () => {
      user.setup();
      render(
        <WorkoutContext.Provider value={{ workouts: mockWorkouts }}>
          <AuthContext.Provider value={{ user: mockUser }}>
              <UserMenu />
          </AuthContext.Provider>
        </WorkoutContext.Provider>
      );
      const openUserSettings = await screen.findByLabelText(/settings/i);
      await user.click(openUserSettings);
      const userSettings = await screen.findByLabelText(
        /change user settings/i
      );
      expect(userSettings).toBeInTheDocument();
    });
})