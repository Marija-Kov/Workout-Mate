import React from 'react';
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import Home from "../../mocks/components/Home";

describe("<Home />", () => {
    it("should render Home page correctly given that user is authenticated", async () => {
      render(<Home />);
      const searchBar = await screen.findByLabelText(/search/i);
      const addWorkoutBtn = await screen.findByLabelText(/buff it up/i);
      const workouts = await screen.findByLabelText(/workouts/i);
      const pagination = await screen.findByLabelText(/pages/i);
      expect(addWorkoutBtn).toBeInTheDocument();
      expect(searchBar).toBeInTheDocument();
      expect(workouts).toBeInTheDocument();
      expect(pagination).toBeInTheDocument();
    });

    it("should focus elements on page in correct order", () => {
     expect(true).toBe(false);
    });

    it("should render search input value as user types and render correct search results on page", () => {
     expect(true).toBe(false);
    });

    it("should render Add Workout form when user clicks Buff It Up button", async () => {
      user.setup();
      render(<Home />);
      const addWorkoutBtn = await screen.findByLabelText(/buff it up/i);
      await user.click(addWorkoutBtn);
      const addWorkoutForm = await screen.findByLabelText("workout form");
      expect(addWorkoutForm).toBeInTheDocument();
    });

    it("should render corresponding Edit Workout form when user clicks on Edit button in Workout details component", async () => {
      user.setup();
      render(<Home />);
      const workoutTitle = "bench press"; // 'bench press' happens to be the first sample workout title, see: src/utils/test/genSampleWorkouts
      const workoutTitleCount = await screen.findAllByText(workoutTitle);
      expect(workoutTitleCount.length).toBeGreaterThanOrEqual(1);
      const editWorkoutBtn = (await screen.findAllByLabelText(/open edit workout form/i))[0];
      user.click(editWorkoutBtn);
      const editWorkoutTitle = await screen.findByLabelText(
        /edit workout title/i
      );
      const editWorkoutReps = await screen.findByLabelText(
        /edit number of reps/i
      );
      const editWorkoutLoad = await screen.findByLabelText(
        /edit load in kg/i
      );
      const prefilledInputTitle = await screen.findByDisplayValue(workoutTitle);
      expect(editWorkoutTitle).toBeInTheDocument();
      expect(editWorkoutReps).toBeInTheDocument();
      expect(editWorkoutLoad).toBeInTheDocument();
      expect(prefilledInputTitle).toBeInTheDocument();
    });

    it("should delete corresponding workout when trashcan button is clicked", () => {
      expect(false).toBe(true);
    });

    describe("<Pagination/>", () => {
      it("should render Pagination component correctly considering total number of workouts and limit of workouts per page", async () => {
        render(<Home />);
        const total = 8; // number of sample workouts, see: src/utils/test/genSampleWorkouts
        const limit = 3;
        const numButtons = await screen.findAllByLabelText(/go to page/i);
        const pageOne = await screen.findByLabelText(/page 1/i)
        const prev = await screen.findByLabelText(/previous page/i);
        const next = await screen.findByLabelText(/next page/i);
        expect(prev).toBeInTheDocument();
        expect(prev).toHaveAttribute('disabled');
        expect(next).toBeInTheDocument();
        expect(pageOne).toHaveAttribute('class', 'num--page current');
        expect(numButtons.length).toBe(Math.ceil(total/limit));
      });

      it("should flip workout results pages back and forth when chevron-right/left button is clicked", async () => {
        user.setup();
        render(<Home />);
        const next = await screen.findByLabelText(/next page/i);
        const prev = await screen.findByLabelText(/previous page/i);
        const firstPageLastDate = (await screen.findAllByLabelText(/date/i))[2];
        user.click(next);
        const nextPageFirstDate = (await screen.findAllByLabelText(/date/i))[0];
        const pageTwo = await screen.findByLabelText(/page 2/i);
        user.click(pageTwo);
        expect(Number(firstPageLastDate.textContent)).toBeGreaterThanOrEqual(Number(nextPageFirstDate.textContent))
        expect(pageTwo).toHaveAttribute("class", "num--page current");
      });

      it("should flip to page p of workouts results when page number p button is clicked", () => {
        expect(false).toBe(true);
      });

    });

    it("should redirect to Login page if user clicks anywhere on Home page after auth token has expired", () => {
      expect(false).toBe(true);
    });

});


 