import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Login from "../Login";
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
  });

  it("should render error element once 'log in' button is clicked given that server responds with error", async () => {
    server.use(
      rest.post(
        `${process.env.REACT_APP_API}/api/users/login`,
        (req, res, ctx) => {
          return res(
            ctx.status(400),
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
        <Login />
      </Provider>
    );
    const loginBtn = await screen.findByText("Log in");
    await user.click(loginBtn);
    const errorEl = await screen.findByRole("alert");
    expect(errorEl).toBeInTheDocument();
    expect(errorEl).toHaveClass("error");
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
