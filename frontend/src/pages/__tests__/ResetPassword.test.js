import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ResetPassword from "../ResetPassword";

describe("<ResetPassword />", () => {
  render(<ResetPassword />);
  it("should render the reset password form", () => {
    const newPasswordInput = screen.getByLabelText("new password");
    const confirmPasswordInput = screen.getByLabelText(/confirm/i);
    const saveBtn = screen.getByText(/save/i);
    expect(newPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(saveBtn).toBeInTheDocument();
  });

  it("should focus form elements in right order", () => {
    expect(true).toBe(false);
  });

  it("should update input value as the user types the text in", () => {
    expect(true).toBe(false);
  });

  it("should respond with error message if passwords are not matching", () => {
    expect(true).toBe(false);
  });

  it("should respond with error message if new password is not strong enough", () => {
   expect(true).toBe(false);
  });

  it("should respond with error message if password reset token has expired", () => {
   expect(true).toBe(false);
  });

  it("should respond with success message and render 'log in' link if password was reset successfully", () => {
    expect(true).toBe(false);
  })
});
