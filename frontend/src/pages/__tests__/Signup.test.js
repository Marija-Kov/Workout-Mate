import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import Signup from "../Signup";
import { server, rest } from "../../mocks/server";

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

describe("<Signup />", () => {   
  it("should render signup form", () => {
    render(<Signup />);
    const signupForm = screen.getByLabelText("create an account");
    expect(signupForm).toBeInTheDocument();
  });

  it("should focus form elements in right order", async () => {
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

  it("should render input value as user types", async ()=> {
   user.setup();
   render(<Signup />);
   const emailInp = screen.getByPlaceholderText("email address");
   const passwordInp = screen.getByPlaceholderText("password");
   await user.type(emailInp, "keech@mail.yu");
   await user.type(passwordInp, "abc");
   expect(emailInp).toHaveValue("keech@mail.yu");
   expect(passwordInp).toHaveValue("abc");
  });

  it("should render error element once 'sign up' button is clicked given that server responds with error", async () => {
     server.use(
       rest.post("api/users/signup", (req, res, ctx) => {
         return res(
           ctx.status(400),
           ctx.json({
             error: "Invalid input",
           })
         );
       })
     ); 
    user.setup();
    render(<Signup />);
    const signupBtn = await screen.findByText("Sign up");
    await user.click(signupBtn);
    const errorEl = await screen.findByRole("alert");
    expect(errorEl).toBeInTheDocument();
    expect(errorEl).toHaveClass("error");
  });

  it("should render success element once 'sign up' button is clicked given that server responds with success message", async () => {
      user.setup();
      render(<Signup />)
      const signupBtn = await screen.findByText("Sign up")
      await user.click(signupBtn);
      const successEl = await screen.findByRole("alert");    
      expect(successEl).toBeInTheDocument();
      expect(successEl).toHaveClass("success");
  });

});
