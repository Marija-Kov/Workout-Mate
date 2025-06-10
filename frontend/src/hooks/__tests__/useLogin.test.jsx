import { renderHook , act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
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
  url = import.meta.env.REACT_APP_API || "http://localhost:6060";
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

  it("should set error given that input value is missing", async () => {
    server.use(
      http.post(`${url}/api/users/login`, () => {
        return new HttpResponse(null, { status: 422 }).json({
          error: "All fields must be filled",
        })
      })
    );
    let state = store.getState();
    expect(state.user).toBeFalsy();
    const { result } = renderHook(useLogin, { wrapper });
    await act(async () => result.current.login({ password: "abcABC123!" }));
    state = store.getState();
    expect(state.user).toBeFalsy();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/all fields must be filled/i);
  });

  it("should set error given that email address is invalid", async () => {
    server.use(
      http.post(`${url}/api/users/login`, () => {
        return new HttpResponse(null, { status: 422 }).json({
          error: "Please enter valid email address",
        })
      })
    );
    let state = store.getState();
    expect(state.user).toBeFalsy();
    const { result } = renderHook(useLogin, { wrapper });
    await act(async () =>
      result.current.login({ email: "abc", password: "abcABC123!" })
    );
    state = store.getState();
    expect(state.user).toBeFalsy();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/please enter valid email address/i);
  });

  it("should log in given that credentials were valid", async () => {
    let state = store.getState();
    expect(state.user).toBeFalsy();
    const { result } = renderHook(useLogin, { wrapper });
    await act(async () =>
      result.current.login({ email: "a@b.c", password: "abcABC123!" })
    );
    state = store.getState();
    expect(state.user).toBeTruthy();
  });
});
