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
    it("should render the home page correctly", async () => {
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

    it("should render the add workout form after clicking buff it up", async () => {
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

});


 