import { renderHook , act } from "@testing-library/react";
import useCroppedImg from "./useCroppedImg";

describe("useCroppedImg()", () => {
  it("should return croppedImg function", () => {
    const { result } = renderHook(useCroppedImg);
    expect(result.current.croppedImg).toBeTruthy();
    expect(typeof result.current.croppedImg).toBe("function");
  });
});
