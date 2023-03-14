import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import Signup from "../Signup";

describe("Signup page", () => {

  it("should render the signup form", () => {
    render(<Signup />);
    const signupForm = screen.getByLabelText("create an account");
    expect(signupForm).toBeInTheDocument();
  });

  it("should focus form elements in the right order", async () => {
    user.setup();
    render(<Signup />);
    const emailInp = screen.getByPlaceholderText("email address");
    const passwordInp = screen.getByPlaceholderText("password");
    const signupBtn = screen.getByRole("button", { name: /sign up/i });
    await user.tab();
    expect(emailInp).toHaveFocus();
    await user.tab();
    expect(passwordInp).toHaveFocus();
    await user.tab();
    expect(signupBtn).toHaveFocus();
  });

  it("should render the input value as the user types", async ()=> {
   user.setup();
   render(<Signup />);
   const emailInp = screen.getByPlaceholderText("email address");
   const passwordInp = screen.getByPlaceholderText("password");
   await user.type(emailInp, "keech@goodmail.yu");
   await user.type(passwordInp, "abcABC123!");
   expect(emailInp).toHaveValue("keech@goodmail.yu");
   expect(passwordInp).toHaveValue("abcABC123!");
  })

});
