import { renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import useDeleteUser from "./useDeleteUser";
import { Provider } from "react-redux";
import store from "../../redux/store";

let wrapper;
let mockUser;
let dispatch;
let url;

beforeAll(() => {
  wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  dispatch = store.dispatch;
  mockUser = {
    username: undefined,
    profileImg: undefined,
  };
  url = import.meta.env.VITE_API || "http://localhost:6060";
});

afterAll(() => {
  wrapper = null;
  mockUser = null;
  dispatch = null;
  url = null;
});

describe("useDeleteUser()", () => {
  it("should return deleteUser function", () => {
    const { result } = renderHook(useDeleteUser, { wrapper });
    expect(result.current.deleteUser).toBeTruthy();
    expect(typeof result.current.deleteUser).toBe("function");
  });

  it("should set error given that user isn't authorized", async () => {
    // TODO: runtime interception not working
    server.use(
      http.delete(`${url}/api/users/*`, () => {
        return HttpResponse.json(
          {
            error: "Not authorized",
          },
          { status: 401 }
        );
      })
    );
    const { result } = renderHook(useDeleteUser, { wrapper });
    await result.current.deleteUser(mockUser.id);
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/not authorized/i);
  });

  it("should delete user successfully given that the user is authorized", async () => {
    const { result } = renderHook(useDeleteUser, { wrapper });
    dispatch({ type: "LOGIN", payload: mockUser });
    await result.current.deleteUser(mockUser.id);
    let state = store.getState();
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(
      /account deleted successfully/i
    );
  });
});
