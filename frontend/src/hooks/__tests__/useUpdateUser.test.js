import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import {
  writeLargeFile,
  readLargeFile,
  deleteLargeFile,
} from "../../utils/test/largeImageFile";
import { server } from "../../mocks/server";
import { useUpdateUser } from "../useUpdateUser";
import { Provider } from "react-redux";
import store from "../../redux/store";

let wrapper;
let dispatch;
let mockUser;

beforeAll(async () => {
  wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  dispatch = store.dispatch;
  mockUser = {
    username: undefined,
    profileImg: undefined,
  };
  writeLargeFile();
});

afterAll(async () => {
  wrapper = null;
  dispatch = null;
  mockUser = null;
  deleteLargeFile();
});

describe("useUpdateUser()", () => {
  it("should return updateUser function", () => {
    const { result } = renderHook(useUpdateUser, { wrapper });
    expect(result.current.updateUser).toBeTruthy();
    expect(typeof result.current.updateUser).toBe("function");
  });

  it("should set error given that user is not authorized", async () => {
    dispatch({ type: "LOGOUT" });
    const newData = {
      username: "keechrr",
      profileImg: "profileImgString",
    };
    const { result } = renderHook(useUpdateUser, { wrapper });
    await act(() =>
      result.current.updateUser(newData.username, newData.profileImg)
    );
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/not authorized/i);
  });

  it("should set error given that username is too long", async () => {
    dispatch({ type: "LOGIN", payload: mockUser });
    const { result } = renderHook(useUpdateUser, { wrapper });
    await act(() => result.current.updateUser("thisUsernameIsTooLong444555"));
    let state = store.getState();
    expect(state.user.username).toBe(mockUser.username);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/too long username/i);
  });

  it("should set error given that username contains invalid characters", async () => {
    dispatch({ type: "LOGIN", payload: mockUser });
    const { result } = renderHook(useUpdateUser, { wrapper });
    await act(() => result.current.updateUser("i,n-v@l!d"));
    let state = store.getState();
    expect(state.user.username).toBe(mockUser.username);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(
      /may only contain letters, numbers, dots and underscores/i
    );
  });

  it("should set error given that image is too large", async () => {
    const tooLargeImgUrl = readLargeFile();
    dispatch({ type: "LOGIN", payload: mockUser });
    const { result } = renderHook(useUpdateUser, { wrapper });
    await act(() => result.current.updateUser("abc", tooLargeImgUrl));
    let state = store.getState();
    expect(state.user.profileImg).toBe(mockUser.profileImg);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/image too big/i);
  });

  it("should set success message given that user is authorized and input is valid", async () => {
    const newData = {
      username: "keech.rr_",
      profileImg: "profileImgString",
    };
    dispatch({ type: "LOGIN", payload: mockUser });
    const { result } = renderHook(useUpdateUser, { wrapper });
    await act(() =>
      result.current.updateUser(newData.username, newData.profileImg)
    );
    let state = store.getState();
    expect(state.user.username).toBe(newData.username);
    expect(state.user.profileImg).toBe(newData.profileImg);
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.error).toBeFalsy();
    expect(state.flashMessages.success).toMatch(/profile updated/i);
  });
});
