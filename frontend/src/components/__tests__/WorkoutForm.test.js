import WorkoutForm from "../WorkoutForm";
import user from "@testing-library/user-event";
import { render, screen, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { Provider } from "react-redux"
import store from "../../redux/store"; 

let dispatch;
let mockUser = {
  id: "userid",
  email: "keech@mail.yu",
  token: "authorizationToken",
  username: undefined,
  profileImg: undefined,
  tokenExpires: Date.now() + 3600000,
};

beforeAll(() => {
  dispatch = store.dispatch
})

afterAll(() => {
  dispatch = null;
  mockUser = null
})

describe("<WorkoutForm/>", () => {
  it("should render Workout form given that user is authenticated", async () => {
          render(
            <Provider store={store}>
                <WorkoutForm />
            </Provider>
          );
      const workoutForm = await screen.findByLabelText(/workout form/i);
      const titleInput = await screen.findByLabelText(/workout title/i);
      const muscleGroupSelect = await screen.findByLabelText(/muscle group/i);
      const repsInput = await screen.findByLabelText(/number of reps/i);
      const loadInput = await screen.findByLabelText(/load in kg/i);
      const closeForm = await screen.findByLabelText(/close form/i);
      const submitWorkoutBtn = await screen.findByLabelText(/submit workout button/i);
      expect(workoutForm).toBeInTheDocument();
      expect(titleInput).toBeInTheDocument();
      expect(muscleGroupSelect).toBeInTheDocument();
      expect(repsInput).toBeInTheDocument();
      expect(loadInput).toBeInTheDocument();
      expect(submitWorkoutBtn).toBeInTheDocument();
      expect(closeForm).toBeInTheDocument();
  });

  it("should focus input fields in the right order", async () => {
    user.setup();
    render(
      <Provider store={store}>
          <WorkoutForm />
      </Provider>
    );
     const titleInput = await screen.findByLabelText(/workout title/i);
     const muscleGroupSelect = await screen.findByLabelText(/muscle group/i);
     const repsInput = await screen.findByLabelText(/number of reps/i);
     const loadInput = await screen.findByLabelText(/load in kg/i);
     const closeForm = await screen.findByLabelText(/close form/i);
     const submitWorkoutBtn = await screen.findByLabelText(
       /submit workout button/i
     );
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
    expect(submitWorkoutBtn).toHaveFocus();
  });

  it("should update input/select value when user types/selects", async () => {
    user.setup();
    render(
      <Provider store={store}>
          <WorkoutForm />
      </Provider>
    );
    const titleInput = await screen.findByLabelText(/workout title/i);
    const muscleGroupSelect = await screen.findByLabelText(/muscle group/i);
    const repsInput = await screen.findByLabelText(/number of reps/i);
    const loadInput = await screen.findByLabelText(/load in kg/i);
    await user.type(titleInput, "squats");
    await user.selectOptions(muscleGroupSelect, "leg");
    await user.type(repsInput, "30");
    await user.type(loadInput, "22");
    expect(titleInput).toHaveValue("squats");
    expect(muscleGroupSelect).toHaveValue("leg");
    expect(repsInput).toHaveValue(30);
    expect(loadInput).toHaveValue(22);
  });

  it("should signal input error when user attempts to submit form with invalid input value(s)", async () => {
    server.use(
      rest.post(`${process.env.REACT_APP_API}/api/workouts`, (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            error: "Please fill out the empty fields"
          })
        );
      })
    );
    user.setup();
    dispatch({type: "LOGIN_SUCCESS", payload: mockUser})
    dispatch({type: "SET_WORKOUTS", payload: []})
    render(
      <Provider store={store}>
          <WorkoutForm />
      </Provider>
    );
    let titleInput = await screen.findByLabelText(/workout title/i);
    let muscleGroupSelect = await screen.findByLabelText(/muscle group/i);
    let repsInput = await screen.findByLabelText(/number of reps/i);
    let loadInput = await screen.findByLabelText(/load in kg/i);
    const submitWorkoutBtn = await screen.findByLabelText(
      /submit workout button/i
    );
    await user.type(titleInput, "squats");
    await user.selectOptions(muscleGroupSelect, "");
    await user.type(repsInput, " ");
    await user.type(loadInput, "22");
    await user.click(submitWorkoutBtn);
    titleInput = await screen.findByLabelText(/workout title/i);
    muscleGroupSelect = await screen.findByLabelText(/muscle group/i);
    repsInput = await screen.findByLabelText(/number of reps/i);
    loadInput = await screen.findByLabelText(/load in kg/i);
    expect(titleInput).not.toHaveAttribute("class", "error");
    expect(muscleGroupSelect).toHaveAttribute("class", "error");
    expect(repsInput).toHaveAttribute("class", "error");
    expect(loadInput).not.toHaveAttribute("class", "error");
    const error = await screen.findByRole("alert");
    expect(error.textContent).toMatch(/please fill out the empty fields/i);
    expect(error).toHaveAttribute("class", "error");
    act(() => dispatch({type: "LOGOUT"}));
  });

  it("should respond with error message if authentication token expired and user attempts to submit", async () => {
    server.use(
      rest.post(`${process.env.REACT_APP_API}/api/workouts`, (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({
            error: "Not authorized"
          })
        );
      })
    );
    user.setup();
    render(
      <Provider store={store}>
          <WorkoutForm />
      </Provider>
    );
    const titleInput = await screen.findByLabelText(/workout title/i);
    const muscleGroupSelect = await screen.findByLabelText(/muscle group/i);
    const repsInput = await screen.findByLabelText(/number of reps/i);
    const loadInput = await screen.findByLabelText(/load in kg/i);
    const submitWorkoutBtn = await screen.findByLabelText(
      /submit workout button/i
    );
    await user.type(titleInput, "arm curls");
    await user.selectOptions(muscleGroupSelect, "biceps");
    await user.type(repsInput, "33");
    await user.type(loadInput, "20");
    await user.click(submitWorkoutBtn);
    const error = await screen.findByRole("alert");
    expect(error.textContent).toMatch(/not authorized/i);
    expect(error).toHaveAttribute("class", "error"); 
    act(() => dispatch({type: "LOGOUT"}));
  });

  it("should not respond with error when user submits form with valid input", async () => {
    user.setup();
    dispatch({type: "LOGIN_SUCCESS", payload: mockUser})
    render(
      <Provider store={store}>
          <WorkoutForm />
      </Provider>
    );
    const titleInput = await screen.findByLabelText(/workout title/i);
    const muscleGroupSelect = await screen.findByLabelText(/muscle group/i);
    const repsInput = await screen.findByLabelText(/number of reps/i);
    const loadInput = await screen.findByLabelText(/load in kg/i);
    const submitWorkoutBtn = await screen.findByLabelText(
      /submit workout button/i
    );
    await user.type(titleInput, "arm curls");
    await user.selectOptions(muscleGroupSelect, "biceps");
    await user.type(repsInput, "33");
    await user.type(loadInput, "20");
    let state = store.getState();
    expect(state.workout.workouts.total).toBe(0);
    await user.click(submitWorkoutBtn);
    const error = screen.queryAllByRole("alert");
    expect(error.length).toBe(0);
    state = store.getState();
    expect(state.workout.workouts.total).toBe(1);
    act(() => dispatch({type: "DELETE_ALL_WORKOUTS_SUCCESS"}))
    act(() => dispatch({type: "SET_ROUTINE_BALANCE", payload: []}))
    act(() => dispatch({type: "LOGOUT"}));
  })

});
