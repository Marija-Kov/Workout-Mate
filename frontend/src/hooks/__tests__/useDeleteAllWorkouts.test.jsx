import { renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import { useDeleteAllWorkouts } from "../useDeleteAllWorkouts";
import { Provider } from "react-redux";
import store from "../../redux/store";

let wrapper;
let dispatch;
let mockUser;
let url;

beforeAll(() => {
  wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  dispatch = store.dispatch;
  mockUser = {
    username: undefined,
    profileImg: undefined,
  };
  url = import.meta.env.VITE_API || "http://localhost:6060";
});

afterAll(() => {
  wrapper = null;
  dispatch = null;
  mockUser = null;
  url = null;
});

describe("useDeleteAllWorkouts()", () => {
  it("should return deleteAllWorkouts function", () => {
    const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
    expect(result.current.deleteAllWorkouts).toBeTruthy();
    expect(typeof result.current.deleteAllWorkouts).toBe("function");
  });

  it("should delete all workouts given that user is authorized", async () => {
    dispatch({ type: "LOGIN", payload: mockUser });
    dispatch({
      type: "SET_WORKOUTS", payload: {
        total: 2,
        limit: 3,
        allUserWorkoutsMuscleGroups: [],
        workoutsChunk: [],
        pageSpread: [1],
      },
    });
    let state = store.getState();
    expect(state.workouts.total).not.toBe(0);
    const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
    await result.current.deleteAllWorkouts();
    state = store.getState();
    expect(state.workouts.total).toBe(0);
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(/successfully deleted all workouts/i);
  });

  it("should set error given that user isn't authorized", async () => {
    dispatch({ type: "LOGIN", payload: mockUser });
    dispatch({
      type: "SET_WORKOUTS", payload: {
        total: 2,
        limit: 3,
        allUserWorkoutsMuscleGroups: [],
        workoutsChunk: [],
        pageSpread: [1],
      },
    });
    let state = store.getState();
    expect(state.workouts.total).not.toBe(0);
    dispatch({ type: "LOGIN", payload: null });
    const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
    await result.current.deleteAllWorkouts();
    state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/not authorized/i);
    expect(state.workouts.total).not.toBe(0);
  });

  it("should set error if deletion was not successful", async () => {
    // TODO: runtime interception not working
    server.use(
      http.delete(
        `${url}/api/workouts/`,
        () => {
          return HttpResponse.json({ error: "Could not delete workouts" }, { status: 500 })
        }
      )
    );
    dispatch({ type: "LOGIN", payload: mockUser });
    dispatch({
      type: "SET_WORKOUTS", payload: {
        total: 2,
        limit: 3,
        allUserWorkoutsMuscleGroups: [],
        workoutsChunk: [],
        pageSpread: [1],
      },
    });
    let state = store.getState();
    expect(state.workouts.total).not.toBe(0);
    const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
    await result.current.deleteAllWorkouts();
    state = store.getState();
    expect(state.flashMessages.success).toBeFalsy();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/could not delete workouts/i);
    expect(state.workouts.total).not.toBe(0);
  });
});
