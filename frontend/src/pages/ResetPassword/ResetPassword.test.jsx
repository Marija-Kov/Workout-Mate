import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ResetPassword from "./ResetPassword";
import App from "../../mocks/App";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("<ResetPassword />", () => {
  const url = import.meta.env.VITE_API || "localhost:6060";
  it("should render the ResetPassword component properly", () => {
    render(
      <Provider store={store}>
        <ResetPassword />
      </Provider>
    );
    const newPasswordInput = screen.getByPlaceholderText("new password");
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm/i);
    const saveBtn = screen.getByText(/save/i);
    expect(newPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(saveBtn).toBeInTheDocument();
  });

  it("should focus the form elements in the correct order", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <ResetPassword />
      </Provider>
    );
    const newPasswordInput = screen.getByPlaceholderText("new password");
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm/i);
    const saveBtn = screen.getByText(/save/i);
    await user.tab();
    expect(newPasswordInput).toHaveFocus();
    await user.tab();
    expect(confirmPasswordInput).toHaveFocus();
    await user.tab();
    expect(saveBtn).toHaveFocus();
  });

  it("should update the input value as the user types", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <ResetPassword />
      </Provider>
    );
    const newPasswordInput = screen.getByPlaceholderText("new password");
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm/i);
    await user.type(newPasswordInput, "abc");
    expect(newPasswordInput).toHaveValue("abc");
    await user.type(confirmPasswordInput, "def");
    expect(confirmPasswordInput).toHaveValue("def");
  });

  it("should render an error message if the passwords are not matching", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <BrowserRouter
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
          <App />
          <ResetPassword />
        </BrowserRouter>
      </Provider>
    );
    const newPasswordInput = screen.getByPlaceholderText("new password");
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm/i);
    const saveBtn = screen.getByText(/save/i);
    await user.type(newPasswordInput, "abcABC123!");
    await user.type(confirmPasswordInput, "abcABC123@");
    await user.click(saveBtn);
    const error = await screen.findByRole("alert");
    await expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute("class", "error flashMessage");
    expect(error.textContent).toMatch(/passwords must match/i);
  });

  it("should render an error message if the password is not strong enough", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <BrowserRouter
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
          <App />
          <ResetPassword />
        </BrowserRouter>
      </Provider>
    );
    const newPasswordInput = screen.getByPlaceholderText("new password");
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm/i);
    const saveBtn = screen.getByText(/save/i);
    await user.type(newPasswordInput, "abc");
    await user.type(confirmPasswordInput, "abc");
    await user.click(saveBtn);
    const error = await screen.findByRole("alert");
    await expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute("class", "error flashMessage");
    expect(error.textContent).toMatch(/password not strong enough/i);
  });

  it("should render an error message if the password reset token is not valid", async () => {
    server.use(
      http.patch(`${url}/api/reset-password/*`, () => {
        return new HttpResponse.json(
          {
            error: "Invalid token",
          },
          { status: 404 }
        );
      })
    );
    user.setup();
    render(
      <Provider store={store}>
        <BrowserRouter
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
          <App />
          <ResetPassword />
        </BrowserRouter>
      </Provider>
    );
    const newPasswordInput = screen.getByPlaceholderText("new password");
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm/i);
    const saveBtn = screen.getByText(/save/i);
    await user.type(newPasswordInput, "abcABC123!");
    await user.type(confirmPasswordInput, "abcABC123!");
    await user.click(saveBtn);
    const error = await screen.findByRole("alert");
    await expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute("class", "error flashMessage");
    expect(error.textContent).toMatch(/invalid token/i);
  });

  it("should render a success message and a 'log in' link if the password was reset successfully", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <BrowserRouter
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
          <App />
          <ResetPassword />
        </BrowserRouter>
      </Provider>
    );
    const newPasswordInput = screen.getByPlaceholderText("new password");
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm/i);
    const saveBtn = screen.getByText(/save/i);
    await user.type(newPasswordInput, "abcABC123!");
    await user.type(confirmPasswordInput, "abcABC123!");
    await user.click(saveBtn);
    const success = await screen.findByRole("alert");
    await expect(success).toBeInTheDocument();
    expect(success).toHaveAttribute("class", "success flashMessage");
    expect(success.textContent).toMatch(/Password reset successfully/i);
  });
});
