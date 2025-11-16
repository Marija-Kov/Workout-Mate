import UserSettings from "./UserSettings";
import App from "../../test/mocks/App";
import user from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../../test/mocks/server";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("<UserSettings/>", () => {
  const mockUser = {
    username: undefined,
    profileImg: undefined,
  };

  beforeEach(() => store.dispatch({ type: "LOGIN", payload: mockUser }));

  it("should render the UserSettings component properly", () => {
    render(
      <Provider store={store}>
        <UserSettings />
      </Provider>
    );
    const closeForm = screen.getByText("close");
    const newUsername = screen.getByTestId("username");
    const fileInput = screen.getByTestId("profile-image");
    const upload = screen.getByText("Upload");
    const downloadData = screen.getByText(/download data/i);
    const deleteAccount = screen.getByText(/delete account/i);
    expect(closeForm).toBeInTheDocument();
    expect(newUsername).toBeInTheDocument();
    expect(fileInput).toBeInTheDocument();
    expect(upload).toBeInTheDocument();
    expect(upload).toHaveAttribute("disabled");
    expect(downloadData).toBeInTheDocument();
    expect(deleteAccount).toBeInTheDocument();
  });

  it("should focus the elements in the correct order", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <UserSettings />
      </Provider>
    );
    const closeForm = screen.getByText("close");
    const newUsername = screen.getByTestId("username");
    const fileInput = screen.getByTestId("profile-image");
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
    expect(fileInput).toHaveFocus();
    await user.tab();
    expect(upload).toHaveFocus();
    await user.tab();
    expect(downloadData).toHaveFocus();
    await user.tab();
    expect(deleteAccount).toHaveFocus();
  });

  it("should update new username input value when the user types", async () => {
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

  it("should trim the username input value", async () => {
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

  it("should render an input error message and disable the upload button if the username input value is too long", async () => {
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

  it("should render an input error message and disable the upload button if the username input value contains invalid characters", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <UserSettings />
      </Provider>
    );
    const newUsername = screen.getByTestId("username");
    await user.type(newUsername, "d@red*v");
    const error = await screen.findByRole("alert");
    const upload = screen.getByText("Upload");
    expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute("class", "max-chars-error");
    expect(error.textContent).toMatch(/letters, numbers, '_' and '.' allowed/i);
    expect(upload).toHaveAttribute("disabled");
  });

  it("should render an error message if the user is not authorized to update the username", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <UserSettings />
      </Provider>
    );
    const newUsername = screen.getByTestId("username");
    await user.type(newUsername, "daredev");
    const upload = screen.getByText("Upload");
    store.dispatch({ type: "LOGIN", payload: null });
    await user.click(upload);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/not authorized/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should render a success message if the profile was updated successfully", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <UserSettings />
      </Provider>
    );
    const newUsername = screen.getByTestId("username");
    await user.type(newUsername, "daredev");
    const upload = screen.getByText("Upload");
    await user.click(upload);
    const success = await screen.findByRole("alert");
    expect(success).toBeInTheDocument();
    expect(success.textContent).toMatch(/profile updated/i);
    expect(success).toHaveAttribute("class", "success flashMessage");
  });

  it("should render an error message if the user is not authorized to download the data", async () => {
    window.URL.createObjectURL = vi.fn();
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <UserSettings />
      </Provider>
    );
    const downloadData = screen.getByText(/download data/i);
    expect(downloadData).toBeInTheDocument();
    await store.dispatch({ type: "LOGIN", payload: null });
    await user.click(downloadData);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/not authorized/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
    vi.resetAllMocks();
  });

  it("should render a success message if the data download has started", async () => {
    window.URL.createObjectURL = vi.fn();
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <UserSettings />
      </Provider>
    );
    const downloadData = screen.getByText(/download data/i);
    expect(downloadData).toBeInTheDocument();

    await user.click(downloadData);
    const success = await screen.findByRole("alert");
    expect(success).toBeInTheDocument();
    expect(success.textContent).toMatch(/data download started/i);
    expect(success).toHaveAttribute("class", "success flashMessage");
    vi.resetAllMocks();
  });

  it("should render delete account dialogue component when the 'delete account' button is clicked", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <UserSettings />
      </Provider>
    );
    const deleteAccount = screen.getByText(/delete account/i);
    await user.click(deleteAccount);
    const deleteAccountDialogue =
      await screen.findByText(/this is irreversible/i);
    expect(deleteAccountDialogue).toBeInTheDocument();
  });

  it("should render server error message", async () => {
    server.use(
      http.patch(`${import.meta.env.VITE_API}/api/users`, () => {
        return new HttpResponse.json(
          {
            error: "Something went wrong",
          },
          { status: 500 }
        );
      })
    );
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <UserSettings />
      </Provider>
    );
    const newUsername = screen.getByTestId("username");
    await user.type(newUsername, "daredev");
    const upload = screen.getByText("Upload");
    await user.click(upload);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/something went wrong/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });
});
