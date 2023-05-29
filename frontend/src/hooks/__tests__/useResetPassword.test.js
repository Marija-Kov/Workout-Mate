import { renderHook } from "@testing-library/react";
import { rest } from "msw";
import { act } from "react-dom/test-utils";
import { server } from "../../mocks/server";
import useResetPassword from "../useResetPassword";


describe("useResetPassword()", () => {
  it("should return resetPassword function and default (falsy) values of error and success states", () => {
  const { result } =  renderHook(useResetPassword);
  expect(result.current.resetPassword).toBeTruthy();
  expect(result.current.error).toBeFalsy();
  expect(result.current.success).toBeFalsy();
  });

  it("should set error state to truthy and success to falsy if resetPassword was run with bad input", async () => {
    server.use(
      rest.patch(`${process.env.REACT_APP_API}/api/reset-password/*`, (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            error: "Passwords not matching or not strong enough",
          })
        );
      })
    );
    const { result } = renderHook(useResetPassword);
    await act(() => result.current.resetPassword("token", "abcABC123", null));
    expect(result.current.success).toBeFalsy();
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toMatch(/not matching or not strong enough/i);
  });

    it("should set error state to falsy and success to truthy if resetPassword was successful", async () => {
      const { result } = renderHook(useResetPassword);
      await act(() =>
        result.current.resetPassword("token", "abcABC123!", "abcABC123!")
      );
      expect(result.current.error).toBeFalsy();
      expect(result.current.success).toBeTruthy();
      expect(result.current.success).toMatch(
        /reset successfully/i
      );
    });
});
