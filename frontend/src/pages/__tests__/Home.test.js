import React from 'react';
import { render, screen, cleanup } from "@testing-library/react";
import user from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Home from "../Home";
import { server, rest } from "../../mocks/server";
import { AuthContextProvider } from "../../context/AuthContext";
import { WorkoutContextProvider } from "../../context/WorkoutContext";

let mockLocalStorage;
beforeAll(async () => {
  server.listen();
});
beforeEach(() => {
  mockLocalStorage = {};
  global.Storage.prototype.setItem = jest.fn((key, value) => {
    mockLocalStorage[key] = value;
  });
  global.Storage.prototype.getItem = jest.fn(
    (key) => mockLocalStorage[key]
  );
    const storageUser = {
      id: "userId",
      email: "keech@mail.yu",
      token: "authorizationToken",
    };
    localStorage.setItem("user", JSON.stringify(storageUser));
});
afterEach(() => {
  global.Storage.prototype.setItem.mockReset();
  global.Storage.prototype.getItem.mockReset();  
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  server.close();
});

describe("<Home />", () => {
    it("should render Home page correctly given that user is authenticated", async () => {
      render (
          <WorkoutContextProvider>
              <AuthContextProvider>
                  <Home />
              </AuthContextProvider>
          </WorkoutContextProvider>
      )
      const searchBar = await screen.findByLabelText(/search/i);
      const addWorkoutBtn = await screen.findByLabelText(/buff it up/i);
      const workouts = await screen.findByLabelText(/workouts/i);
      const pagination = await screen.findByLabelText(/pages/i);
      await expect(addWorkoutBtn).toBeInTheDocument();
      await expect(searchBar).toBeInTheDocument();
      await expect(workouts).toBeInTheDocument();
      await expect(pagination).toBeInTheDocument();
    });

    it("should focus elements on page in correct order", () => {
     expect(true).toBe(false);
    });

    it("should render search input value as user types and render correct search results on page", () => {
     expect(true).toBe(false);
    });

    it("should render Add Workout form when user clicks Buff It Up button", async () => {
       user.setup()
        render(
          <WorkoutContextProvider>
            <AuthContextProvider>
              <Home />
            </AuthContextProvider>
          </WorkoutContextProvider>
        );
         const addWorkoutBtn = await screen.findByLabelText(/buff it up/i);
         await user.click(addWorkoutBtn);
         const addWorkoutForm = await screen.findByLabelText(/workout form/i);
         await expect(addWorkoutForm).toBeInTheDocument();
    });

    it("should render corresponding Edit Workout form when user clicks on Edit button in Workout details component", () => {
      expect(false).toBe(true);
    });

    it("should delete corresponding workout when trashcan button is clicked", () => {
      expect(false).toBe(true);
    });

    it("should flip to the next page of workouts results when chevron-right button is clicked", () => {
      expect(false).toBe(true);
    });

    it("should flip to previous page of workouts results when chevron-left button is clicked", () => {
      expect(false).toBe(true);
    });

    it("should flip to page p of workouts results when page number p button is clicked", () => {
      expect(false).toBe(true);
    });

    it("should redirect to Login page if user clicks anywhere on Home page after auth token has expired", () => {
      expect(false).toBe(true);
    });

});


 