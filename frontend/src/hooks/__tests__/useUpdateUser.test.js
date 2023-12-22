import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { useUpdateUser } from "../useUpdateUser";
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

describe("useUpdateUser()", () => {
  it("should return updateUser function", () => {
    const { result } = renderHook(useUpdateUser, { wrapper });
    expect(result.current.updateUser).toBeTruthy();
    expect(typeof result.current.updateUser).toBe("function");
  });

  it("should set updateUserError given that updateUser was run without authorization", async () => {
    const newData = {
      username: "keechrr",
      profileImg: "profileImgString",
    };
    const { result } = renderHook(useUpdateUser, { wrapper });
    await act(() =>
      result.current.updateUser(newData.username, newData.profileImg)
    );
    let state = store.getState();
    expect(state.user.updateUserError).toBeTruthy();
    expect(state.user.updateUserError).toMatch(/not authorized/i);
  });

  it("should set updateUserError given that updateUser was run with too long username", async () => {
    dispatch({ type: "LOGIN_SUCCESS", payload: mockUser });
    const { result } = renderHook(useUpdateUser, { wrapper });
    await act(() => result.current.updateUser("thisUsernameIsTooLong444555"));
    let state = store.getState();
    expect(state.user.user.username).toBe(mockUser.username);
    expect(state.user.updateUserError).toBeTruthy();
    expect(state.user.updateUserError).toMatch(/too long username/i);
    act(() => dispatch({ type: "LOGOUT" }));
  });

  it("should set updateUserError given that updateUser was run with username containing invalid character types", async () => {
    dispatch({ type: "LOGIN_SUCCESS", payload: mockUser });
    const { result } = renderHook(useUpdateUser, { wrapper });
    await act(() => result.current.updateUser("i,n-v@l!d"));
    let state = store.getState();
    expect(state.user.user.username).toBe(mockUser.username);
    expect(state.user.updateUserError).toBeTruthy();
    expect(state.user.updateUserError).toMatch(
      /may only contain letters, numbers, dots and underscores/i
    );
    act(() => dispatch({ type: "LOGOUT" }));
  });

  it("should run updateUser, set success state to 'true', error state to 'false' given that user is authorized and input is valid", async () => {
    const newData = {
      username: "keech.rr_",
      profileImg: "profileImgString",
    };
    server.use(
      rest.patch(
        `${process.env.REACT_APP_API}/api/users/*`,
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              user: {
                id: mockUser.id,
                email: mockUser.email,
                token: mockUser.token,
                username: newData.username,
                profileImg: newData.profileImg,
                tokenExpires: mockUser.tokenExpires,
              },
              success: "Profile updated",
            })
          );
        }
      )
    );
    dispatch({ type: "LOGIN_SUCCESS", payload: mockUser });
    const { result } = renderHook(useUpdateUser, { wrapper });
    await act(() =>
      result.current.updateUser(newData.username, newData.profileImg)
    );
    let state = store.getState();
    expect(state.user.user.username).toBe(newData.username);
    expect(state.user.user.profileImg).toBe(newData.profileImg);
    expect(state.user.success).toBeTruthy();
    expect(state.user.updateUserError).toBeFalsy();
    expect(state.user.success).toMatch(/profile updated/i);
    act(() => dispatch({ type: "LOGOUT" }));
  });
});
