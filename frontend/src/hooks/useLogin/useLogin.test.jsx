import { renderHook } from "@testing-library/react";
import useLogin from "./useLogin";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("useLogin()", () => {
  it("should return login function", () => {
    const wrapper = ({ children }) => {
      return <Provider store={store}>{children}</Provider>;
    };
    const { result } = renderHook(useLogin, { wrapper });
    expect(result.current.login).toBeTruthy();
    expect(typeof result.current.login).toBe("function");
  });
});
