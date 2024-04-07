import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import Signup from "../Signup";
import App from "../../mocks/App";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("<Signup />", () => {
  it("should render signup form", () => {
    render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );
    const signupForm = screen.getByText(/create an account/i);
    expect(signupForm).toBeInTheDocument();
  });

  it("should focus form elements in right order", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );
    const email = screen.getByPlaceholderText("email address");
    const password = screen.getByPlaceholderText("password");
    const signupBtn = screen.getByRole("button", { name: /sign up/i });
    await user.tab();
    expect(email).toHaveFocus();
    await user.tab();
    expect(password).toHaveFocus();
    await user.tab();
    expect(signupBtn).toHaveFocus();
  });

  it("should render input value as user types", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );
    const email = screen.getByPlaceholderText("email address");
    const password = screen.getByPlaceholderText("password");
    await user.type(email, "keech@mail.yu");
    await user.type(password, "abc");
    expect(email).toHaveValue("keech@mail.yu");
    expect(password).toHaveValue("abc");
  });

  it("should render error element given that input value is missing", async () => {
    server.use(
      rest.post(
        `${process.env.REACT_APP_API}/api/users/signup`,
        (req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({
              error: "All fields must be filled",
            })
          );
        }
      )
    );
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <Signup />
      </Provider>
    );
    const signupBtn = await screen.findByText("Sign up");
    await user.click(signupBtn);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/all fields must be filled/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should render error element given that email is invalid", async () => {
    server.use(
      rest.post(
        `${process.env.REACT_APP_API}/api/users/signup`,
        (req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({
              error: "Please enter valid email address",
            })
          );
        }
      )
    );
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <Signup />
      </Provider>
    );
    const email = screen.getByPlaceholderText("email address");
    const password = screen.getByPlaceholderText("password");
    const signupBtn = await screen.findByText("Sign up");
    await user.type(email, "abc");
    await user.type(password, "abcABC123!");
    await user.click(signupBtn);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/please enter valid email address/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should render error element given that password is weak", async () => {
    server.use(
      rest.post(
        `${process.env.REACT_APP_API}/api/users/signup`,
        (req, res, ctx) => {
          return res(
            ctx.status(422),
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
        <App />
        <Signup />
      </Provider>
    );
    const email = screen.getByPlaceholderText("email address");
    const password = screen.getByPlaceholderText("password");
    const signupBtn = await screen.findByText("Sign up");
    await user.type(email, "a@b.c");
    await user.type(password, "abcABC");
    await user.click(signupBtn);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/password not strong enough/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should render error element given that email is already in use", async () => {
    server.use(
      rest.post(
        `${process.env.REACT_APP_API}/api/users/signup`,
        (req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({
              error: "Email already in use",
            })
          );
        }
      )
    );
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <Signup />
      </Provider>
    );
    const email = screen.getByPlaceholderText("email address");
    const password = screen.getByPlaceholderText("password");
    const signupBtn = await screen.findByText("Sign up");
    await user.type(email, "a@b.c");
    await user.type(password, "abcABC123!");
    await user.click(signupBtn);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/email already in use/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should render success element given that signup was successful", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <Signup />
      </Provider>
    );
    const email = screen.getByPlaceholderText("email address");
    const password = screen.getByPlaceholderText("password");
    await user.type(email, "a@b.c");
    await user.type(password, "abcABC123!");
    const signupBtn = await screen.findByText("Sign up");
    await user.click(signupBtn);
    const success = await screen.findByRole("alert");
    expect(success).toBeInTheDocument();
    expect(success.textContent).toMatch(
      /account created and pending confirmation/i
    );
    expect(success).toHaveAttribute("class", "success flashMessage");
  });
});
