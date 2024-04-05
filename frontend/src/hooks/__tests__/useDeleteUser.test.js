import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { useDeleteUser } from "../useDeleteUser";
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
  url = process.env.REACT_APP_API || "http://localhost:6060";
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
    server.use(
      rest.delete(
        `${url}/api/users/*`,
        (req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({
              error: "Not authorized",
            })
          );
        }
      )
    );
    const { result } = renderHook(useDeleteUser, { wrapper });
    await act(() => result.current.deleteUser(mockUser.id));
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/not authorized/i);
  });

  it("should delete user successfully given that the user is authorized", async () => {
    const { result } = renderHook(useDeleteUser, { wrapper });
    act(() => dispatch({ type: "LOGIN", payload: mockUser }));
    await act(() => result.current.deleteUser(mockUser.id));
    let state = store.getState();
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(/account deleted successfully/i);
  });
});
