import { render, screen } from "@testing-library/react";
import Chart from "./Chart";
import { Provider } from "react-redux";
import store from "../../redux/store";
import { genSampleWorkouts } from "../../utils/test/genSampleWorkouts";

describe("<Chart />", () => {
  vi.mock("react-chartjs-2");
  let sampleWorkouts = genSampleWorkouts();

  it("should render the Chart component properly", async () => {
    render(
      <Provider store={store}>
        <Chart />
      </Provider>
    );
    store.dispatch({
      type: "SET_ROUTINE_BALANCE",
      payload: sampleWorkouts.allMuscleGroups,
    });
    store.dispatch({ type: "SET_WORKOUTS", payload: sampleWorkouts });
    const doughnut = await screen.findByText(/routine balance/i);
    const legend = await screen.findByLabelText("muscle groups");
    const chestMuscleGroupWorkouts =
      await screen.findByLabelText(/25.0% chest/i);
    const shoulderMuscleGroupWorkouts =
      await screen.findByLabelText(/0.0% shoulder/i);
    const bicepsMuscleGroupWorkouts =
      await screen.findByLabelText(/12.5% biceps/i);
    const tricepsMuscleGroupWorkouts =
      await screen.findByLabelText(/0.0% triceps/i);
    const legMuscleGroupWorkouts = await screen.findByLabelText(/12.5% leg/i);
    const backMuscleGroupWorkouts = await screen.findByLabelText(/0.0% back/i);
    const gluteMuscleGroupWorkouts =
      await screen.findByLabelText(/12.5% glute/i);
    const abMuscleGroupWorkouts = await screen.findByLabelText(/25.0% ab/i);
    const calfMuscleGroupWorkouts = await screen.findByLabelText(/0.0% calf/i);
    const forearmAndGripMuscleGroupWorkouts = await screen.findByLabelText(
      /0.0% forearm and grip/i
    );
    expect(doughnut).toBeInTheDocument();
    expect(legend).toBeInTheDocument();
    expect(chestMuscleGroupWorkouts).toBeInTheDocument();
    expect(shoulderMuscleGroupWorkouts).toBeInTheDocument();
    expect(bicepsMuscleGroupWorkouts).toBeInTheDocument();
    expect(tricepsMuscleGroupWorkouts).toBeInTheDocument();
    expect(legMuscleGroupWorkouts).toBeInTheDocument();
    expect(backMuscleGroupWorkouts).toBeInTheDocument();
    expect(gluteMuscleGroupWorkouts).toBeInTheDocument();
    expect(abMuscleGroupWorkouts).toBeInTheDocument();
    expect(calfMuscleGroupWorkouts).toBeInTheDocument();
    expect(forearmAndGripMuscleGroupWorkouts).toBeInTheDocument();
    store.dispatch({ type: "SET_ROUTINE_BALANCE", payload: [] });
    store.dispatch({ type: "RESET_WORKOUTS_STATE" });
  });

  it("should render Chart Placeholder", async () => {
    render(
      <Provider store={store}>
        <Chart />
      </Provider>
    );
    store.dispatch({ type: "SET_CHART_LOADER" });
    const placeholder = await screen.findByLabelText("chart placeholder");
    expect(placeholder).toBeInTheDocument();
    store.dispatch({ type: "UNSET_CHART_LOADER" });
  });
});
