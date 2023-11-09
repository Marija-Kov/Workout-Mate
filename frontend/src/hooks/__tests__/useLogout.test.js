import { renderHook, act } from "@testing-library/react";
import { useLogout } from "../useLogout";
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
    id: "userid",
    email: "keech@mail.yu",
    token: "authorizationToken",
    username: undefined,
    profileImg: undefined,
    tokenExpires: Date.now() + 3600000,
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

  it("should log the user out properly", () => {
    dispatch({ type: "LOGIN_SUCCESS", payload: mockUser });
    let state = store.getState();
    expect(state.user.user).toBeTruthy();
    const { result } = renderHook(useLogout, { wrapper });
    act(() => result.current.logout());
    state = store.getState();
    expect(state.user.user).toBeFalsy();
    expect(state.workout.workouts.total).toBeFalsy();
    for (let key in state.routineBalance) {
      expect(state.routineBalance[key]).toBe(0);
    }
    expect(state.page).toBe(0);
    expect(state.query).toBe("");
    for (let key in state.showComponent) {
      expect(state.showComponent[key]).toBeFalsy();
    }
  });
});
