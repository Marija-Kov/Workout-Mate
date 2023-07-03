import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { AuthContext } from "../../context/AuthContext";
import { WorkoutContext } from "../../context/WorkoutContext";
import { Chart } from "../Chart";

jest.mock("react-chartjs-2");

afterEach(() => {
  cleanup();
});

describe("<Chart />", () => {
    it("should render Chart component properly", async () => {
        let muscleGroups = ["leg", "chest", "leg"];
        render(
            <AuthContext.Provider value={{ user: {} }}>
            <WorkoutContext.Provider value={{ workouts: {} }}>
              <Chart
                muscleGroups={muscleGroups}
              />
            </WorkoutContext.Provider>
          </AuthContext.Provider> 
        )

        const doughnut = await screen.findByLabelText("routine balance chart");
        const legend = await screen.findByLabelText("chart legend");
        const hasChestMuscleGroupWorkouts = await screen.findByLabelText(/33.3% chest/i);
        const hasLegMuscleGroupWorkouts = await screen.findByLabelText(/66.7% leg/i);
        const hasNotBackMuscleGroupWorkouts = await screen.findByLabelText(/0% back workouts/i);
        expect(doughnut).toBeInTheDocument();
        expect(legend).toBeInTheDocument();
        expect(hasChestMuscleGroupWorkouts).toBeInTheDocument();
        expect(hasLegMuscleGroupWorkouts).toBeInTheDocument();
        expect(hasNotBackMuscleGroupWorkouts).toBeInTheDocument();
    })
})