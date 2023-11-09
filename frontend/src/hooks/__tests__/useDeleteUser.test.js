import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { useDeleteUser } from "../useDeleteUser";
import { Provider } from "react-redux";
import store from "../../redux/store";

let wrapper;
let mockUser;

beforeAll(() => {
  wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
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
  mockUser = null;
});

describe("useDeleteUser()", () => {
  it("should return deleteUser function", () => {
    const { result } = renderHook(useDeleteUser, { wrapper });
    expect(result.current.deleteUser).toBeTruthy();
    expect(typeof result.current.deleteUser).toBe("function");
  });

  it("should set deleteUserError message given that deleteUser function was run without authorization", async () => {
    server.use(
      rest.delete(
        `${process.env.REACT_APP_API}/api/users/*`,
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
    expect(state.user.deleteUserError).toBeTruthy();
    expect(state.user.deleteUserError).toMatch(/not authorized/i);
  });

  it("should set deleteUserError message given that user id wasn't found", async () => {
    server.use(
      rest.delete(
        `${process.env.REACT_APP_API}/api/users/*`,
        (req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json({
              error: "User id not found",
            })
          );
        }
      )
    );
    const { result } = renderHook(useDeleteUser, { wrapper });
    await act(() => result.current.deleteUser("invalidUserId"));
    let state = store.getState();
    expect(state.user.deleteUserError).toBeTruthy();
    expect(state.user.deleteUserError).toMatch(/user id not found/i);
  });

  it("should run deleteUser function successfully given that the user is authorized", async () => {
    const { result } = renderHook(useDeleteUser, { wrapper });
    await act(() => result.current.deleteUser(mockUser.id));
    let state = store.getState();
    expect(state.user.success).toBeTruthy();
    expect(state.user.success).toMatch(/account deleted successfully/i);
  });
});
