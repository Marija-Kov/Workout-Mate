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
    const webServiceLimitAlert = screen.getByText(
      /your initial request may take a minute/i
    );
    const gotIt = screen.getByText(/got it/i);
    expect(webServiceLimitAlert).toBeInTheDocument();
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
    expect(
      state.toggleMountComponents.isSpunDownServerAlertMounted
    ).toBeFalsy();
  });

  it("should show the cookie alert", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    act(() => store.dispatch({ type: "TOGGLE_MOUNT_COOKIE_ALERT" }));
    const cookieAlert = await screen.findByText(
      /we use 1 cookie to keep you logged in/i
    );
    expect(cookieAlert).toBeInTheDocument();
  });

  it("should close the cookie alert", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    act(() => store.dispatch({ type: "TOGGLE_MOUNT_COOKIE_ALERT" }));
    const gotIt = screen.getByText(/got it/i);
    act(() => gotIt.click());
    let state = store.getState();
    expect(state.toggleMountComponents.isCookieAlertMounted).toBeFalsy();
  });
});
