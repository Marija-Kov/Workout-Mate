import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfirmedAccount from "./ConfirmedAccount";
import { BrowserRouter } from "react-router-dom";
import App from "../../mocks/App";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("<ConfirmedAccount />", () => {
  it("should render a success message if the account confirmation was successful", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
          <App>
            <ConfirmedAccount />
          </App>
        </BrowserRouter>
      </Provider>
    );
    const accountConfirmed = screen.getByTestId("account-confirmed");
    expect(accountConfirmed).toBeInTheDocument();
    const success = await screen.findByRole("alert");
    expect(success).toBeInTheDocument();
    expect(success).toHaveAttribute("class", "success flashMessage");
    expect(success.textContent).toMatch(/account confirmed/i);
  });

  it("should render an error message if the confirmation token is invalid", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
          <App>
            <ConfirmedAccount />
          </App>
        </BrowserRouter>
      </Provider>
    );
    // TODO: it changes the state, but it's not reflected in the UI!
    store.dispatch({ type: "ERROR", payload: "Invalid token" });
    const error = await screen.findByRole("alert");
    screen.debug();
    expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute("class", "error flashMessage");
    expect(error.textContent).toMatch(/invalid token/i);
  });
});
