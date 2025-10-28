import EditWorkout from "./EditWorkout";
import App from "../../mocks/App";
import user from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("<EditWorkout/>", () => {
  const mockPrepopulatedForm = {
    id: "mockId",
    prevTitle: "deadlifts",
    prevMuscleGroup: "glute",
    prevLoad: 40,
    prevReps: 10,
  };

  beforeEach(() => {
    store.dispatch({ type: "LOGIN", payload: {} });
    store.dispatch({
      type: "TOGGLE_MOUNT_EDIT_WORKOUT_FORM",
      payload: mockPrepopulatedForm,
    });
  });

  afterEach(() => {
    store.dispatch({ type: "RESET_COMPONENTS_STATE" });
    store.dispatch({ type: "LOGOUT" });
  });

  it("should render prepopulated Edit workout form given that user is authenticated", () => {
    render(
      <Provider store={store}>
        <EditWorkout />
      </Provider>
    );
    const titleInput = screen.getByTestId("title");
    const muscleGroupSelect = screen.getByTestId("muscle_group");
    const repsInput = screen.getByTestId("reps");
    const loadInput = screen.getByTestId("load");
    const closeForm = screen.getByText(/close/i);
    const submit = screen.getByText(/save/i);
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue(mockPrepopulatedForm.prevTitle);
    expect(muscleGroupSelect).toBeInTheDocument();
    const prevMuscleGroupLen = mockPrepopulatedForm.prevMuscleGroup.length;
    const topMuscleGroupOption = muscleGroupSelect.textContent.slice(
      0,
      prevMuscleGroupLen
    );
    expect(topMuscleGroupOption).toBe(mockPrepopulatedForm.prevMuscleGroup);
    expect(repsInput).toBeInTheDocument();
    expect(repsInput).toHaveValue(mockPrepopulatedForm.prevReps);
    expect(loadInput).toBeInTheDocument();
    expect(loadInput).toHaveValue(mockPrepopulatedForm.prevLoad);
    expect(submit).toBeInTheDocument();
    expect(closeForm).toBeInTheDocument();
  });

  it("should focus input fields in the right order", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <EditWorkout />
      </Provider>
    );
    const titleInput = screen.getByTestId("title");
    const muscleGroupSelect = screen.getByTestId("muscle_group");
    const repsInput = screen.getByTestId("reps");
    const loadInput = screen.getByTestId("load");
    const closeForm = screen.getByText(/close/i);
    const submit = screen.getByText(/save/i);
    await user.tab();
    expect(closeForm).toHaveFocus();
    await user.tab();
    expect(titleInput).toHaveFocus();
    await user.tab();
    expect(muscleGroupSelect).toHaveFocus();
    await user.tab();
    expect(repsInput).toHaveFocus();
    await user.tab();
    expect(loadInput).toHaveFocus();
    await user.tab();
    expect(submit).toHaveFocus();
  });

  it("should update input value when user types", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <EditWorkout />
      </Provider>
    );
    const titleInput = screen.getByTestId("title");
    const muscleGroupSelect = screen.getByTestId("muscle_group");
    const repsInput = screen.getByTestId("reps");
    const loadInput = screen.getByTestId("load");
    await user.clear(titleInput);
    await user.type(titleInput, "squats");
    await user.selectOptions(muscleGroupSelect, "leg");
    await user.clear(repsInput);
    await user.type(repsInput, "30");
    await user.clear(loadInput);
    await user.type(loadInput, "22");
    expect(titleInput).toHaveValue("squats");
    expect(repsInput).toHaveValue(30);
    expect(loadInput).toHaveValue(22);
  });

  it("should respond with error message if authentication token expired and user attempts to submit", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <EditWorkout />
      </Provider>
    );
    const titleInput = screen.getByTestId("title");
    const repsInput = screen.getByTestId("reps");
    const loadInput = screen.getByTestId("load");
    const submit = screen.getByText(/save/i);
    await user.clear(titleInput);
    await user.type(titleInput, "arm curls");
    await user.clear(repsInput);
    await user.type(repsInput, "30");
    await user.clear(loadInput);
    await user.type(loadInput, "15");
    await store.dispatch({ type: "LOGOUT" });
    await user.click(submit);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/not authorized/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should signal input error when user attempts to submit form with too long title", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <EditWorkout />
      </Provider>
    );
    let titleInput = screen.getByTestId("title");
    const submit = screen.getByText(/save/i);
    await user.clear(titleInput);
    await user.type(
      titleInput,
      "adasdaasdsdfsdfdddfdfsdfsfsdfsfddsfsfsfsdfterttrteefrfwfwfwefwefweffefwe"
    );
    await user.click(submit);
    titleInput = await screen.findByTestId("title");
    expect(titleInput).toHaveAttribute("class", "error");
    const error = await screen.findByRole("alert");
    expect(error.textContent).toMatch(/max 30 characters/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should signal input error when user attempts to submit form with title containing non-alphabetic characters", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <EditWorkout />
      </Provider>
    );
    let titleInput = screen.getByTestId("title");
    const submit = screen.getByText(/save/i);
    await user.clear(titleInput);
    await user.type(titleInput, "66768^&^*&%<>*");
    await user.click(submit);
    titleInput = await screen.findByTestId("title");
    expect(titleInput).toHaveAttribute("class", "error");
    const error = await screen.findByRole("alert");
    expect(error.textContent).toMatch(/may contain only letters/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should signal input error when user attempts to submit form with too large reps number", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <EditWorkout />
      </Provider>
    );
    let repsInput = screen.getByTestId("reps");
    const submit = screen.getByText(/save/i);
    await user.clear(repsInput);
    await user.type(repsInput, "23848394829");
    await user.click(submit);
    repsInput = await screen.findByTestId("reps");
    expect(repsInput).toHaveAttribute("class", "error");
    const error = await screen.findByRole("alert");
    expect(error.textContent).toMatch(/reps value too large/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should signal input error when user attempts to submit form with too large load number", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <EditWorkout />
      </Provider>
    );
    let loadInput = screen.getByTestId("load");
    const submit = screen.getByText(/save/i);
    await user.clear(loadInput);
    await user.type(loadInput, "284738378");
    await user.click(submit);
    loadInput = await screen.findByTestId("load");
    expect(loadInput).toHaveAttribute("class", "error");
    const error = await screen.findByRole("alert");
    expect(error.textContent).toMatch(/load value too large/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should submit updated input fields given that input is valid", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <EditWorkout />
      </Provider>
    );
    await store.dispatch({
      type: "SET_WORKOUTS",
      payload: {
        chunk: [
          { muscle_group: "leg" },
          { muscle_group: "back" },
          { muscle_group: "biceps" },
        ],
        allMuscleGroups: ["biceps", "back", "leg"],
      },
    });
    let loadInput = screen.getByTestId("reps");
    const submit = screen.getByText(/save/i);
    await user.clear(loadInput);
    await user.type(loadInput, "30");
    await user.clear(loadInput);
    await user.type(loadInput, "15");
    await user.click(submit);
    const success = await screen.findByRole("alert");
    expect(success).toBeInTheDocument();
    expect(success.textContent).toMatch(/successfully updated workout/i);
    expect(success).toHaveAttribute("class", "success flashMessage");
  });
});
