import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import Navbar from "../Navbar";
import { BrowserRouter } from "react-router-dom";
import store from "../../redux/store";
import { Provider } from "react-redux";

let mockUser;
let dispatch;

beforeAll(() => {
  dispatch = store.dispatch;
  mockUser = {
    id: "userid",
    email: "keech@mail.yu",
    token: "authorizationToken",
    username: undefined,
    profileImg: undefined,
    tokenExpires: Date.now() + 3600000,
  };
});

afterAll(() => {
  mockUser = null;
  dispatch = null;
});

describe("<Navbar />", () => {
  it("should render the navbar correctly when the user is not logged in", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );
    const aboutLink = screen.getByLabelText(/about/i);
    const loginLink = screen.getByLabelText(/login/i);
    const signupLink = screen.getByLabelText(/signup/i);
    expect(aboutLink).toBeInTheDocument();
    expect(signupLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
  });

  it("should focus navbar elements in the right order", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );
    const aboutLink = screen.getByLabelText(/about/i);
    const loginLink = screen.getByLabelText(/login/i);
    const signupLink = screen.getByLabelText(/signup/i);
    await user.tab();
    await user.tab();
    expect(aboutLink).toHaveFocus();
    await user.tab();
    expect(loginLink).toHaveFocus();
    await user.tab();
    expect(signupLink).toHaveFocus();
  });

  it("should render the navbar correctly when the user is logged in as well as focus the elements in the right order", async () => {
    user.setup();
    dispatch({ type: "LOGIN_SUCCESS", payload: mockUser });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );
    const helloUser = screen.getByLabelText("open user menu");
    await user.tab();
    await user.tab();
    expect(helloUser).toBeInTheDocument();
    expect(helloUser).toHaveFocus();
    act(() => dispatch({ type: "LOGOUT" }));
  });

  it("should render User menu once user clicks on avatar", async () => {
    user.setup();
    dispatch({ type: "LOGIN_SUCCESS", payload: mockUser });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );
    const helloUser = screen.getByLabelText("open user menu");
    await user.click(helloUser);
    const openUserSettings = await screen.findByLabelText(
      /open user settings/i
    );
    const logOut = await screen.findByLabelText(/log out/i);
    expect(openUserSettings).toBeInTheDocument();
    expect(logOut).toBeInTheDocument();
    act(() => dispatch({ type: "LOGOUT" }));
  });

  it("should render User Settings once showUserSettingForm state is set to true", async () => {
    user.setup();
    dispatch({ type: "LOGIN_SUCCESS", payload: mockUser });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );
    await act(() => dispatch({ type: "SHOW_USER_SETTINGS_FORM" }));
    const userSettingsForm = await screen.findByLabelText(
      /change user settings/i
    );
    expect(userSettingsForm).toBeInTheDocument();
    act(() => dispatch({ type: "LOGOUT" }));
  });
});
