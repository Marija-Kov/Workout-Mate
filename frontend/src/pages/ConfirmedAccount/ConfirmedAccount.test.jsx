import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfirmedAccount from "./ConfirmedAccount";
import { BrowserRouter } from "react-router-dom";
import App from "../../mocks/App";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("<ConfirmedAccount />", () => {
  vi.mock("../../hooks/useGetTokenFromUrl", () => ({
    defaultl: () => {},
  }));

  vi.mock("../../hooks/useConfirmAccount", () => ({
    default: () => {
      return {
        confirmAccount: () => {},
      };
    },
  }));

  vi.mock("../../hooks/useLogout", () => ({
    default: () => {
      return {
        logout: () => {},
      };
    },
  }));

  afterAll(() => {
    vi.resetAllMocks();
  });

  it("should render success message given that confirmation was successful", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
          <App />
          <ConfirmedAccount />
        </BrowserRouter>
      </Provider>
    );
    store.dispatch({
      type: "SUCCESS",
      payload: "Account confirmed",
    });
    const success = await screen.findByRole("alert");
    expect(success).toBeInTheDocument();
    expect(success).toHaveAttribute("class", "success flashMessage");
    expect(success.textContent).toMatch(/account confirmed/i);
  });

  it("should render error message if the confirmation token is invalid", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
          <App />
          <ConfirmedAccount />
        </BrowserRouter>
      </Provider>
    );
    store.dispatch({ type: "ERROR", payload: "Invalid token" });
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute("class", "error flashMessage");
    expect(error.textContent).toMatch(/invalid token/i);
  });
});
