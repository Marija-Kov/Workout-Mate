import { renderHook } from "@testing-library/react";
import useCreateWorkout from "./useCreateWorkout";
import store from "../../redux/store";
import { Provider } from "react-redux";

describe("useCreateWorkout()", () => {
  it("should return createWorkout function", async () => {
    const wrapper = ({ children }) => {
      return <Provider store={store}>{children}</Provider>;
    };
    const { result } = renderHook(useCreateWorkout, { wrapper });
    expect(result.current.createWorkout).toBeTruthy();
    expect(typeof result.current.createWorkout).toBe("function");
  });
});
