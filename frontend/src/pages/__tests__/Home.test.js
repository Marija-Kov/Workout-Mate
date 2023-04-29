import React from 'react';
import { render, screen, cleanup } from "@testing-library/react";
import user from "@testing-library/user-event";
import { AuthContext } from "../../context/AuthContext";
import { WorkoutContext } from "../../context/WorkoutContext";
import { jest } from "@jest/globals"
import { genSampleWorkouts } from '../../utils/test/genSampleWorkouts';
import Home from "../Home";
import Search from '../../components/Search';
import Pagination from '../../components/Pagination';
import WorkoutDetails from '../../components/WorkoutDetails';
import WorkoutForm from '../../components/WorkoutForm';

jest.mock("../../components/WorkoutDetails");
jest.mock("../../components/Pagination");
jest.mock("../../components/WorkoutForm");
jest.mock("../../components/Search");
jest.mock("../../hooks/useSearch", () => ({
  useSearch: () => {
       return {
           search: () => {},
           total: mockWorkouts.searchResults.length,
           limit: mockWorkouts.resultsOnPage.length,
           isLoading: false,
       };
  }
        
}));

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
  mockWorkouts = genSampleWorkouts()
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  jest.clearAllMocks();
  mockUser = null;
  mockWorkouts = null;
});

describe("<Home />", () => {
    it("should render Home page correctly given that user is authenticated", async () => {
      render(
        <AuthContext.Provider value={{ user: mockUser }}>
          <WorkoutContext.Provider
            value={{ workouts: mockWorkouts.resultsOnPage }}
          >
            <Home />
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
      const addWorkoutBtn = await screen.findByLabelText(/buff it up/i);
      const workouts = await screen.findByLabelText(/workouts/i);
      expect(Search).toHaveBeenCalled();
      expect(Pagination).toHaveBeenCalled();
      expect(WorkoutDetails).toHaveBeenCalled();
      expect(addWorkoutBtn).toBeInTheDocument();
      expect(workouts).toBeInTheDocument();
    });

    it("should render WorkoutForm component when user clicks on 'Buff it up' button", async () => {
      user.setup();
      render(
        <AuthContext.Provider value={{ user: mockUser }}>
          <WorkoutContext.Provider
            value={{ workouts: mockWorkouts.resultsOnPage }}
          >
            <Home />
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
      const addWorkoutBtn = await screen.findByLabelText(/buff it up/i);
      await user.click(addWorkoutBtn);
      expect(WorkoutForm).toHaveBeenCalled();
    });

});


 