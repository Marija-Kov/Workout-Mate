import { renderHook } from "@testing-library/react";
import {
  writeLargeFile,
  readLargeFile,
  deleteLargeFile,
} from "./utils/test/largeImageFile";
import useUpdateUser from "./useUpdateUser";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("useUpdateUser()", () => {
  const wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  const mockUser = {
    username: undefined,
    profileImg: undefined,
  };

  beforeAll(() => {
    writeLargeFile();
  });

  beforeEach(() => store.dispatch({ type: "LOGIN", payload: mockUser }));

  afterAll(() => {
    deleteLargeFile();
  });

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

  it("should set error if image is too large", async () => {
    const tooLargeImgUrl = readLargeFile();
    const { result } = renderHook(useUpdateUser, { wrapper });
    await result.current.updateUser("abc", tooLargeImgUrl);
    let state = store.getState();
    expect(state.user.profileImg).toBe(mockUser.profileImg);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/image too big/i);
  });
});
