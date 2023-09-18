import ForgotPasswordForm from "../ForgotPasswordForm";
import user from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("<ForgotPasswordForm />", () => {
  it("should render ForgotPasswordForm component properly", async () => {
    render(
     <Provider store={store}>
       <ForgotPasswordForm />
     </Provider>
    );
    const inputField = await screen.findByLabelText(/email address/i);
    const submitBtn = await screen.findByLabelText(/submit/i);
    const closeBtn = await screen.findByLabelText(/close/i);
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
    const inputField = await screen.findByLabelText(/email address/i);
    const submitBtn = await screen.findByLabelText(/submit/i);
    const closeBtn = await screen.findByLabelText(/close/i);
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
    const inputField = await screen.findByLabelText(/email address/i);
    await user.type(inputField, "keech");
    expect(inputField).toHaveValue("keech");
  });

  it("should render error message if user attempts to submit invalid input", async () => {
    server.use(
      rest.post("/api/reset-password", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            error: "Please enter valid email address",
          })
        );
      })
    );
    user.setup();
    render(
      <Provider store={store}>
        <ForgotPasswordForm />
      </Provider>
     );
    const inputField = await screen.findByLabelText(/email address/i);
    const submitBtn = await screen.findByLabelText(/submit/i);
    await user.type(inputField, "keech");
    await user.click(submitBtn);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute("class", "error");
    expect(error.textContent).toMatch(/please enter valid email address/i)
  });

  it("should render success message if user submits valid email", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <ForgotPasswordForm />
      </Provider>
     );
    const inputField = await screen.findByLabelText(/email address/i);
    const submitBtn = await screen.findByLabelText(/submit/i);
    await user.type(inputField, "keech@mail.yu");
    await user.click(submitBtn);
    const successMessage = await screen.findByRole("alert");
    expect(successMessage).toBeInTheDocument();
    expect(successMessage).toHaveAttribute("class", "success");
    expect(successMessage.textContent).toMatch(/reset link sent to inbox/i)
  });
})
