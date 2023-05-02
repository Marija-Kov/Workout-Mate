import { renderHook } from "@testing-library/react"
import { useCroppedImg } from "../useCroppedImg"

describe("useCroppedImg()", () => {
    it("should return getCroppedImg function", () => {
      const { result } = renderHook(useCroppedImg);
      expect(result.current.getCroppedImg).toBeTruthy();
    });
})