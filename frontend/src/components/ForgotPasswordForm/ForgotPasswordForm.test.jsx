import ForgotPasswordForm from "./ForgotPasswordForm";
import App from "../../mocks/App";
import user from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("<ForgotPasswordForm />", () => {
  it("should render ForgotPasswordForm component properly", () => {
    render(
      <Provider store={store}>
        <ForgotPasswordForm />
      </Provider>
    );
    const inputField = screen.getByText(/email address/i);
    const submitBtn = screen.getByText(/proceed/i);
    const closeBtn = screen.getByText(/close/i);
    expect(inputField).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
    expect(closeBtn).toBeInTheDocument();
  });

  it("should focus form elements in the right order", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <ForgotPasswordForm />
      </Provider>
    );
    const inputField = screen.getByPlaceholderText(/email address/i);
    const submitBtn = screen.getByText(/proceed/i);
    const closeBtn = screen.getByText(/close/i);
    await user.tab();
    expect(closeBtn).toHaveFocus();
    await user.tab();
    expect(inputField).toHaveFocus();
    await user.tab();
    expect(submitBtn).toHaveFocus();
  });

  it("should update input value when user types", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <ForgotPasswordForm />
      </Provider>
    );
    const inputField = screen.getByPlaceholderText(/email address/i);
    await user.type(inputField, "keech");
    expect(inputField).toHaveValue("keech");
  });

  it("should render error message if user attempts to submit invalid input", async () => {
    server.use(
      http.post("/api/reset-password", () => {
        return new HttpResponse.json({
          error: "Please enter valid email address",
        }, { status: 400 })
      })
    );
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <ForgotPasswordForm />
      </Provider>
    );
    const inputField = screen.getByPlaceholderText(/email address/i);
    const submitBtn = screen.getByText(/proceed/i);
    await user.type(inputField, "keech");
    await user.click(submitBtn);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute("class", "error flashMessage");
    expect(error.textContent).toMatch(/please enter valid email address/i);
  });

  it("should render success message if user submits valid email", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <ForgotPasswordForm />
      </Provider>
    );
    const inputField = screen.getByPlaceholderText(/email address/i);
    const submitBtn = screen.getByText(/proceed/i);
    await user.type(inputField, "keech@mail.yu");
    await user.click(submitBtn);
    const successMessage = await screen.findByRole("alert");
    expect(successMessage).toBeInTheDocument();
    expect(successMessage).toHaveAttribute("class", "success flashMessage");
    expect(successMessage.textContent).toMatch(/reset link sent to inbox/i);
  });
});
