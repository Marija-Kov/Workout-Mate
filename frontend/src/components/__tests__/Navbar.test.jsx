import { render, screen } from "@testing-library/react";
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
    username: undefined,
    profileImg: undefined,
  };
});

afterAll(() => {
  dispatch({ type: "RESET_COMPONENTS_STATE" });
  mockUser = null;
  dispatch = null;
});

describe("<Navbar />", () => {
  it("should render the navbar correctly when the user is not logged in", () => {
    render(
      <Provider store={store}>
        <BrowserRouter
           future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
           }}
        >
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
        <BrowserRouter
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
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
    dispatch({ type: "LOGIN", payload: mockUser });
    render(
      <Provider store={store}>
        <BrowserRouter
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
          <Navbar />
        </BrowserRouter>
      </Provider>
    );
    const helloUser = screen.getByLabelText("open user menu");
    await user.tab();
    await user.tab();
    expect(helloUser).toBeInTheDocument();
    expect(helloUser).toHaveFocus();
    dispatch({ type: "LOGOUT" });
  });

  it("should render User menu once user clicks on avatar", async () => {
    user.setup();
    dispatch({ type: "LOGIN", payload: mockUser });
    render(
      <Provider store={store}>
        <BrowserRouter
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
          <Navbar />
        </BrowserRouter>
      </Provider>
    );
    const helloUser = screen.getByLabelText("open user menu");
    await user.click(helloUser);
    const openUserSettings = await screen.findByText(
      /settings/i
    );
    const logOut = await screen.findByText(/log out/i);
    expect(openUserSettings).toBeInTheDocument();
    expect(logOut).toBeInTheDocument();
    dispatch({ type: "LOGOUT" });
  });

  it("should render User Settings once isUserSettingsFormMounted state is set to true", async () => {
    user.setup();
    dispatch({ type: "LOGIN", payload: mockUser });
    render(
      <Provider store={store}>
        <BrowserRouter
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
          <Navbar />
        </BrowserRouter>
      </Provider>
    );
    await dispatch({ type: "TOGGLE_MOUNT_USER_SETTINGS_FORM" });
    const userSettings = await screen.findByText(
      /profile settings/i
    );
    expect(userSettings).toBeInTheDocument();
    dispatch({ type: "LOGOUT" });
  });
});
