import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../../test/mocks/server";
import Home from "./Home";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("<Home />", () => {
  const url = import.meta.env.VITE_API || "http://localhost:6060";

  beforeAll(() => {
    vi.mock("react-chartjs-2");
    store.dispatch({
      type: "LOGIN",
      payload: { username: "user", profileImg: "profileImg" },
    });
  });

  beforeEach(() => {});

  afterEach(() => {
    store.dispatch({ type: "RESET_WORKOUTS_STATE" });
    store.dispatch({ type: "RESET_COMPONENTS_STATE" });
  });

  afterAll(() => {
    store.dispatch({ type: "LOGOUT" });
    vi.clearAllMocks();
  });

  it("should render placeholders for workouts and chart", async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    const workoutsPlaceholder = screen.getByLabelText("loading workouts");
    const chartPlaceholder = screen.getByLabelText("chart placeholder");
    expect(workoutsPlaceholder).toBeInTheDocument();
    expect(chartPlaceholder).toBeInTheDocument();
    expect(workoutsPlaceholder).toHaveClass("workouts--placeholder");
    expect(chartPlaceholder).toHaveClass("chart--placeholder");
  });

  it("should render Home page correctly if the user has not posted yet", async () => {
    server.use(
      http.get(`${url}/api/workouts/*`, () => {
        return HttpResponse.json(
          {
            chunk: [],
            allMuscleGroups: [],
            foundCount: 0,
            limit: 3,
            noneFound: true,
          },
          { status: 200 }
        );
      })
    );
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    const addWorkoutBtn = await screen.findByText(/buff it up/i);
    expect(addWorkoutBtn).toBeInTheDocument();
    expect(addWorkoutBtn).toHaveClass("no--workouts--yet");
  });

  it("should render Home page correctly if the user has posted workouts", async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    const workouts = await screen.findAllByTestId("workout-details");
    const chart = await screen.findByText(/routine balance/i);
    const searchBar = await screen.findByTestId("search-form");
    const addWorkoutBtn = await screen.findByText(/buff it up/i);
    expect(workouts.length).toBeTruthy();
    expect(chart).toBeInTheDocument();
    expect(searchBar).toBeInTheDocument();
    expect(addWorkoutBtn).toBeInTheDocument();
    expect(addWorkoutBtn).toHaveClass("add--workout");
  });

  it("should render 'no workouts found by query' if no workouts were found by query", async () => {
    server.use(
      http.get(`${url}/api/workouts/*`, () => {
        return HttpResponse.json({
          chunk: [],
          allMuscleGroups: ["leg", "ab"],
          foundCount: 0,
          limit: 3,
          noneFound: "no workouts found by query",
        });
      })
    );
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    const noWorkoutsMessage = await screen.findByTestId("no-workouts");
    expect(noWorkoutsMessage).toBeInTheDocument();
    expect(noWorkoutsMessage).toHaveClass("no--workouts--found");
  });

  it("should render WorkoutForm component when the user clicks on 'Buff it up' button", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    const addWorkoutBtn = await screen.findByText(/buff it up/i);
    await user.click(addWorkoutBtn);
    const workoutForm = await screen.findByText(/new workout/i);
    expect(workoutForm).toBeInTheDocument();
  });

  it("should render EditWorkout when the user clicks on 'edit' button on a workout card", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    const workoutsEditButtons = await screen.findAllByText("edit");
    expect(workoutsEditButtons.length).toBeTruthy();
    await user.click(workoutsEditButtons[0]);
    const editWorkoutForm = await screen.findByTestId("edit-workout-form");
    expect(editWorkoutForm).toBeInTheDocument();
  });
});
