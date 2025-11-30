import { renderHook } from "@testing-library/react";
import useDeleteUser from "./useDeleteUser";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("useDeleteUser()", () => {
  const wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  it("should return deleteUser function", () => {
    const { result } = renderHook(useDeleteUser, { wrapper });
    expect(result.current.deleteUser).toBeTruthy();
    expect(typeof result.current.deleteUser).toBe("function");
  });
});
