import { render, screen } from "@testing-library/react";
import { act } from "react";
import user from "@testing-library/user-event";
import { jest } from "@jest/globals";
import { genSampleWorkouts } from "../../utils/test/genSampleWorkouts";
import Home from "../Home";
import Search from "../../components/Search";
import Chart from "../../components/Chart";
import { ChartPlaceholder } from "../../components/ChartPlaceholder";
import Pagination from "../../components/Pagination";
import WorkoutDetails from "../../components/WorkoutDetails";
import WorkoutForm from "../../components/WorkoutForm";
import EditWorkout from "../../components/EditWorkout";
import { WorkoutsPlaceholder } from "../../components/WorkoutsPlaceholder";
import { Provider } from "react-redux";
import store from "../../redux/store";

jest.mock("../../components/ChartPlaceholder");
jest.mock("../../components/Chart");
jest.mock("../../components/WorkoutDetails");
jest.mock("../../components/WorkoutsPlaceholder");
jest.mock("../../components/Pagination");
jest.mock("../../components/WorkoutForm");
jest.mock("../../components/EditWorkout");
jest.mock("../../components/Search");
jest.mock("../../hooks/useSearch", () => ({
  useSearch: () => {
    return {
      search: () => {},
    };
  },
}));

afterEach(() => {
  store.dispatch({ type: "RESET_WORKOUTS_STATE" });
});

afterAll(() => {
  jest.clearAllMocks();
});

describe("<Home />", () => {
  it("should render placeholders while workouts are loading", async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    act(() => store.dispatch({ type: "SET_LOADER" }));
    const state = store.getState();
    expect(state.loader).toBeTruthy();
    expect(ChartPlaceholder).toHaveBeenCalled();
    expect(WorkoutsPlaceholder).toHaveBeenCalled();
  });

  it("should render Home page correctly given that user has not posted yet", async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    await act(() =>
      store.dispatch({
        type: "SET_WORKOUTS",
        payload: {
          total: 0,
          limit: 3,
          allUserWorkoutsMuscleGroups: [],
          workoutsChunk: [],
          pageSpread: [1],
          noWorkoutsByQuery: false,
        },
      })
    );
    const addWorkoutBtn = await screen.findByText(/buff it up/i);
    expect(addWorkoutBtn).toBeInTheDocument();
    expect(addWorkoutBtn).toHaveClass("no--workouts--yet");
  });

  it("should render Home page correctly given that user has posted workouts", async () => {
    genSampleWorkouts();
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    const addWorkoutBtn = await screen.findByText(/buff it up/i);
    const workouts = await screen.findByLabelText("workouts");
    expect(Search).toHaveBeenCalled();
    expect(Pagination).toHaveBeenCalled();
    expect(WorkoutDetails).toHaveBeenCalled();
    expect(Chart).toHaveBeenCalled();
    expect(addWorkoutBtn).toBeInTheDocument();
    expect(workouts).toBeInTheDocument();
  });

  it("should render 'no workouts found by query' given that no workouts were found by query", async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    await act(() =>
      store.dispatch({
        type: "SET_WORKOUTS",
        payload: {
          total: 0,
          limit: 3,
          allUserWorkoutsMuscleGroups: ["leg", "ab"],
          workoutsChunk: [],
          pageSpread: [1],
          noWorkoutsByQuery: "no workouts found by query",
        },
      })
    );
    const noWorkoutsMessage = await screen.findByText(
      /no workouts found by query/i
    );
    expect(noWorkoutsMessage).toBeInTheDocument();
    expect(noWorkoutsMessage).toHaveClass("no--workouts--found");
  });

  it("should render WorkoutForm component when user clicks on 'Buff it up' button", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    await act(() =>
      store.dispatch({
        type: "SET_WORKOUTS",
        payload: {
          total: 0,
          limit: 3,
          allUserWorkoutsMuscleGroups: [],
          workoutsChunk: [],
          pageSpread: [1],
          noWorkoutsByQuery: false,
        },
      })
    );
    const addWorkoutBtn = await screen.findByText(/buff it up/i);
    await user.click(addWorkoutBtn);
    expect(WorkoutForm).toHaveBeenCalled();
  });

  it("should render EditWorkout", async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    await act(() => store.dispatch({ type: "TOGGLE_MOUNT_EDIT_WORKOUT_FORM" }));
    expect(EditWorkout).toHaveBeenCalled();
  });
});
