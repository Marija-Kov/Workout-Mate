import { renderHook } from "@testing-library/react";
import { rest } from "msw";
import { act } from "react-dom/test-utils";
import { server } from "../../mocks/server";
import useResetPassword from "../useResetPassword";
import { Provider } from "react-redux";
import store from "../../redux/store";

let wrapper;
let dispatch;

beforeAll(() => {
  wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  dispatch = store.dispatch;
});

// TODO: Reset state to init after every test.

afterAll(() => {
  wrapper = null;
  dispatch = null;
});

describe("useResetPassword()", () => {
  it("should return resetPassword function", () => {
    const { result } = renderHook(useResetPassword, { wrapper });
    expect(result.current.resetPassword).toBeTruthy();
    expect(typeof result.current.resetPassword).toBe("function");
  });

  it("should set resetPasswordError message given that resetPassword was run with bad input", async () => {
    server.use(
      rest.patch(
        `${process.env.REACT_APP_API}/api/reset-password/*`,
        (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              error: "Passwords not matching or not strong enough",
            })
          );
        }
      )
    );
    const { result } = renderHook(useResetPassword, { wrapper });
    await act(() => result.current.resetPassword("token", "abcABC123", null));
    let state = store.getState();
    expect(state.user.resetPasswordError).toBeTruthy();
    expect(state.user.resetPasswordError).toMatch(
      /passwords not matching or not strong enough/i
    );
  });

  it("should set success message given that resetPassword was successful", async () => {
    const { result } = renderHook(useResetPassword, { wrapper });
    await act(() =>
      result.current.resetPassword("token", "abcABC123!", "abcABC123!")
    );
    let state = store.getState();
    expect(state.user.success).toBeTruthy();
    expect(state.user.success).toMatch(/password reset successfully/i);
  });
});
