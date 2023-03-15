import { renderHook, screen, act, render, fireEvent, waitFor } from "@testing-library/react";
import { server, rest } from "../../mocks/server";
import { useSignup } from "../useSignup";
import Signup from "../../pages/Signup";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("useSignup", ()=> {

    it("should have error, isLoading and verificationNeeded states initially set to null", () => {
        const { result } = renderHook(useSignup);
        expect(result.current.error).toBeFalsy()
        expect(result.current.isLoading).toBeFalsy();
        expect(result.current.verificationNeeded).toBeFalsy();
    });

     it("should set error state to true if at least one input value is invalid", async () => {
       server.use(
         rest.post(
           "api/users/signup",
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
        render(<Signup />)
       await expect(result.current.error).toBeTruthy();
     });

    it("should set verificationNeeded state to true if all input values are valid", async () => {
        const { result } = renderHook(useSignup);   
        await act(async () =>
          result.current.signup()
        );
        await expect(result.current.verificationNeeded).toBeTruthy()
    })

})