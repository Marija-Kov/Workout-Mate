import { renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import useResetPassword from "../useResetPassword";
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
  url = import.meta.env.VITE_API || "http://localhost:6060";
});

afterAll(() => {
  wrapper = null;
  dispatch = null;
  url = null;
});

describe("useResetPassword()", () => {
  it("should return resetPassword function", () => {
    const { result } = renderHook(useResetPassword, { wrapper });
    expect(result.current.resetPassword).toBeTruthy();
    expect(typeof result.current.resetPassword).toBe("function");
  });

  it("should set error given that new password is not strong enough", async () => {
    server.use(
      http.patch(
        `${url}/api/reset-password/*`,
        () => {
          return new HttpResponse.json({
            error: "Password not strong enough",
          }, { status: 422 })
        }
      )
    );
    const { result } = renderHook(useResetPassword, { wrapper });
    await result.current.resetPassword("token", "abcABC", "abcABC");
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(
      /password not strong enough/i
    );
  });

  it("should set error given that passwords are not matching", async () => {
    server.use(
      http.patch(
        `${url}/api/reset-password/*`,
        () => {
          return new HttpResponse.json({
            error: "Passwords must match",
          }, { status: 422 })
        }
      )
    );
    const { result } = renderHook(useResetPassword, { wrapper });
    await result.current.resetPassword("token", "abcABC123!", "abcABC123#");
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(
      /passwords must match/i
    );
  });

  it("should set success message given that resetPassword was successful", async () => {
    const { result } = renderHook(useResetPassword, { wrapper });
    await result.current.resetPassword("token", "abcABC123!", "abcABC123!");
    let state = store.getState();
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(/password reset successfully/i);
  });
});
