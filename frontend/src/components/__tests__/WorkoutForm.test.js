import WorkoutForm from "../WorkoutForm";
import user from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { AuthContext } from "../../context/AuthContext";
import { WorkoutContext } from "../../context/WorkoutContext";

describe("<WorkoutForm/>", () => {
  it("should render Workout form given that user is authenticated", async () => {
          render(
            <AuthContext.Provider value={{ user: {} }}>
              <WorkoutContext.Provider value={{ workouts: [] }}>
                <WorkoutForm />
              </WorkoutContext.Provider>
            </AuthContext.Provider>
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
      <AuthContext.Provider value={{ user: {} }}>
        <WorkoutContext.Provider value={{ workouts: [] }}>
          <WorkoutForm />
        </WorkoutContext.Provider>
      </AuthContext.Provider>
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
      <AuthContext.Provider value={{ user: {} }}>
        <WorkoutContext.Provider value={{ workouts: [] }}>
          <WorkoutForm />
        </WorkoutContext.Provider>
      </AuthContext.Provider>
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

  it("should respond with error message when user attempts to submit form with invalid input value(s)", async () => {
    server.use(
      rest.post(`${process.env.REACT_APP_API}/api/workouts`, (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            error: "All fields must be filled"
          })
        );
      })
    );
    user.setup();
    render(
      <AuthContext.Provider value={{ user: {} }}>
        <WorkoutContext.Provider value={{ workouts: []}}>
          <WorkoutForm />
        </WorkoutContext.Provider>
      </AuthContext.Provider>
    );
    
    const titleInput = await screen.findByLabelText(/workout title/i);
    const submitWorkoutBtn = await screen.findByLabelText(
      /submit workout button/i
    );
    await user.type(titleInput, "arm curls");
    await user.click(submitWorkoutBtn);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/empty fields/i)
  });

  it("should respond with error message if authentication token expired and user attempts to submit", async () => {
    server.use(
      rest.post(`${process.env.REACT_APP_API}/api/workouts`, (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({
            error: "You must be logged in"
          })
        );
      })
    );
    user.setup();
    render(
      <AuthContext.Provider value={{ user: undefined }}>
        <WorkoutContext.Provider
          value={{ workouts: undefined, dispatch: () => {} }}
        >
          <WorkoutForm
            hideForm={() => {}}
            getItems={() => {}}
            spreadPages={() => {}}
            flipPage={() => {}}
          />
        </WorkoutContext.Provider>
      </AuthContext.Provider>
    );
    const titleInput = await screen.findByLabelText(/workout title/i);
    const repsInput = await screen.findByLabelText(/number of reps/i);
    const loadInput = await screen.findByLabelText(/load in kg/i);
    const submitWorkoutBtn = await screen.findByLabelText(
      /submit workout button/i
    );
    await user.type(titleInput, "arm curls");
    await user.type(repsInput, "33");
    await user.type(loadInput, "20");
    await user.click(submitWorkoutBtn);
    const error = await screen.findByRole("alert");
    expect(error.textContent).toMatch(/must be logged in/i);
  });

  it("should not respond with error when user submits form with valid input", async () => {
    user.setup();
    render(
      <AuthContext.Provider value={{ user: {} }}>
        <WorkoutContext.Provider
          value={{ workouts: [], dispatch: () => {} }}
        >
          <WorkoutForm
            hideForm={() => {}}
            getItems={() => {}}
            spreadPages={() => {}}
            flipPage={() => {}}
          />
        </WorkoutContext.Provider>
      </AuthContext.Provider>
    );
    const titleInput = await screen.findByLabelText(/workout title/i);
    const repsInput = await screen.findByLabelText(/number of reps/i);
    const loadInput = await screen.findByLabelText(/load in kg/i);
    const submitWorkoutBtn = await screen.findByLabelText(
      /submit workout button/i
    );
    await user.type(titleInput, "arm curls");
    await user.type(repsInput, "33");
    await user.type(loadInput, "20");
    await user.click(submitWorkoutBtn);
    const error = screen.queryAllByRole("alert");
    expect(error.length).toBe(0);
  })

});
