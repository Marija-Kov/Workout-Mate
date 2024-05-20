import React from "react";
import { render, screen, act } from "@testing-library/react";
import Chart from "../Chart";
import { Provider } from "react-redux";
import store from "../../redux/store";

jest.mock("react-chartjs-2");

let dispatch;

beforeAll(() => {
  dispatch = store.dispatch;
});

afterAll(() => {
  dispatch = null;
});

describe("<Chart />", () => {
  it("should render Chart component properly", async () => {
    let muscleGroups = [
      "leg",
      "leg",
      "chest",
      "forearm and grip",
      "biceps",
      "triceps",
      "glute",
      "triceps",
    ];
    render(
      <Provider store={store}>
        <Chart />
      </Provider>
    );
    act(() => dispatch({ type: "SET_ROUTINE_BALANCE", payload: muscleGroups }));
    const doughnut = await screen.findByText(/routine balance/i);
    const legend = await screen.findByLabelText("muscle groups");
    const hasChestMuscleGroupWorkouts = await screen.findByLabelText(
      /12.5% chest/i
    );
    const hasLegMuscleGroupWorkouts = await screen.findByLabelText(
      /25.0% leg/i
    );
    const hasForearmAndGripMuscleGroupWorkouts = await screen.findByLabelText(
      /12.5% forearm and grip/i
    );
    const hasBicepsMuscleGroupWorkouts = await screen.findByLabelText(
      /12.5% biceps/i
    );
    const hasTricepsMuscleGroupWorkouts = await screen.findByLabelText(
      /25.0% triceps/i
    );
    const hasGluteMuscleGroupWorkouts = await screen.findByLabelText(
      /12.5% glute/i
    );
    const hasNotBackMuscleGroupWorkouts = await screen.findByLabelText(
      /0% back/i
    );
    expect(doughnut).toBeInTheDocument();
    expect(legend).toBeInTheDocument();
    expect(hasChestMuscleGroupWorkouts).toBeInTheDocument();
    expect(hasLegMuscleGroupWorkouts).toBeInTheDocument();
    expect(hasForearmAndGripMuscleGroupWorkouts).toBeInTheDocument();
    expect(hasBicepsMuscleGroupWorkouts).toBeInTheDocument();
    expect(hasTricepsMuscleGroupWorkouts).toBeInTheDocument();
    expect(hasGluteMuscleGroupWorkouts).toBeInTheDocument();
    expect(hasNotBackMuscleGroupWorkouts).toBeInTheDocument();
    act(() => dispatch({ type: "SET_ROUTINE_BALANCE", payload: [] }));
  });
});
