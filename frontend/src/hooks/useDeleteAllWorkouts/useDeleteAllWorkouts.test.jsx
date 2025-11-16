import { renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../test/mocks/server";
import useDeleteAllWorkouts from "./useDeleteAllWorkouts";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("useDeleteAllWorkouts()", () => {
  const wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  const mockUser = {
    username: undefined,
    profileImg: undefined,
  };

  const url = import.meta.env.VITE_API || "http://localhost:6060";

  it("should return deleteAllWorkouts function", () => {
    const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
    expect(result.current.deleteAllWorkouts).toBeTruthy();
    expect(typeof result.current.deleteAllWorkouts).toBe("function");
  });

  it("should delete all workouts if the user is authorized", async () => {
    store.dispatch({ type: "LOGIN", payload: mockUser });
    store.dispatch({
      type: "SET_WORKOUTS",
      payload: {
        foundCount: 2,
        limit: 3,
        allMuscleGroups: [],
        chunk: [],
      },
    });
    let state = store.getState();
    expect(state.workouts.foundCount).not.toBe(0);
    const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
    await result.current.deleteAllWorkouts();
    state = store.getState();
    expect(state.workouts.foundCount).toBe(0);
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(
      /successfully deleted all workouts/i
    );
  });

  it("should set error if the user isn't authorized to delete all workouts", async () => {
    store.dispatch({ type: "LOGIN", payload: mockUser });
    store.dispatch({
      type: "SET_WORKOUTS",
      payload: {
        foundCount: 2,
        limit: 3,
        allMuscleGroups: [],
        chunk: [],
      },
    });
    let state = store.getState();
    expect(state.workouts.foundCount).not.toBe(0);
    store.dispatch({ type: "LOGIN", payload: null });
    const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
    await result.current.deleteAllWorkouts();
    state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/not authorized/i);
    expect(state.workouts.foundCount).not.toBe(0);
  });

  it("should set error if deletion was not successful", async () => {
    server.use(
      http.delete(`${url}/api/workouts/`, () => {
        return HttpResponse.json(
          { error: "Could not delete workouts" },
          { status: 500 }
        );
      })
    );
    store.dispatch({ type: "LOGIN", payload: mockUser });
    store.dispatch({
      type: "SET_WORKOUTS",
      payload: {
        foundCount: 2,
        limit: 3,
        allMuscleGroups: [],
        chunk: [],
      },
    });
    let state = store.getState();
    expect(state.workouts.foundCount).not.toBe(0);
    const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
    await result.current.deleteAllWorkouts();
    state = store.getState();
    expect(state.flashMessages.success).toBeFalsy();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/could not delete workouts/i);
    expect(state.workouts.foundCount).not.toBe(0);
  });
});
