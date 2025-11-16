import { renderHook } from "@testing-library/react";
import useDeleteUser from "./useDeleteUser";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("useDeleteUser()", () => {
  const wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  const mockUser = {
    username: undefined,
    profileImg: undefined,
  };

  it("should return deleteUser function", () => {
    const { result } = renderHook(useDeleteUser, { wrapper });
    expect(result.current.deleteUser).toBeTruthy();
    expect(typeof result.current.deleteUser).toBe("function");
  });

  it("should set error if the user isn't authorized to delete the account", async () => {
    const { result } = renderHook(useDeleteUser, { wrapper });
    await result.current.deleteUser(mockUser.id);
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/not authorized/i);
  });

  it("should delete user successfully if the user is authorized", async () => {
    const { result } = renderHook(useDeleteUser, { wrapper });
    store.dispatch({ type: "LOGIN", payload: mockUser });
    await result.current.deleteUser(mockUser.id);
    let state = store.getState();
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(
      /account deleted successfully/i
    );
  });
});
