import WorkoutForm from "../WorkoutForm";
import user from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { WorkoutContextProvider } from "../../context/WorkoutContext";
import { AuthContextProvider } from "../../context/AuthContext";

describe("<WorkoutForm/>", () => {
  it("should render Workout form given that user is authenticated", async () => {
          render(
           <AuthContextProvider>
            <WorkoutContextProvider>
              <WorkoutForm />
            </WorkoutContextProvider>
           </AuthContextProvider>
          );
      const workoutForm = await screen.findByLabelText(/workout form/i);
      const titleInput = await screen.findByLabelText(/workout title/i);
      const repsInput = await screen.findByLabelText(/number of reps/i);
      const loadInput = await screen.findByLabelText(/load in kg/i);
      const closeForm = await screen.findByLabelText(/close form/i);
      const submitWorkoutBtn = await screen.findByLabelText(/submit workout button/i);
      await expect(workoutForm).toBeInTheDocument();
      await expect(titleInput).toBeInTheDocument();
      await expect(repsInput).toBeInTheDocument();
      await expect(loadInput).toBeInTheDocument();
      await expect(submitWorkoutBtn).toBeInTheDocument();
      await expect(closeForm).toBeInTheDocument();
  });

  it("should focus input fields in the right order", async () => {
    user.setup();
    render(
      <AuthContextProvider>
        <WorkoutContextProvider>
          <WorkoutForm />
        </WorkoutContextProvider>
      </AuthContextProvider>
    );
     const titleInput = await screen.findByLabelText(/workout title/i);
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
    expect(repsInput).toHaveFocus();
    await user.tab();
    expect(loadInput).toHaveFocus();
    await user.tab();
    expect(submitWorkoutBtn).toHaveFocus();
  });

  it("should update input value when user types", async () => {
    user.setup();
    render(
      <AuthContextProvider>
        <WorkoutContextProvider>
          <WorkoutForm />
        </WorkoutContextProvider>
      </AuthContextProvider>
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

  it("should respond with error message when user attempts to submit form with invalid input value(s)", async () => {
    user.setup();
    render(
      <AuthContextProvider>
        <WorkoutContextProvider>
          <WorkoutForm />
        </WorkoutContextProvider>
      </AuthContextProvider>
    );
    const titleInput = await screen.findByLabelText(/workout title/i);
    const submitWorkoutBtn = await screen.findByLabelText(
      /submit workout button/i
    );
    await user.type(titleInput, "arm curls");
    // it runs into authorization issue here
    await user.click(submitWorkoutBtn);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
  });

  it("should respond with error message if authentication token expired and user attempts to submit", () => {
    expect(true).toBe(false);
  });

  it("should close Workout form when user clicks on close button", async () => {
    user.setup();
    render(
      <AuthContextProvider>
        <WorkoutContextProvider>
          <WorkoutForm />
        </WorkoutContextProvider>
      </AuthContextProvider>
    );
    const workoutForm = await screen.findByLabelText(/workout form/i);
    const closeForm = await screen.findByLabelText(/close form/i);
    await user.click(closeForm);
    // it runs into authorization issue here
    expect(workoutForm).not.toBeInTheDocument();
  });

  it("should close Workout form, flip to page 1 of workout results and render new workout in the list of workouts given all input values are valid", () => {
    expect(true).toBe(false);
  });
});
