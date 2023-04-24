import EditWorkout from "../EditWorkout";
import user from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { WorkoutContextProvider } from "../../context/WorkoutContext";
import { AuthContextProvider } from "../../context/AuthContext";

describe("<EditWorkout/>", () => {
  it("should render Edit workout form given that user is authenticated", async () => {
  render(
    <AuthContextProvider>
      <WorkoutContextProvider>
        <EditWorkout />
      </WorkoutContextProvider>
    </AuthContextProvider>
  );
  const workoutForm = await screen.findByLabelText(/edit workout form/i);
  const titleInput = await screen.findByLabelText(/workout title/i);
  const repsInput = await screen.findByLabelText(/number of reps/i);
  const loadInput = await screen.findByLabelText(/load in kg/i);
  const closeForm = await screen.findByLabelText(/close form/i);
  const submitEditedWorkoutBtn = await screen.findByLabelText(
    /submit edited workout/i
  );
  await expect(workoutForm).toBeInTheDocument();
  await expect(titleInput).toBeInTheDocument();
  await expect(repsInput).toBeInTheDocument();
  await expect(loadInput).toBeInTheDocument();
  await expect(submitEditedWorkoutBtn).toBeInTheDocument();
  await expect(closeForm).toBeInTheDocument();
  });

  it("should focus input fields in the right order", async () => {
        user.setup();
    render(
      <AuthContextProvider>
        <WorkoutContextProvider>
          <EditWorkout />
        </WorkoutContextProvider>
      </AuthContextProvider>
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
      <AuthContextProvider>
        <WorkoutContextProvider>
          <EditWorkout />
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

  it("should respond with error message when user attempts to submit edit form with invalid input value(s)", async () => {
        user.setup();
    render(
      <AuthContextProvider>
        <WorkoutContextProvider>
          <EditWorkout />
        </WorkoutContextProvider>
      </AuthContextProvider>
    );
    const titleInput = await screen.findByLabelText(/workout title/i);
    const submitEditedWorkoutBtn = await screen.findByLabelText(
      /submit edited workout/i
    );
    await user.type(titleInput, "arm curls");
    // it runs into authorization issue here
    await user.click(submitEditedWorkoutBtn);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
  });

  it("should respond with error message if authentication token expired and user attempts to submit", () => {
    expect(true).toBe(false);
  })

  it("should close Edit workout form and render updated workout given that all input values are valid", () => {
    expect(true).toBe(false);
  });
});