import React from "react";
import user from "@testing-library/user-event";
import { render, screen, cleanup } from "@testing-library/react";
import { AuthContext } from "../../context/AuthContext";
import { WorkoutContext } from "../../context/WorkoutContext";
import WorkoutDetails from "../WorkoutDetails";

afterEach(() => {
  cleanup();
});

describe("<WorkoutDetails />", () => {
  it("should render WorkoutDetails component properly", async () => {
   let mockWorkout = {
      id: "workoutId",
      title: "bench press",
      reps: 22,
      load: 23,
      createdAt: "2023-04-10T13:01:15.208+00:00",
      updatedAt: "2023-04-13T17:27:28.820+00:00",
    };
    render(
      <AuthContext.Provider value={{ user: {} }}>
        <WorkoutContext.Provider value={{ workouts: [] }}>
          <WorkoutDetails
            id={mockWorkout.id}
            title={mockWorkout.title}
            reps={mockWorkout.reps}
            load={mockWorkout.load}
            createdAt={mockWorkout.createdAt}
            updatedAt={mockWorkout.updatedAt}
            page={0}
            getItems={() => {}}
            spreadPages={() => {}}
            total={1}
            limit={3}
          />
        </WorkoutContext.Provider>
      </AuthContext.Provider>
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
    let mockWorkout = {
      id: "workoutId",
      title: "bench press",
      reps: 22,
      load: 23,
      createdAt: "2023-04-10T13:01:15.208+00:00",
      updatedAt: "2023-04-13T17:27:28.820+00:00",
    };
    render(
      <AuthContext.Provider value={{ user: {} }}>
        <WorkoutContext.Provider value={{ workouts: [] }}>
          <WorkoutDetails
            id={mockWorkout.id}
            title={mockWorkout.title}
            reps={mockWorkout.reps}
            load={mockWorkout.load}
            createdAt={mockWorkout.createdAt}
            updatedAt={mockWorkout.updatedAt}
            page={0}
            getItems={() => {}}
            spreadPages={() => {}}
            total={1}
            limit={3}
          />
        </WorkoutContext.Provider>
      </AuthContext.Provider>
    );
    const openEditWorkoutFormBtn = await screen.findByText(/edit/i);
    const deleteWorkoutBtn = await screen.findByText(/delete/i);
    await user.tab();
    expect(deleteWorkoutBtn).toHaveFocus();
    await user.tab();
    expect(openEditWorkoutFormBtn).toHaveFocus();
  });

  it("should open EditWorkout when 'edit' button is clicked", async () => {
    user.setup();
    let mockWorkout = {
      id: "workoutId",
      title: "bench press",
      reps: 22,
      load: 23,
      createdAt: "2023-04-10T13:01:15.208+00:00",
      updatedAt: "2023-04-13T17:27:28.820+00:00",
    };
    render(
      <AuthContext.Provider value={{ user: {} }}>
        <WorkoutContext.Provider value={{ workouts: [] }}>
          <WorkoutDetails
            id={mockWorkout.id}
            title={mockWorkout.title}
            reps={mockWorkout.reps}
            load={mockWorkout.load}
            createdAt={mockWorkout.createdAt}
            updatedAt={mockWorkout.updatedAt}
            page={0}
            getItems={() => {}}
            spreadPages={() => {}}
            total={1}
            limit={3}
          />
        </WorkoutContext.Provider>
      </AuthContext.Provider>
    );
    const openEditWorkoutFormBtn = await screen.findByText(/edit/i);
    await user.click(openEditWorkoutFormBtn);
    const regExp = new RegExp(`edit ${mockWorkout.title}`)
    const editWorkoutForm = await screen.findByLabelText(regExp);
    expect(editWorkoutForm).toBeInTheDocument()
  });
});
