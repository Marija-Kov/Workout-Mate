import React from "react";
import EditWorkout from "../EditWorkout";
import user from "@testing-library/user-event";
import { render, screen, act } from "@testing-library/react"; 
import { rest } from "msw";
import { server } from "../../mocks/server";
import { Provider } from "react-redux";
import store from "../../redux/store";

let dispatch;
let mockPrepopulatedForm;

beforeAll(() => {
  dispatch = store.dispatch;
  mockPrepopulatedForm = {
    id: "mockId",
    prevTitle: "deadlifts",
    prevMuscleGroup: "glute",
    prevLoad: 40,
    prevReps: 10
  }
})

beforeEach(() => {
  dispatch({type: "LOGIN_SUCCESS", payload: {}})
  dispatch({type: "SHOW_EDIT_WORKOUT_FORM", payload: mockPrepopulatedForm})
});

afterEach(() => {
  dispatch({type: "SHOW_EDIT_WORKOUT_FORM"})
  act(() => dispatch({type: "LOGOUT"}));
});

afterAll(() => {
  dispatch = null
  mockPrepopulatedForm = null
})

describe("<EditWorkout/>", () => {
  it("should render prepopulated Edit workout form given that user is authenticated", async () => {
  render(
    <Provider store={store}>
      <EditWorkout />
    </Provider> 
  );
  const titleInput = await screen.findByLabelText(/workout title/i);
  const muscleGroupSelect = await screen.findByLabelText(/muscle group/i);
  const repsInput = await screen.findByLabelText(/number of reps/i);
  const loadInput = await screen.findByLabelText(/load in kg/i);
  const closeForm = await screen.findByLabelText(/close form/i);
  const submit = await screen.findByLabelText(
    /submit edited workout/i
  );
  expect(titleInput).toBeInTheDocument();
  expect(titleInput).toHaveValue(mockPrepopulatedForm.prevTitle);
  expect(muscleGroupSelect).toBeInTheDocument();
  const prevMuscleGroupLen = mockPrepopulatedForm.prevMuscleGroup.length;
  const topMuscleGroupOption = muscleGroupSelect.textContent.slice(0, prevMuscleGroupLen);
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
     const titleInput = await screen.findByLabelText(/workout title/i);
     const muscleGroupSelect = await screen.findByLabelText(/muscle group/i);
     const repsInput = await screen.findByLabelText(/number of reps/i);
     const loadInput = await screen.findByLabelText(/load in kg/i);
     const closeForm = await screen.findByLabelText(/close form/i);
     const submit = await screen.findByLabelText(
       /submit edited workout/i
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
    expect(submit).toHaveFocus();
  });

  it("should update input value when user types", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <EditWorkout />
      </Provider> 
    );
    const titleInput = await screen.findByLabelText(/workout title/i);
    const muscleGroupSelect = await screen.findByLabelText(/muscle group/i);
    const repsInput = await screen.findByLabelText(/number of reps/i);
    const loadInput = await screen.findByLabelText(/load in kg/i);
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

  it("should submit updated input fields given that user is authenticated", async () => {
    server.use(
      rest.patch(`${process.env.REACT_APP_API}/api/workouts/*`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            title: "deadlifts",
            reps: 30,
            load: 15,
          })
        );
      })
    )
    user.setup();
    render(
      <Provider store={store}>
        <EditWorkout />
      </Provider> 
    );
    const titleInput = await screen.findByLabelText(/workout title/i);
    const repsInput = await screen.findByLabelText(/number of reps/i);
    const loadInput = await screen.findByLabelText(/load in kg/i);
    const submit = await screen.findByLabelText(/submit edited workout/i);
    await user.clear(titleInput);
    await user.type(titleInput, "  ");
    await user.clear(repsInput);
    await user.type(repsInput, "30");
    await user.clear(loadInput);
    await user.type(loadInput, "15");
    await user.click(submit); // TODO: Test fails at this point, fix it.
    const error = screen.queryAllByRole("alert");
    expect(error.length).toEqual(0);
  });

  it("should respond with error message if authentication token expired and user attempts to submit", async () => {
    server.use(
      rest.patch(`${process.env.REACT_APP_API}/api/workouts/*`, (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ error: "Not authorized, token expired."})
        );
      })
    );
    user.setup();
    render(
      <Provider store={store}>
        <EditWorkout />
      </Provider> 
    );
    const titleInput = await screen.findByLabelText(/workout title/i);
    const repsInput = await screen.findByLabelText(/number of reps/i);
    const loadInput = await screen.findByLabelText(/load in kg/i);
    const submit = await screen.findByLabelText(
      /submit edited workout/i
    );
    await user.clear(titleInput);
    await user.type(titleInput, "arm curls");
    await user.clear(repsInput);
    await user.type(repsInput, "30");
    await user.clear(loadInput);
    await user.type(loadInput, "15");
    await act(() => dispatch({type: "LOGOUT"}));
    await user.click(submit);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute("class", "error");
    expect(error.textContent).toMatch(/must be logged in/i);
  });

});