import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import UserMenu from "./UserMenu";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("<UserMenu />", () => {
  it("should render UserMenu correctly", () => {
    user.setup();
    render(
      <Provider store={store}>
        <UserMenu />
      </Provider>
    );
    const openUserSettings = screen.getByText(/settings/i);
    const logoutBtn = screen.getByText(/log out/i);
    expect(openUserSettings).toBeInTheDocument();
    expect(logoutBtn).toBeInTheDocument();
  });

  it("should focus UserMenu elements in correct order", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <UserMenu />
      </Provider>
    );
    const openUserSettings = screen.getByText(/settings/i);
    const logoutBtn = screen.getByText(/log out/i);
    await user.tab();
    expect(openUserSettings).toHaveFocus();
    await user.tab();
    expect(logoutBtn).toHaveFocus();
  });

  it("should set isUserSettingsFormMounted to true when user clicks on 'Settings' in User menu", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <UserMenu />
      </Provider>
    );
    const openUserSettings = screen.getByText(/settings/i);
    await user.click(openUserSettings);
    let state = store.getState();
    expect(state.toggleMountComponents.isUserSettingsFormMounted).toBeTruthy();
  });
});
