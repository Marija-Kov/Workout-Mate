import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Login from "../Login";
import App from "../../mocks/App";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { Provider } from "react-redux";
import store from "../../redux/store";

afterAll(() => {
  global.Storage.prototype.setItem.mockReset();
  global.Storage.prototype.getItem.mockReset();
});

describe("<Login />", () => {
  it("should render login form", () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    const emailInp = screen.getByPlaceholderText("email address");
    const passwordInp = screen.getByPlaceholderText("password");
    const forgotPasswordBtn = screen.getByRole("button", { name: /forgot/i });
    const loginBtn = screen.getByRole("button", { name: /log in/i });
    expect(emailInp).toBeInTheDocument();
    expect(passwordInp).toBeInTheDocument();
    expect(forgotPasswordBtn).toBeInTheDocument();
    expect(loginBtn).toBeInTheDocument();
  });

  it("should focus form elements in right order", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    const emailInp = screen.getByPlaceholderText("email address");
    const passwordInp = screen.getByPlaceholderText("password");
    const forgotPasswordBtn = screen.getByRole("button", { name: /forgot/i });
    const loginBtn = screen.getByRole("button", { name: /log in/i });
    await user.tab();
    expect(emailInp).toHaveFocus();
    await user.tab();
    expect(passwordInp).toHaveFocus();
    await user.tab();
    expect(forgotPasswordBtn).toHaveFocus();
    await user.tab();
    expect(loginBtn).toHaveFocus();
  });

  it("should render input value as user types", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    const emailInp = screen.getByPlaceholderText("email address");
    const passwordInp = screen.getByPlaceholderText("password");
    await user.type(emailInp, "keech@mail.yu");
    await user.type(passwordInp, "abc");
    expect(emailInp).toHaveValue("keech@mail.yu");
    expect(passwordInp).toHaveValue("abc");
  });

  it("should render forgot password form when user clicks on 'forgot password'", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    const forgotPasswordBtn = screen.getByRole("button", { name: /forgot/i });
    await user.click(forgotPasswordBtn);
    const forgotPasswordForm = await screen.findByText("Reset Password");
    expect(forgotPasswordForm).toBeInTheDocument();
    const close = await screen.findByText("close");
    await user.click(close);
  });

  it("should render error element given that input value is missing", async () => {
    server.use(
      rest.post(
        `${process.env.REACT_APP_API}/api/users/login`,
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
        <Login />
      </Provider>
    );
    const loginBtn = await screen.findByText("Log in");
    await user.click(loginBtn);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/all fields must be filled/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should render error element given that email is invalid", async () => {
    server.use(
      rest.post(
        `${process.env.REACT_APP_API}/api/users/login`,
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
        <Login />
      </Provider>
    );
    const email = screen.getByPlaceholderText("email address");
    const password = screen.getByPlaceholderText("password");
    const loginBtn = await screen.findByText("Log in");
    await user.type(email, "abc");
    await user.type(password, "abcABC123!");
    await user.click(loginBtn);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/Please enter valid email address/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should render error element given that email is not registered", async () => {
    server.use(
      rest.post(
        `${process.env.REACT_APP_API}/api/users/login`,
        (req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({
              error: "That email does not exist in our database",
            })
          );
        }
      )
    );
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <Login />
      </Provider>
    );
    const email = screen.getByPlaceholderText("email address");
    const password = screen.getByPlaceholderText("password");
    const loginBtn = await screen.findByText("Log in");
    await user.type(email, "x@y.z");
    await user.type(password, "abcABC123!");
    await user.click(loginBtn);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/email does not exist/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should render error element given that password is wrong", async () => {
    server.use(
      rest.post(
        `${process.env.REACT_APP_API}/api/users/login`,
        (req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({
              error: "Invalid input or user not confirmed",
            })
          );
        }
      )
    );
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <Login />
      </Provider>
    );
    const loginBtn = await screen.findByText("Log in");
    await user.click(loginBtn);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/invalid input or user not confirmed/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should render Home page once 'log in' button is clicked given that server responds with success", async () => {
    user.setup();
    const mockLocalStorage = {};
    const storageUser = {
      id: "userId",
      email: "keech@mail.yu",
      token: "authorizationToken",
    };
    const MockHome = () => {
      return <div>Mock Home</div>;
    };
    global.Storage.prototype.setItem = jest.fn((key, value) => {
      mockLocalStorage[key] = value;
    });
    global.Storage.prototype.getItem = jest.fn((key) => mockLocalStorage[key]);

    user.logIn = () => {
      localStorage.setItem("user", JSON.stringify(storageUser));
      return render(
        <Provider store={store}>
          {localStorage.getItem("user") ? <MockHome /> : <Login />}
        </Provider>
      );
    };
    await user.logIn();
    expect(screen.getByText(/mock home/i)).toBeInTheDocument();
  });
});
