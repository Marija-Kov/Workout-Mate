import { render, screen, act } from "@testing-library/react";
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
import EditWorkout from "../../components/EditWorkout";
import { WorkoutsPlaceholder } from '../../components/WorkoutsPlaceholder';
import { Provider } from 'react-redux';
import store from '../../redux/store';

jest.mock('../../components/ChartPlaceholder')
jest.mock('../../components/Chart')
jest.mock("../../components/WorkoutDetails");
jest.mock("../../components/WorkoutsPlaceholder");
jest.mock("../../components/Pagination");
jest.mock("../../components/WorkoutForm");
jest.mock("../../components/EditWorkout");
jest.mock("../../components/Search");
jest.mock("../../hooks/useSearch", () => ({
  useSearch: () => {
       return {
           search: () => {}
       };
  }
        
}));

afterAll(() => {
  jest.clearAllMocks();
});

describe("<Home />", () => {
    it("should render Home page correctly given that user is authenticated", async () => {
      genSampleWorkouts();
      render(
        <Provider store={store}>
          <Home />
        </Provider>
      );
      const addWorkoutBtn = await screen.findByLabelText(/buff it up/i);
      const workouts = await screen.findByLabelText("workouts");
      expect(Search).toHaveBeenCalled();
      expect(Pagination).toHaveBeenCalled();
      expect(WorkoutDetails).toHaveBeenCalled();
      expect(Chart).toHaveBeenCalled();
      expect(addWorkoutBtn).toBeInTheDocument();
      expect(workouts).toBeInTheDocument();
    });
    //TODO: It should show placeholders while the workouts are still loading
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

    it("should render EditWorkout", async () => {
      let dispatch = store.dispatch;
      render(
        <Provider store={store}>
            <Home />
        </Provider>
      );
      await act(() => dispatch({type: "SHOW_EDIT_WORKOUT_FORM"}));
      expect(EditWorkout).toHaveBeenCalled();
    })

});

