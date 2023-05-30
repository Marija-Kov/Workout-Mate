import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Login from "../Login";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { AuthContextProvider } from "../../context/AuthContext";

afterAll(() => {
  global.Storage.prototype.setItem.mockReset();
  global.Storage.prototype.getItem.mockReset();
});

describe("<Login />", () => {
  
  it("should render login form", () => {
    render(
     <AuthContextProvider>
        <Login />
     </AuthContextProvider>
    );
    const loginForm = screen.getByLabelText("log in");
    const forgotPassword = screen.getByText(/forgot/i);
    expect(loginForm).toBeInTheDocument();
    expect(forgotPassword).toBeInTheDocument();
  });

  it("should focus form elements in right order", async () => {
      user.setup();
      render(
        <AuthContextProvider>
          <Login />
        </AuthContextProvider>
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

  it("should render input value as user types", async ()=> {
   user.setup();
   render(
     <AuthContextProvider>
       <Login />
     </AuthContextProvider>
   );
   const emailInp = screen.getByPlaceholderText("email address");
   const passwordInp = screen.getByPlaceholderText("password");
   await user.type(emailInp, "keech@mail.yu");
   await user.type(passwordInp, "abc");
   expect(emailInp).toHaveValue("keech@mail.yu");
   expect(passwordInp).toHaveValue("abc");
  });

  it("should render reset password request form when user clicks on 'forgot password'", async () => {
   user.setup();
   render(
     <AuthContextProvider>
       <Login />
     </AuthContextProvider>
   );
   const forgotPasswordBtn = screen.getByRole("button", { name: /forgot/i });
   await user.click(forgotPasswordBtn);
   const forgotPasswordForm = await screen.findByLabelText("forgot password form");
   expect(forgotPasswordForm).toBeInTheDocument();
  });

  it("should render error element once 'log in' button is clicked given that server responds with error", async () => {
    server.use(
      rest.post(`${process.env.REACT_APP_API}/api/users/login`, (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
           error: "Invalid input or user not confirmed"
          })
        );
      })
    );
    user.setup();
    render(
      <AuthContextProvider>
        <Login />
      </AuthContextProvider>
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
        <AuthContextProvider>
          {localStorage.getItem("user") ? <MockHome /> : <Login />}
        </AuthContextProvider>
      );
    };
    await user.logIn();
    expect(screen.getByText(/mock home/i)).toBeInTheDocument();
  });
  
});

    
 
