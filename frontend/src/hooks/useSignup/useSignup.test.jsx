import { renderHook } from "@testing-library/react";
import useSignup from "./useSignup";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("useSignup()", () => {
  const wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  it("should return signup function", () => {
    const { result } = renderHook(useSignup, { wrapper });
    expect(result.current.signup).toBeTruthy();
    expect(typeof result.current.signup).toBe("function");
  });
});
