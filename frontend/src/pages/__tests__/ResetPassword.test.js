import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ResetPassword from "../ResetPassword";
import { server } from "../../mocks/server";
import { rest } from "msw";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("<ResetPassword />", () => {
  it("should render reset password form", () => {
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

  it("should focus form elements in the right order", async () => {
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

  it("should update input value as the user types", async () => {
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

  it("should show error message given that passwords are not matching", async () => {
    server.use(
      rest.patch(
        `${process.env.REACT_APP_API}/api/reset-password/*`,
        (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              error: "Passwords must match",
            })
          );
        }
      )
    );
    user.setup();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>
      </Provider>
    );
    const newPasswordInput = screen.getByPlaceholderText("new password");
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm/i);
    const saveBtn = screen.getByText(/save/i);
    await user.type(newPasswordInput, "abcAbacaeefwwd");
    await user.type(confirmPasswordInput, "defGUGUOIhoih");
    await user.click(saveBtn);
    const error = await screen.findByRole("alert");
    await expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute("class", "error");
    expect(error.textContent).toMatch(/must match/i);
  });

  it("should show error message given that new password is not strong enough", async () => {
    server.use(
      rest.patch(
        `${process.env.REACT_APP_API}/api/reset-password/*`,
        (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              error: "Password not strong enough",
            })
          );
        }
      )
    );
    user.setup();
    render(
      <Provider store={store}>
        <BrowserRouter>
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
    expect(error).toHaveAttribute("class", "error");
    expect(error.textContent).toMatch(/not strong enough/i);
  });

  it("should show error message given that password reset token has expired", async () => {
    server.use(
      rest.patch(
        `${process.env.REACT_APP_API}/api/reset-password/*`,
        (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              error: "Invalid token",
            })
          );
        }
      )
    );
    user.setup();
    render(
      <Provider store={store}>
        <BrowserRouter>
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
    const resend = await screen.findByText(/resend/i);
    await expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute("class", "error");
    expect(error.textContent).toMatch(/invalid/i);
    expect(resend).toBeInTheDocument();
  });

  it("should set success message and render 'log in' link if password was reset successfully", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <BrowserRouter>
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
    const loginLink = await screen.findByText(/log in/i);
    await expect(success).toBeInTheDocument();
    await expect(loginLink).toBeInTheDocument();
    expect(success).toHaveAttribute("class", "success");
    expect(success.textContent).toMatch(/success/i);
  });
});
