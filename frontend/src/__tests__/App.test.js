import { render, screen, act } from "@testing-library/react";
import user from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { jest } from "@jest/globals";
import App from "../App";
import { Provider } from "react-redux";
import store from "../redux/store";

afterAll(() => {
    jest.clearAllMocks();
  });

describe("<App />", () => {
    it("should show the alert about web service limitations", () => {
      render(
       <Provider store={store}>
         <App />
       </Provider>
      );
     const alert = screen.getByText(/your initial request may take a minute/i);
     const gotIt = screen.getByText(/got it/i);
     expect(alert).toBeInTheDocument();
     expect(gotIt).toBeInTheDocument();
    });

    it("should close the alert about web service limitations", () => {
      user.setup();
      render(
       <Provider store={store}>
         <App />
       </Provider>
      );
     const gotIt = screen.getByText(/got it/i);
     act(() => gotIt.click());
     let state = store.getState();
     expect(state.toggleMountComponents.showSpunDownServerAlert).toBeFalsy();
    });
})