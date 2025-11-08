import { renderHook } from "@testing-library/react";
import useEditWorkout from "./useEditWorkout";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("useEditWorkout()", () => {
  it("should return editWorkout function", () => {
    const wrapper = ({ children }) => {
      return <Provider store={store}>{children}</Provider>;
    };
    const { result } = renderHook(useEditWorkout, { wrapper });
    expect(result.current.editWorkout).toBeTruthy();
    expect(typeof result.current.editWorkout).toBe("function");
  });
});
