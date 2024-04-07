import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
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
  url = process.env.REACT_APP_API || "http://localhost:6060";
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
    server.use(
      rest.post(`${url}/api/users/signup`, (req, res, ctx) => {
        return res(
          ctx.status(422),
          ctx.json({
            error: "All fields must be filled",
          })
        );
      })
    );
    const { result } = renderHook(useSignup, { wrapper });
    await act(async () => result.current.signup({ email: "a@b.c" }));
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/all fields must be filled/i);
  });

  it("should set error given that email address is invalid", async () => {
    server.use(
      rest.post(`${url}/api/users/signup`, (req, res, ctx) => {
        return res(
          ctx.status(422),
          ctx.json({
            error: "Please enter valid email address",
          })
        );
      })
    );
    const { result } = renderHook(useSignup, { wrapper });
    await act(async () =>
      result.current.signup({ email: "abc", password: "abcABC123!" })
    );
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(
      /please enter valid email address/i
    );
  });

  it("should set error given that password is weak", async () => {
    server.use(
      rest.post(`${url}/api/users/signup`, (req, res, ctx) => {
        return res(
          ctx.status(422),
          ctx.json({
            error: "Password not strong enough",
          })
        );
      })
    );
    const { result } = renderHook(useSignup, { wrapper });
    await act(async () =>
      result.current.signup({ email: "a@b.c", password: "abcABC" })
    );
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/password not strong enough/i);
  });

  it("should set error given that email is already in use", async () => {
    server.use(
      rest.post(`${url}/api/users/signup`, (req, res, ctx) => {
        return res(
          ctx.status(422),
          ctx.json({
            error: "Email already in use",
          })
        );
      })
    );
    const { result } = renderHook(useSignup, { wrapper });
    await act(async () =>
      result.current.signup({ email: "a@b.c", password: "abcABC123!" })
    );
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/email already in use/i);
  });

  it("should set success message given that signup was successful", async () => {
    const { result } = renderHook(useSignup, { wrapper });
    await act(async () =>
      result.current.signup({ email: "a@b.c", password: "abcABC123!" })
    );
    let state = store.getState();
    expect(state.flashMessages.error).toBeFalsy();
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(/please check your inbox/i);
  });
});
