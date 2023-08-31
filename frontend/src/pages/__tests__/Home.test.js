import React from 'react';
import { render, screen, cleanup } from "@testing-library/react";
import user from "@testing-library/user-event";
import { jest } from "@jest/globals"
import { genSampleWorkouts } from '../../utils/test/genSampleWorkouts';
import Home from "../Home";
import Search from '../../components/Search';
import { Chart } from '../../components/Chart';
import { ChartPlaceholder } from '../../components/ChartPlaceholder';
import Pagination from '../../components/Pagination';
import WorkoutDetails from '../../components/WorkoutDetails';
import WorkoutForm from '../../components/WorkoutForm';
import { Provider } from 'react-redux';
import store from '../../redux/store';


jest.mock('../../components/ChartPlaceholder')
jest.mock('../../components/Chart')
jest.mock("../../components/WorkoutDetails");
jest.mock("../../components/Pagination");
jest.mock("../../components/WorkoutForm");
jest.mock("../../components/Search");
jest.mock("../../hooks/useSearch", () => ({
  useSearch: () => {
       return {
           search: () => {}
       };
  }
        
}));

let mockWorkouts;
let dispatch;

beforeAll(() => {
  mockWorkouts = genSampleWorkouts();
  dispatch = store.dispatch;
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  jest.clearAllMocks();
  mockWorkouts = null;
  dispatch = null
});

describe("<Home />", () => {
    it("should render Home page correctly given that user is authenticated", async () => {
      await dispatch({type: "LOGIN_SUCCESS", payload: {}});
      await dispatch({type: "SET_WORKOUTS_SUCCESS", payload: mockWorkouts});
      render(
        <Provider store={store}>
            <Home />
        </Provider>
      );
      const addWorkoutBtn = await screen.findByLabelText(/buff it up/i);
      const workouts = await screen.findByLabelText("workouts");
      expect(Search).toHaveBeenCalled();
      expect(Chart).toHaveBeenCalled();
      expect(Pagination).toHaveBeenCalled();
      expect(WorkoutDetails).toHaveBeenCalled();
      expect(addWorkoutBtn).toBeInTheDocument();
      expect(workouts).toBeInTheDocument();
      dispatch({type: "LOGOUT"});
    });

    it("should render WorkoutForm component when user clicks on 'Buff it up' button", async () => {
      user.setup();
      render(
        <Provider store={store}>
            <Home />
        </Provider>
      );
      const addWorkoutBtn = await screen.findByLabelText(/buff it up/i);
      await user.click(addWorkoutBtn);
      expect(WorkoutForm).toHaveBeenCalled();
    });

});


 