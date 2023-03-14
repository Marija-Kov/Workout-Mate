import { renderHook, act } from "@testing-library/react";
import { useSignup } from "../useSignup";

describe("useSignup", ()=> {

    it("should have error, isLoading and verificationNeeded states initially set to null", () => {
        const { result } = renderHook(useSignup);
        expect(result.current.error).toBeFalsy()
        expect(result.current.isLoading).toBeFalsy();
        expect(result.current.verificationNeeded).toBeFalsy();
    });

})