import { renderHook } from "@testing-library/react";
import useConfirmAccount from "./useConfirmAccount";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("useConfirmAccount()", () => {
  const wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  it("should return confirmAccount function", () => {
    const { result } = renderHook(useConfirmAccount, { wrapper });
    expect(result.current.confirmAccount).toBeTruthy();
    expect(typeof result.current.confirmAccount).toBe("function");
  });
});
