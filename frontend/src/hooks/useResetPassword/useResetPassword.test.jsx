import { renderHook } from "@testing-library/react";
import useResetPassword from "./useResetPassword";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("useResetPassword()", () => {
  const wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  it("should return resetPassword function", () => {
    const { result } = renderHook(useResetPassword, { wrapper });
    expect(result.current.resetPassword).toBeTruthy();
    expect(typeof result.current.resetPassword).toBe("function");
  });
});
