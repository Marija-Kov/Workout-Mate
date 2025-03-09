import { render, screen } from "@testing-library/react";
import { act } from "react";
import "@testing-library/jest-dom";
import { jest } from "@jest/globals";
import ConfirmedAccount from "../ConfirmedAccount";
import { BrowserRouter } from "react-router-dom";
import App from "../../mocks/App";
import { Provider } from "react-redux";
import store from "../../redux/store";

let dispatch = store.dispatch;

jest.mock("../../hooks/useGetAccountConfirmationToken", () => ({
  useGetAccountConfirmationToken: () => {
    return {
      getAccountConfirmationToken: () => {},
    };
  },
}));

jest.mock("../../hooks/useConfirmAccount", () => ({
  useConfirmAccount: () => {
    return {
      confirmAccount: () => {},
    };
  },
}));

afterAll(() => {
  dispatch = null;
  jest.resetAllMocks();
});

describe("<ConfirmedAccount />", () => {
  it("should render success message given that confirmation was successful", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <ConfirmedAccount />
        </BrowserRouter>
      </Provider>
    );
    await act(() =>
      dispatch({
        type: "SUCCESS",
        payload: "Account confirmed",
      })
    );
    const success = await screen.findByRole("alert");
    expect(success).toBeInTheDocument();
    expect(success).toHaveAttribute("class", "success flashMessage");
    expect(success.textContent).toMatch(/account confirmed/i);
  });

  it("should render error message given that confirmation token wasn't found or is expired", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <ConfirmedAccount />
        </BrowserRouter>
      </Provider>
    );
    await act(() => dispatch({ type: "ERROR", payload: "Not found" }));
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute("class", "error flashMessage");
    expect(error.textContent).toMatch(/not found/i);
  });
});
