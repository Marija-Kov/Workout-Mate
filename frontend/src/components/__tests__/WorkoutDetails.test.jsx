import user from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import WorkoutDetails from "../WorkoutDetails";
import { Provider } from "react-redux";
import store from "../../redux/store";

let mockWorkout;

beforeAll(() => {
  mockWorkout = {
    id: "workoutId",
    title: "bench press",
    muscle_group: "chest",
    reps: 22,
    load: 23,
    createdAt: "2023-04-10T13:01:15.208+00:00",
    updatedAt: "2023-04-13T17:27:28.820+00:00",
  };
});

afterAll(() => {
  mockWorkout = null;
});

describe("<WorkoutDetails />", () => {
  it("should render WorkoutDetails component properly", () => {
    render(
      <Provider store={store}>
        <WorkoutDetails
          id={mockWorkout.id}
          title={mockWorkout.title}
          muscle_group={mockWorkout.muscle_group}
          reps={mockWorkout.reps}
          load={mockWorkout.load}
          createdAt={mockWorkout.createdAt}
          updatedAt={mockWorkout.updatedAt}
        />
      </Provider>
    );
    const title = screen.getByText(mockWorkout.title);
    const reps = screen.getByText(mockWorkout.reps);
    const load = screen.getByText(mockWorkout.load);
    const createdAt = screen.getByText(/ ago/i);
    const openEditWorkoutFormBtn = screen.getByText(/edit/i);
    const deleteWorkoutBtn = screen.getByText(/delete/i);
    expect(title).toBeInTheDocument();
    expect(reps).toBeInTheDocument();
    expect(load).toBeInTheDocument();
    expect(createdAt).toBeInTheDocument();
    expect(openEditWorkoutFormBtn).toBeInTheDocument();
    expect(deleteWorkoutBtn).toBeInTheDocument();
  });

  it("should focus elements in right order", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <WorkoutDetails
          id={mockWorkout.id}
          title={mockWorkout.title}
          muscle_group={mockWorkout.muscle_group}
          reps={mockWorkout.reps}
          load={mockWorkout.load}
          createdAt={mockWorkout.createdAt}
          updatedAt={mockWorkout.updatedAt}
        />
      </Provider>
    );
    const openEditWorkoutFormBtn = screen.getByText(/edit/i);
    const deleteWorkoutBtn = screen.getByText(/delete/i);
    await user.tab();
    expect(deleteWorkoutBtn).toHaveFocus();
    await user.tab();
    expect(openEditWorkoutFormBtn).toHaveFocus();
  });

  it("should dispatch TOGGLE_MOUNT_EDIT_WORKOUT_FORM when 'edit' button is clicked", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <WorkoutDetails
          id={mockWorkout.id}
          title={mockWorkout.title}
          muscle_group={mockWorkout.muscle_group}
          reps={mockWorkout.reps}
          load={mockWorkout.load}
          createdAt={mockWorkout.createdAt}
          updatedAt={mockWorkout.updatedAt}
        />
      </Provider>
    );
    const openEditWorkoutFormBtn = screen.getByText(/edit/i);
    await user.click(openEditWorkoutFormBtn);
    let state = store.getState();
    expect(state.toggleMountComponents.prepopulateEditWorkoutForm).toBeTruthy();
    expect(state.toggleMountComponents.prepopulateEditWorkoutForm.id).toBe(
      mockWorkout.id
    );
    expect(
      state.toggleMountComponents.prepopulateEditWorkoutForm.prevTitle
    ).toBe(mockWorkout.title);
    expect(
      state.toggleMountComponents.prepopulateEditWorkoutForm.prevMuscleGroup
    ).toBe(mockWorkout.muscle_group);
    expect(
      state.toggleMountComponents.prepopulateEditWorkoutForm.prevReps
    ).toBe(mockWorkout.reps);
    expect(
      state.toggleMountComponents.prepopulateEditWorkoutForm.prevLoad
    ).toBe(mockWorkout.load);
    expect(
      state.toggleMountComponents.prepopulateEditWorkoutForm.createdAt
    ).toBe(mockWorkout.createdAt);
    expect(
      state.toggleMountComponents.prepopulateEditWorkoutForm.updatedAt
    ).toBe(mockWorkout.updatedAt);
  });
});
