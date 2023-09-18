import React from "react";
import user from "@testing-library/user-event";
import { render, screen, cleanup } from "@testing-library/react"; 
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
})

afterAll(() => {
  mockWorkout = null
})

describe("<WorkoutDetails />", () => {
  it("should render WorkoutDetails component properly", async () => {
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
    const title = await screen.findByText(mockWorkout.title);
    const reps = await screen.findByText(mockWorkout.reps);
    const load = await screen.findByText(mockWorkout.load);
    const createdAt = await screen.findByLabelText(/date/i);
    const openEditWorkoutFormBtn = await screen.findByText(/edit/i);
    const deleteWorkoutBtn = await screen.findByText(/delete/i);
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
    const openEditWorkoutFormBtn = await screen.findByText(/edit/i);
    const deleteWorkoutBtn = await screen.findByText(/delete/i);
    await user.tab();
    expect(deleteWorkoutBtn).toHaveFocus();
    await user.tab();
    expect(openEditWorkoutFormBtn).toHaveFocus();
  });

  it("should dispatch SHOW_EDIT_WORKOUT_FORM when 'edit' button is clicked", async () => {
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
    const openEditWorkoutFormBtn = await screen.findByText(/edit/i);
    await user.click(openEditWorkoutFormBtn);
    let state = store.getState();
    expect(state.showComponent.prepopulateEditWorkoutForm).toBeTruthy();
    expect(state.showComponent.prepopulateEditWorkoutForm.id).toBe(mockWorkout.id);
    expect(state.showComponent.prepopulateEditWorkoutForm.prevTitle).toBe(mockWorkout.title);
    expect(state.showComponent.prepopulateEditWorkoutForm.prevMuscleGroup).toBe(mockWorkout.muscle_group);
    expect(state.showComponent.prepopulateEditWorkoutForm.prevReps).toBe(mockWorkout.reps);
    expect(state.showComponent.prepopulateEditWorkoutForm.prevLoad).toBe(mockWorkout.load);
    expect(state.showComponent.prepopulateEditWorkoutForm.createdAt).toBe(mockWorkout.createdAt);
    expect(state.showComponent.prepopulateEditWorkoutForm.updatedAt).toBe(mockWorkout.updatedAt);
  });
});
