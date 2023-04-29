import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { useConfirmAccount } from "../useConfirmAccount"

describe("useConfirmAccount()", () => {
 it("should have success and error states initially set to null", () => {
    const { result } = renderHook(useConfirmAccount);
    expect(result.current.error).toBeFalsy();
    expect(result.current.success).toBeFalsy();
 });

 it("should set error state to true given that the server responded with an error", async () => {
    server.use(
      rest.get("api/users/:accountConfirmationToken", (req, res, ctx) => {
        return res(
          ctx.status(404),
          ctx.json({
            error: "Expired token or already confirmed",
          })
        );
      }));
    const { result } = renderHook(useConfirmAccount);
    await act(async () => result.current.confirmAccount());
    expect(result.current.error).toBeTruthy(); 
   });

    it("should set success state to true given that the server responded with a success response", async () => {
      const { result } = renderHook(useConfirmAccount);
      await act(async () => result.current.confirmAccount());
      expect(result.current.success).toBeTruthy();
    });
})