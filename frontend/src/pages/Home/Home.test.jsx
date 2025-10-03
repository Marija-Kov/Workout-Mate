import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { genSampleWorkouts } from "../../utils/test/genSampleWorkouts";
import Home from "../pages";
import {
  Search,
  Chart,
  ChartPlaceholder,
  Pagination,
  WorkoutDetails,
  WorkoutForm,
  EditWorkout,
  WorkoutsPlaceholder,
} from "../../components";
import { Provider } from "react-redux";
import store from "../../redux/store";

vi.mock("../../components/ChartPlaceholder");
vi.mock("../../components/Chart");
vi.mock("../../components/WorkoutDetails");
vi.mock("../../components/WorkoutsPlaceholder");
vi.mock("../../components/Pagination");
vi.mock("../../components/WorkoutForm");
vi.mock("../../components/EditWorkout");
vi.mock("../../components/Search", () => {
  return {
    default: vi.mock(),
  };
});
vi.mock("../../hooks/useSearch", () => ({
  useSearch: () => {
    return {
      search: vi.mock(),
    };
  },
}));

afterEach(() => {
  store.dispatch({ type: "RESET_WORKOUTS_STATE" });
});

afterAll(() => {
  vi.clearAllMocks();
});

describe("<Home />", () => {
  it("should render placeholders for workouts and chart", async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    store.dispatch({ type: "SET_WORKOUTS_LOADER" });
    store.dispatch({ type: "SET_CHART_LOADER" });
    const state = store.getState();
    expect(state.loader.workouts).toBeTruthy();
    expect(state.loader.chart).toBeTruthy();
    expect(ChartPlaceholder).toHaveBeenCalled();
    expect(WorkoutsPlaceholder).toHaveBeenCalled();
  });

  it("should render Home page correctly given that user has not posted yet", async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
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
    });
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
    });
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
    });
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
    store.dispatch({ type: "TOGGLE_MOUNT_EDIT_WORKOUT_FORM" });
    expect(EditWorkout).toHaveBeenCalled();
  });
});
