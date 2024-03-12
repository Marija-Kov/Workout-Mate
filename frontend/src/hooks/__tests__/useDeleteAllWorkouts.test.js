import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { useDeleteAllWorkouts } from "../useDeleteAllWorkouts";
import { Provider } from "react-redux";
import store from "../../redux/store";

let wrapper;
let dispatch;
let mockUser;

beforeAll(() => {
  wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  dispatch = store.dispatch;
  mockUser = {
    id: "userid",
    email: "keech@mail.yu",
    username: undefined,
    profileImg: undefined,
  };
});

afterAll(() => {
  wrapper = null;
  dispatch = null;
  mockUser = null;
});

describe("useDeleteAllWorkouts()", () => {
  it("should return deleteAllWorkouts function", () => {
    const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
    expect(result.current.deleteAllWorkouts).toBeTruthy();
    expect(typeof result.current.deleteAllWorkouts).toBe("function");
  });

  it("should delete all workouts given that user is authorized", async () => {
    act(() => dispatch({ type: "LOGIN", payload: mockUser }));
    dispatch({ type: "SET_WORKOUTS", payload: {
      total: 2,
      limit: 3,
      allUserWorkoutsMuscleGroups: [],
      workoutsChunk: [],
      pageSpread: [1],
    }, });
    let state = store.getState();
    expect(state.workouts.total).not.toBe(0);
    const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
    await act(() => result.current.deleteAllWorkouts());
    state = store.getState();
    expect(state.workouts.total).toBe(0);
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(/successfully deleted all workouts/i);
  });

  it("should set error given that user isn't authorized", async () => {
    act(() => dispatch({ type: "LOGIN", payload: mockUser }));
    dispatch({ type: "SET_WORKOUTS", payload: {
      total: 2,
      limit: 3,
      allUserWorkoutsMuscleGroups: [],
      workoutsChunk: [],
      pageSpread: [1],
    }, });
    let state = store.getState();
    expect(state.workouts.total).not.toBe(0);
    act(() => dispatch({ type: "LOGIN", payload: null }));
    const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
    await act(() => result.current.deleteAllWorkouts());
    state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/not authorized/i);
    expect(state.workouts.total).not.toBe(0);
  });

  it("should set error if deletion was not successful", async () => {
    server.use(
      rest.delete(
        `${process.env.REACT_APP_API}/api/workouts/`,
        (req, res, ctx) => {
          return res(ctx.status(500));
        }
      )
    );
    act(() => dispatch({ type: "LOGIN", payload: mockUser }));
    dispatch({ type: "SET_WORKOUTS", payload: {
      total: 2,
      limit: 3,
      allUserWorkoutsMuscleGroups: [],
      workoutsChunk: [],
      pageSpread: [1],
    }, });
    let state = store.getState();
    expect(state.workouts.total).not.toBe(0);
    const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
    await act(() => result.current.deleteAllWorkouts());
    state = store.getState();
    expect(state.flashMessages.success).toBeFalsy();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/could not delete workouts/i);
    expect(state.workouts.total).not.toBe(0);
  });
});
