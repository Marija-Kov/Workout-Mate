import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ResetPassword from "../ResetPassword";
import { server } from "../../mocks/server";
import { rest } from "msw";
import { BrowserRouter } from "react-router-dom";

describe("<ResetPassword />", () => {
  it("should render the reset password form", () => {
    render(<ResetPassword />);
    const newPasswordInput = screen.getByLabelText("new password");
    const confirmPasswordInput = screen.getByLabelText(/confirm/i);
    const saveBtn = screen.getByText(/save/i);
    expect(newPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(saveBtn).toBeInTheDocument();
  });

  it("should focus form elements in right order", async () => {
    user.setup();
    render(<ResetPassword />);
    const newPasswordInput = screen.getByLabelText("new password");
    const confirmPasswordInput = screen.getByLabelText(/confirm/i);
    const saveBtn = screen.getByText(/save/i);
    await user.tab();
    expect(newPasswordInput).toHaveFocus();
    await user.tab();
    expect(confirmPasswordInput).toHaveFocus();
    await user.tab();
    expect(saveBtn).toHaveFocus();
  });

  it("should update input value as the user types the text in", async () => {
    user.setup();
    render(<ResetPassword />);
    const newPasswordInput = screen.getByLabelText("new password");
    const confirmPasswordInput = screen.getByLabelText(/confirm/i);
    await user.type(newPasswordInput, "abc");
    expect(newPasswordInput).toHaveValue("abc");
    await user.type(confirmPasswordInput, "def");
    expect(confirmPasswordInput).toHaveValue("def");
  });

  it("should respond with error message if passwords are not matching", async () => {
    server.use(
      rest.patch("/api/reset-password/*", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            error: "Passwords must match",
          })
        );
      })
    );
    user.setup();
    render(
    <BrowserRouter>
      <ResetPassword />
    </BrowserRouter> 
    );
    const newPasswordInput = screen.getByLabelText("new password");
    const confirmPasswordInput = screen.getByLabelText(/confirm/i);
    const saveBtn = screen.getByText(/save/i);
    await user.type(newPasswordInput, "abcAbacaeefwwd");
    await user.type(confirmPasswordInput, "defGUGUOIhoih");
    await user.click(saveBtn);
    const error = await screen.findByRole("alert");
    await expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute("class", "error");
    expect(error.textContent).toMatch(/must match/i);
  });

  it("should respond with error message if new password is not strong enough", async () => {
    server.use(
      rest.patch("/api/reset-password/*", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            error: "Password not strong enough",
          })
        );
      })
    );
    user.setup();
    render(
    <BrowserRouter>
      <ResetPassword />
    </BrowserRouter> 
    );
    const newPasswordInput = screen.getByLabelText("new password");
    const confirmPasswordInput = screen.getByLabelText(/confirm/i);
    const saveBtn = screen.getByText(/save/i);
    await user.type(newPasswordInput, "abc");
    await user.type(confirmPasswordInput, "abc");
    await user.click(saveBtn);
    const error = await screen.findByRole("alert");
    await expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute("class", "error");
    expect(error.textContent).toMatch(/not strong enough/i);
  });

  it("should respond with error message if password reset token has expired", async () => {
    server.use(
      rest.patch("/api/reset-password/*", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            error: "Reset token expired",
          })
        );
      })
    );
    user.setup();
    render(
    <BrowserRouter>
      <ResetPassword />
    </BrowserRouter> 
    );
    const newPasswordInput = screen.getByLabelText("new password");
    const confirmPasswordInput = screen.getByLabelText(/confirm/i);
    const saveBtn = screen.getByText(/save/i);
    await user.type(newPasswordInput, "abcABC123!");
    await user.type(confirmPasswordInput, "abcABC123!");
    await user.click(saveBtn);
    const error = await screen.findByRole("alert");
    await expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute("class", "error");
    expect(error.textContent).toMatch(/expired/i);
    expect(error.textContent).toMatch(/resend/i);
  });

  it("should respond with success message and render 'log in' link if password was reset successfully", async () => {
    user.setup();
    render(
    <BrowserRouter>
      <ResetPassword />
    </BrowserRouter> 
    );
    const newPasswordInput = screen.getByLabelText("new password");
    const confirmPasswordInput = screen.getByLabelText(/confirm/i);
    const saveBtn = screen.getByText(/save/i);
    await user.type(newPasswordInput, "abcABC123!");
    await user.type(confirmPasswordInput, "abcABC123!");
    await user.click(saveBtn);
    const success = await screen.findByRole("alert");
    await expect(success).toBeInTheDocument();
    expect(success).toHaveAttribute("class", "success");
    expect(success.textContent).toMatch(/success/i);
  })
});
