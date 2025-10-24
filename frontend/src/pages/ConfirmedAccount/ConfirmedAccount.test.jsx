import { describe, it, expect, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfirmedAccount from "./ConfirmedAccount";
import { BrowserRouter } from "react-router-dom";
import App from "../../mocks/App";
import { server } from "../../mocks/server";
import { Provider } from "react-redux";
import store from "../../redux/store";

let dispatch = store.dispatch;

vi.mock("../../hooks/useGetTokenFromUrl", () => ({
  useGetTokenFromUrl: () => {},
}));

vi.mock("../../hooks/useConfirmAccount", () => ({
  useConfirmAccount: () => {
    return {
      confirmAccount: () => {},
    };
  },
}));

afterAll(() => {
  dispatch = null;
  vi.resetAllMocks();
});

describe("<ConfirmedAccount />", () => {
  const url = import.meta.env.VITE_API || "http://localhost:6060";

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
    dispatch({
      type: "SUCCESS",
      payload: "Account confirmed",
    });
    const success = await screen.findByRole("alert");
    expect(success).toBeInTheDocument();
    expect(success).toHaveAttribute("class", "success flashMessage");
    expect(success.textContent).toMatch(/account confirmed/i);
  });

  it("should render error message if the confirmation token is invalid", async () => {
    server.use(
      http.get(`${url}/api/users/confirmaccount/*`, () => {
        return HttpResponse.json(
          {
            error: "Invalid token",
          },
          { status: 404 }
        );
      })
    );
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
    dispatch({ type: "ERROR", payload: "Not found" });
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute("class", "error flashMessage");
    expect(error.textContent).toMatch(/invalid token/i);
  });
});
