import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import UserMenu from "../UserMenu";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("<UserMenu />", () => {
  it("should render UserMenu correctly", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <UserMenu />
      </Provider>
    );
    const openUserSettings = await screen.findByLabelText(
      /open user settings/i
    );
    const logoutBtn = await screen.findByLabelText(/log out/i);
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
    const openUserSettings = await screen.findByLabelText(
      /open user settings/i
    );
    const logoutBtn = await screen.findByLabelText(/log out/i);
    await user.tab();
    expect(openUserSettings).toHaveFocus();
    await user.tab();
    expect(logoutBtn).toHaveFocus();
  });

  it("should set showUserSettingsForm to true when user clicks on 'Settings' in User menu", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <UserMenu />
      </Provider>
    );
    const openUserSettings = await screen.findByLabelText(/settings/i);
    await user.click(openUserSettings);
    let state = store.getState();
    expect(state.showComponent.showUserSettingsForm).toBeTruthy();
  });
});
