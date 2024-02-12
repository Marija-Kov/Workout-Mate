import UserSettings from "../UserSettings";
import user from "@testing-library/user-event";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../redux/store";

let dispatch;
let mockUser = {
  id: "userid",
  email: "keech@mail.yu",
  token: "authorizationToken",
  username: undefined,
  profileImg: undefined,
  tokenExpires: Date.now() + 3600000,
};

beforeAll(() => (dispatch = store.dispatch));
beforeEach(() => dispatch({ type: "LOGIN_SUCCESS", payload: mockUser }));
afterEach(() => dispatch({ type: "LOGOUT" }));
afterAll(() => {
  dispatch = null;
  mockUser = null;
});

describe("<UserSettings/>", () => {
  it("should render UserSettings component correctly", () => {
    render(
      <Provider store={store}>
        <UserSettings />
      </Provider>
    );
    const closeForm = screen.getByText("close");
    const newUsername = screen.getByTestId("username");
    const newProfileImage = screen.getByTestId("profile-image");
    const upload = screen.getByText("Upload");
    const downloadData = screen.getByText(/download data/i);
    const deleteAccount = screen.getByText(/delete account/i);
    expect(closeForm).toBeInTheDocument();
    expect(newUsername).toBeInTheDocument();
    expect(newProfileImage).toBeInTheDocument();
    expect(upload).toBeInTheDocument();
    expect(upload).toHaveAttribute("disabled");
    expect(downloadData).toBeInTheDocument();
    expect(deleteAccount).toBeInTheDocument();
  });

  it("should focus elements in correct order", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <UserSettings />
      </Provider>
    );
    const closeForm = screen.getByText("close");
    const newUsername = screen.getByTestId("username");
    const newProfileImage = screen.getByTestId("profile-image");
    const upload = screen.getByText("Upload");
    const downloadData = screen.getByText(/download data/i);
    const deleteAccount = screen.getByText(/delete account/i);
    await user.tab();
    expect(closeForm).toHaveFocus();
    await user.tab();
    expect(newUsername).toHaveFocus();
    await user.type(newUsername, "d");
    expect(upload).not.toHaveAttribute("disabled");
    await user.tab();
    expect(newProfileImage).toHaveFocus();
    await user.tab();
    expect(upload).toHaveFocus();
    await user.tab();
    expect(downloadData).toHaveFocus();
    await user.tab();
    expect(deleteAccount).toHaveFocus();
  });

  it("should update new username input value when user types", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <UserSettings />
      </Provider>
    );
    const newUsername = screen.getByTestId("username");
    await user.type(newUsername, "daredev");
    expect(newUsername).toHaveValue("daredev");
  });

  it("should trim new username input value", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <UserSettings />
      </Provider>
    );
    const input = "daredev  ";
    const newUsername = screen.getByTestId("username");
    await user.type(newUsername, input);
    expect(newUsername).toHaveValue(input.trim());
  });

  it("should render input error message and disable upload button if username input value is too long", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <UserSettings />
      </Provider>
    );
    const newUsername = screen.getByTestId("username");
    await user.type(newUsername, "daredev3343554543543553454");
    const error = await screen.findByRole("alert");
    const upload = screen.getByText("Upload");
    expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute("class", "max-chars-error");
    expect(error.textContent).toMatch(/too long/i);
    expect(upload).toHaveAttribute("disabled");
  });

  it("should render updateUserError message if server responded with an error", async () => {
    server.use(
      rest.patch(
        `${process.env.REACT_APP_API}/api/users/*`,
        (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              error: "Something went wrong",
            })
          );
        }
      )
    );
    user.setup();
    render(
      <Provider store={store}>
        <UserSettings />
      </Provider>
    );
    const newUsername = screen.getByTestId("username");
    await user.type(newUsername, "daredev");
    const upload = screen.getByText("Upload");
    await user.click(upload);
    const errorMessage = await screen.findByText(/something went wrong/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("should render updateUserError message if the user is not authorized", async () => {
    server.use(
      rest.patch(
        `${process.env.REACT_APP_API}/api/users/*`,
        (req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({
              error: "Not authorized",
            })
          );
        }
      )
    );
    user.setup();
    render(
      <Provider store={store}>
        <UserSettings />
      </Provider>
    );
    const newUsername = screen.getByTestId("username");
    await user.type(newUsername, "daredev");
    const upload = screen.getByText("Upload");
    await user.click(upload);
    const errorMessage = await screen.findByText(/not authorized/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("should render success message if profile was updated successfully", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <UserSettings />
      </Provider>
    );
    const newUsername = screen.getByTestId("username");
    await user.type(newUsername, "daredev");
    const upload = screen.getByText("Upload");
    await user.click(upload);
    const successMessage = await screen.findByText(/profile updated/i);
    expect(successMessage).toBeInTheDocument();
  });

  it("should render delete account dialogue component when 'delete account' button is clicked", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <UserSettings />
      </Provider>
    );
    const deleteAccount = screen.getByText(/delete account/i);
    await user.click(deleteAccount);
    const deleteAccountDialogue = await screen.findByText(
      /this is irreversible/i
    );
    expect(deleteAccountDialogue).toBeInTheDocument();
  });
});
