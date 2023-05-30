import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { useSignup } from "../useSignup";



describe("useSignup()", ()=> {
    it("should have error, isLoading and verificationNeeded states initially set to null", () => {
        const { result } = renderHook(useSignup);
        expect(result.current.error).toBeFalsy()
        expect(result.current.isLoading).toBeFalsy();
        expect(result.current.verificationNeeded).toBeFalsy();
    });

     it("should set error state to true given that the server responded with an error", async () => {
       server.use(
         rest.post(
           `${process.env.REACT_APP_API}/api/users/signup`,
           (req, res, ctx) => {
             return res(ctx.status(400), ctx.json({
                error: "Invalid input"
             })); 
           }
         )
       ); 
      const { result } = renderHook(useSignup);
         await act(async () =>
           result.current.signup()
         );
        expect(result.current.error).toBeTruthy(); 
     });

    it("should set verificationNeeded state to true given that the server responded with a success message", async () => {
      const { result } = renderHook(useSignup);
      await act(async () => result.current.signup());
      expect(result.current.verificationNeeded).toBeTruthy();
    })

})