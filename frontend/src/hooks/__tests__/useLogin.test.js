import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { useLogin } from "../useLogin";
import { Provider } from "react-redux";
import store from "../../redux/store";

let wrapper;
let dispatch;

beforeAll(() => {
  wrapper = ({ children }) => {
    return (
      <Provider store={store}>
          {children}
      </Provider>
    );
  };
  dispatch = store.dispatch;
})

afterAll(() => {
  wrapper = null;
  dispatch = null;
})

describe("useLogin()", () => {
  it("should return login function", () => {
    const { result } = renderHook(useLogin, { wrapper });
    expect(result.current.login).toBeTruthy();
    expect(typeof result.current.login).toBe("function");
  });

  it("should set loginError message given that the server responded with an error", async () => {
    server.use(
      rest.post(
        `${process.env.REACT_APP_API}/api/users/login`,
        (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              error: "Invalid credentials"
            })
          );
        }
      )
    );
    let state = store.getState();
    expect(state.user.user).toBeFalsy();
    const { result } = renderHook(useLogin, { wrapper });
    await act(async () => result.current.login());
    state = store.getState();
    expect(state.user.user).toBeFalsy();
    expect(state.user.loginError).toBeTruthy();
    expect(state.user.loginError).toMatch(/invalid credentials/i);
  });

  it("should set user.user state to user object given that credentials were valid", async () => {
    let state = store.getState();
    expect(state.user.user).toBeFalsy();
    const { result } = renderHook(useLogin, { wrapper });
    await act(async () => result.current.login());
    state = store.getState();
    expect(state.user.user).toBeTruthy();
    dispatch({type: "LOGOUT"})
  });

})
