import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import store from "../../redux/store";
import Workouts from "../Workouts"

import { genSampleWorkouts } from "../../utils/test/genSampleWorkouts";

let dispatch;

beforeAll(() => {
    dispatch = store.dispatch;
});

afterAll(() => {
    dispatch = null;
});

describe("<Workouts/>", () => {
    it("should render workouts given that user is authorized", async () => {
        const sampleWorkouts = genSampleWorkouts();
        render(
            <Provider store={store}>
                <Workouts />
            </Provider>
        );
        dispatch({ type: "SET_WORKOUTS", payload: sampleWorkouts });
        const workouts = sampleWorkouts.workoutsChunk.map(w => w.title);
        const workoutDetails1 = await screen.findByText(new RegExp(`${workouts[0]}`));
        const workoutDetails2 = await screen.findByText(new RegExp(`${workouts[1]}`));
        expect(workoutDetails1).toBeInTheDocument();
        expect(workoutDetails2).toBeInTheDocument();
    });

    it("should render 'no workouts'", async () => {
        const sampleWorkouts = genSampleWorkouts("qwert");
        render(
            <Provider store={store}>
                <Workouts />
            </Provider>
        );
        dispatch({ type: "SET_WORKOUTS", payload: sampleWorkouts });
        const noWorkouts = await screen.findByTestId(/no-workouts/i);
        expect(noWorkouts).toBeInTheDocument();
    });

    it("should render workouts placeholder", async () => {

        render(
            <Provider store={store}>
                <Workouts />
            </Provider>
        );
        dispatch({ type: "RESET_WORKOUTS_STATE" });
        dispatch({ type: "SET_WORKOUTS_LOADER" });
        const placeholder = await screen.findByLabelText(/loading workouts/i);
        expect(placeholder).toBeInTheDocument();
    });
})