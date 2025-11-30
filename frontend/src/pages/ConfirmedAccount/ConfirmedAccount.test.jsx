import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { http, HttpResponse } from "msw";
import { server } from "../../test/mocks/server";
import ConfirmedAccount from "./ConfirmedAccount";
import { BrowserRouter } from "react-router-dom";
import App from "../../test/mocks/App";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("<ConfirmedAccount />", () => {
  it("should render a success message if the account confirmation was successful", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
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
    server.use(
      http.get(`${import.meta.env.VITE_API}/api/users/confirmaccount/*`, () => {
        return HttpResponse.json(
          {
            error: "Invalid token",
          },
          { status: 422 }
        );
      })
    );
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App>
            <ConfirmedAccount />
          </App>
        </BrowserRouter>
      </Provider>
    );
    await waitFor(async () =>
      expect(await screen.findByRole("alert")).toBeInTheDocument()
    );
    expect(await screen.findByRole("alert")).toHaveAttribute(
      "class",
      "error flashMessage"
    );
    expect((await screen.findByRole("alert")).textContent).toMatch(
      /invalid token/i
    );
  });
});
