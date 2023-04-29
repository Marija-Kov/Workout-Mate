import React from "react";
import EditWorkout from "../EditWorkout";
import user from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { AuthContext } from "../../context/AuthContext";
import { WorkoutContext } from "../../context/WorkoutContext";
import { rest } from "msw";
import { server } from "../../mocks/server";

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


describe("<EditWorkout/>", () => {
  it("should render Edit workout form given that user is authenticated", async () => {
  render(
    <AuthContext.Provider value={{ user: mockUser }}>
      <WorkoutContext.Provider value={{ workouts: mockWorkouts }}>
        <EditWorkout />
      </WorkoutContext.Provider>
    </AuthContext.Provider>
  );
  const workoutForm = await screen.findByLabelText(/edit workout form/i);
  const titleInput = await screen.findByLabelText(/workout title/i);
  const repsInput = await screen.findByLabelText(/number of reps/i);
  const loadInput = await screen.findByLabelText(/load in kg/i);
  const closeForm = await screen.findByLabelText(/close form/i);
  const submitEditedWorkoutBtn = await screen.findByLabelText(
    /submit edited workout/i
  );
  expect(workoutForm).toBeInTheDocument();
  expect(titleInput).toBeInTheDocument();
  expect(repsInput).toBeInTheDocument();
  expect(loadInput).toBeInTheDocument();
  expect(submitEditedWorkoutBtn).toBeInTheDocument();
  expect(closeForm).toBeInTheDocument();
  });

  it("should focus input fields in the right order", async () => {
        user.setup();
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <WorkoutContext.Provider value={{ workouts: mockWorkouts }}>
          <EditWorkout />
        </WorkoutContext.Provider>
      </AuthContext.Provider>
    );
     const titleInput = await screen.findByLabelText(/workout title/i);
     const repsInput = await screen.findByLabelText(/number of reps/i);
     const loadInput = await screen.findByLabelText(/load in kg/i);
     const closeForm = await screen.findByLabelText(/close form/i);
     const submitEditedWorkoutBtn = await screen.findByLabelText(
       /submit edited workout/i
     );
    await user.tab();
    expect(closeForm).toHaveFocus();
    await user.tab();
    expect(titleInput).toHaveFocus();
    await user.tab();
    expect(repsInput).toHaveFocus();
    await user.tab();
    expect(loadInput).toHaveFocus();
    await user.tab();
    expect(submitEditedWorkoutBtn).toHaveFocus();
  });

  it("should update input value when user types", async () => {
    user.setup();
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <WorkoutContext.Provider value={{ workouts: mockWorkouts }}>
          <EditWorkout />
        </WorkoutContext.Provider>
      </AuthContext.Provider>
    );
    const titleInput = await screen.findByLabelText(/workout title/i);
    const repsInput = await screen.findByLabelText(/number of reps/i);
    const loadInput = await screen.findByLabelText(/load in kg/i);
    await user.type(titleInput, "squats");
    await user.type(repsInput, "30");
    await user.type(loadInput, "22");
    expect(titleInput).toHaveValue("squats");
    expect(repsInput).toHaveValue(30);
    expect(loadInput).toHaveValue(22);
  });

  it("should respond with error message when user attempts to submit edit form with invalid input value(s)", async () => {
    user.setup();
    server.use(
      rest.patch("/api/workouts/*", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
           error: "Invalid input"
          })
        );
      })
    );
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <WorkoutContext.Provider value={{ workouts: mockWorkouts }}>
          <EditWorkout />
        </WorkoutContext.Provider>
      </AuthContext.Provider>
    );
    const titleInput = await screen.findByLabelText(/workout title/i);
    const submitEditedWorkoutBtn = await screen.findByLabelText(
      /submit edited workout/i
    );
    await user.type(titleInput, "arm curls");
    await user.click(submitEditedWorkoutBtn);
    const error = await screen.findByRole("alert");
    expect(error).toHaveAttribute("class", "error");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/empty fields/i);
  });

  it("should not show error on submit given that all input values are valid", async () => {
    user.setup();
    render(
      <AuthContext.Provider value={{ user: mockUser, dispatch: () => {} }}>
        <WorkoutContext.Provider value={{ workouts: mockWorkouts, dispatch: () => {} }}>
          <EditWorkout showEdit={()=>{}}/>
        </WorkoutContext.Provider>
      </AuthContext.Provider>
    );
    const titleInput = await screen.findByLabelText(/workout title/i);
    const repsInput = await screen.findByLabelText(/number of reps/i);
    const loadInput = await screen.findByLabelText(/load in kg/i);
    const submitEditedWorkoutBtn = await screen.findByLabelText(
      /submit edited workout/i
    );
    await user.type(titleInput, "arm curls");
    await user.type(repsInput, "30");
    await user.type(loadInput, "15");
    await user.click(submitEditedWorkoutBtn);
    const error = screen.queryAllByRole("alert");
    expect(error.length).toBe(0);
  });

  it("should respond with error message if authentication token expired and user attempts to submit", async () => {
    server.use(
      rest.patch("/api/workouts/*", (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ error: "Not authorized, token expired."})
        );
      })
    );
    user.setup();
    render(
      <AuthContext.Provider value={{ user: undefined }}>
        <WorkoutContext.Provider value={{ workouts: undefined }}>
          <EditWorkout />
        </WorkoutContext.Provider>
      </AuthContext.Provider>
    );
    const titleInput = await screen.findByLabelText(/workout title/i);
    const repsInput = await screen.findByLabelText(/number of reps/i);
    const loadInput = await screen.findByLabelText(/load in kg/i);
    const submitEditedWorkoutBtn = await screen.findByLabelText(
      /submit edited workout/i
    );
    await user.type(titleInput, "arm curls");
    await user.type(repsInput, "30");
    await user.type(loadInput, "15");
    await user.click(submitEditedWorkoutBtn);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute("class", "error");
    expect(error.textContent).toMatch(/must be logged in/i);
  });

});