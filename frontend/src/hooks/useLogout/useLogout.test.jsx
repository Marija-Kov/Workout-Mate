import { renderHook } from "@testing-library/react";
import useLogout from "./useLogout";
import { Provider } from "react-redux";
import store from "../../redux/store";

let wrapper;
let dispatch;
let mockUser;

beforeAll(() => {
  wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  dispatch = store.dispatch;
  mockUser = {
    username: undefined,
    profileImg: undefined,
  };
});

afterAll(() => {
  wrapper = null;
  dispatch = null;
  mockUser = null;
});

describe("useLogout()", () => {
  it("should return logout function", () => {
    const { result } = renderHook(useLogout, { wrapper });
    expect(result.current.logout).toBeTruthy();
    expect(typeof result.current.logout).toBe("function");
  });

  it("should log the user out properly", async () => {
    dispatch({ type: "LOGIN", payload: mockUser });
    let state = store.getState();
    expect(state.user).toBeTruthy();
    const { result } = renderHook(useLogout, { wrapper });
    await result.current.logout();
    state = store.getState();
    expect(state.user).toBeFalsy();
    expect(state.workouts.total).toBeFalsy();
    for (let key in state.routineBalance) {
      expect(state.routineBalance[key]).toBe(0);
    }
    expect(state.page).toBe(1);
    expect(state.query).toBe("");
    expect(state.toggleMountComponents.isCreateWorkoutFormMounted).toBeFalsy();
    expect(state.toggleMountComponents.isEditWorkoutFormMounted).toBeFalsy();
    expect(state.toggleMountComponents.prepopulateEditWorkoutForm).toEqual({});
    expect(state.toggleMountComponents.isForgotPasswordFormMounted).toBeFalsy();
    expect(state.toggleMountComponents.isUserMenuMounted).toBeFalsy();
    expect(state.toggleMountComponents.isUserSettingsFormMounted).toBeFalsy();
    expect(
      state.toggleMountComponents.isDeleteAccountDialogueMounted
    ).toBeFalsy();
    expect(
      state.toggleMountComponents.isSpunDownServerAlertMounted
    ).toBeFalsy();
  });
});
