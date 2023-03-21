import { render, screen, cleanup } from "@testing-library/react";
import user from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Login from "../Login";
import { server, rest } from "../../mocks/server";
import { AuthContextProvider } from "../../context/AuthContext";

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

describe("Login page", () => {
  
  it("should render the login form", () => {
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

  it("should focus form elements in the right order", async () => {
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

  it("should render the input value as the user types", async ()=> {
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

  it("should render forgot password form when the user clicks on forgot password", async () => {
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

  it("should render error element once the login button is clicked given that the server responds with an error", async () => {
    server.use(
      rest.post("api/users/login", (req, res, ctx) => {
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
    await expect(errorEl).toBeInTheDocument();
    await expect(errorEl).toHaveClass("error");
  });

  it("should render home page once the user logs in given that the server responds with success", async () => {
    user.setup();
    const MockHome = () => {
      return <div>MockHome</div>;
    };
    let userLoggedIn = false;
    await renderPage(userLoggedIn);
    user.logIn = (userLoggedIn) => !userLoggedIn;
    const loginBtn = await screen.findByText("Log in");
    expect(loginBtn).toBeInTheDocument();
    await renderPage(user.logIn(userLoggedIn));
    await expect(await screen.findByText("MockHome")).toBeInTheDocument();

    async function renderPage(userLoggedIn) {
      cleanup();
      return render(
        <AuthContextProvider>
          {userLoggedIn ? <MockHome /> : <Login />}
        </AuthContextProvider>
      );
    }
  });
  
});
