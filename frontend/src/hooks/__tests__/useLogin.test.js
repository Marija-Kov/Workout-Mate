import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { useLogin } from "../useLogin";
import { Provider } from "react-redux";
import store from "../../redux/store";

let wrapper;
let dispatch;
let url;

beforeAll(() => {
  wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  dispatch = store.dispatch;
  url = process.env.REACT_APP_API || "http://localhost:6060";
});

afterAll(() => {
  wrapper = null;
  dispatch = null;
  url = null;
});

describe("useLogin()", () => {
  it("should return login function", () => {
    const { result } = renderHook(useLogin, { wrapper });
    expect(result.current.login).toBeTruthy();
    expect(typeof result.current.login).toBe("function");
  });

  it("should set error given that credentials were invalid", async () => {
    server.use(
      rest.post(
        `${url}/api/users/login`,
        (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              error: "Invalid credentials",
            })
          );
        }
      )
    );
    let state = store.getState();
    expect(state.user).toBeFalsy();
    const { result } = renderHook(useLogin, { wrapper });
    await act(async () => result.current.login());
    state = store.getState();
    expect(state.user).toBeFalsy();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/invalid credentials/i);
  });

  it("should log in given that credentials were valid", async () => {
    let state = store.getState();
    expect(state.user).toBeFalsy();
    const { result } = renderHook(useLogin, { wrapper });
    await act(async () => result.current.login());
    state = store.getState();
    expect(state.user).toBeTruthy();
  });
});
