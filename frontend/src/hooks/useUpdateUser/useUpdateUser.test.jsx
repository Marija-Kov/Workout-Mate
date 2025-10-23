import { renderHook } from "@testing-library/react";
import {
  writeLargeFile,
  readLargeFile,
  deleteLargeFile,
} from "./utils/test/largeImageFile";
import useUpdateUser from "./useUpdateUser";
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

beforeEach(() => dispatch({ type: "LOGIN", payload: mockUser }));

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

  it("should set success message when new profile image is uploaded", async () => {
    const newMockProfileImage = "newMockProfileImage";
    const { result } = renderHook(useUpdateUser, { wrapper });
    await result.current.updateUser("abc", newMockProfileImage);
    let state = store.getState();
    expect(state.user.profileImg).toBe(newMockProfileImage);
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(/profile updated/i);
  });

  it("should set error given that image is too large", async () => {
    const tooLargeImgUrl = readLargeFile();
    const { result } = renderHook(useUpdateUser, { wrapper });
    await result.current.updateUser("abc", tooLargeImgUrl);
    let state = store.getState();
    expect(state.user.profileImg).toBe(mockUser.profileImg);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/image too big/i);
  });
});
