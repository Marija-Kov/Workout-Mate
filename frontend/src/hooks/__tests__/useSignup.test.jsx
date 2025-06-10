import { renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import { useSignup } from "../useSignup";
import { Provider } from "react-redux";
import store from "../../redux/store";

let wrapper;
let url;

beforeAll(() => {
  wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  url = import.meta.env.REACT_APP_API || "http://localhost:6060";
});

afterAll(() => {
  wrapper = null;
  url = null;
});

describe("useSignup()", () => {
  it("should return signup function", () => {
    const { result } = renderHook(useSignup, { wrapper });
    expect(result.current.signup).toBeTruthy();
    expect(typeof result.current.signup).toBe("function");
  });

  it("should set error given that input value is missing", async () => {
    const { result } = renderHook(useSignup, { wrapper });
    await result.current.signup({ email: "a@b.c" });
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/all fields must be filled/i);
  });

  it("should set error given that email address is invalid", async () => {
    const { result } = renderHook(useSignup, { wrapper });
    await result.current.signup({ email: "abc", password: "abcABC123!" });
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(
      /please enter valid email address/i
    );
  });

  it("should set error given that password is weak", async () => {
    const { result } = renderHook(useSignup, { wrapper });
    await result.current.signup({ email: "a@b.c", password: "abcABC" });
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/password not strong enough/i);
  });

  it("should set error given that email is already in use", async () => {
    // TODO: runtime interception not working!
    // This actually reaches the point where interception should happen 
    // and fails at intercepting;
    // -- Below is the case with every test failing at runtime server request interception -- 
    // It complains when server.use() receives an array as an argument,
    // when http.post() is given wrong argument type,
    // it registers the handler (console.log(server.listHandlers()[0]) after server.use()),
    // but it does not _use_ the handler. It uses the initial handler instead.
    server.use(
      http.post(`${url}/api/users/signup`, () => {
        return HttpResponse.json({
          error: "Email already in use",
        }, { status: 422 })
      })
    );
    // This logs the runtime handler as registered:
    // console.log(server.handlersController.rootContext.handlers[0].resolver.toString())
    const { result } = renderHook(useSignup, { wrapper });
    await result.current.signup({ email: "a@b.c", password: "abcABC123!" });
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/email already in use/i);
  });

  it("should set success message given that signup was successful", async () => {
    const { result } = renderHook(useSignup, { wrapper });
    await result.current.signup({ email: "a@b.c", password: "abcABC123!" });
    let state = store.getState();
    expect(state.flashMessages.error).toBeFalsy();
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(/please check your inbox/i);
  });
});
