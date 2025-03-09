import { renderHook } from "@testing-library/react";
import { act } from "react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import useDeleteWorkout from "../useDeleteWorkout";
import { Provider } from "react-redux";
import store from "../../redux/store";
import { genSampleWorkouts } from "../../utils/test/genSampleWorkouts";

let wrapper;
let dispatch;
let mockUser;
let sample;
let mockWorkouts;
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
  url = process.env.REACT_APP_API || "http://localhost:6060";
});

beforeEach(() => {
  dispatch({ type: "LOGIN", payload: mockUser });
  sample = genSampleWorkouts();
  mockWorkouts = sample.searchResults;
});

afterEach(() => {
  act(() => dispatch({ type: "GO_TO_PAGE_NUMBER", payload: 0 }));
  act(() => dispatch({ type: "SET_ROUTINE_BALANCE", payload: [] }));
  act(() =>
    dispatch({ type: "RESET_WORKOUTS_STATE" })
  );
  act(() => dispatch({ type: "LOGOUT" }));
});

afterAll(() => {
  wrapper = null;
  dispatch = null;
  mockUser = null;
  sample = null;
  mockWorkouts = null;
  url = null;
});

describe("useDeleteWorkout()", () => {
  it("should return deleteWorkout function", () => {
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    expect(result.current.deleteWorkout).toBeTruthy();
    expect(typeof result.current.deleteWorkout).toBe("function");
  });

  it("should delete workout given that user was authorized and workout id valid", async () => {
    server.use(
      rest.delete(
        `${url}/api/workouts/*`,
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              workout: mockWorkouts[1],
            })
          );
        }
      )
    );
    let state = store.getState();
    const prevTotal = state.workouts.total;
    expect(state.workouts.workoutsChunk[1]._id).toBe(
      mockWorkouts[1]._id
    );
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    await act(() => result.current.deleteWorkout(mockWorkouts[1]._id));
    state = store.getState();
    expect(state.workouts.total).toBe(prevTotal - 1);
    expect(state.workouts.workoutsChunk[1]._id).not.toBe(
      mockWorkouts[1]._id
    );
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(/successfully deleted workout/i);
  });

  it("should update page state properly when all workouts from the current page have been deleted given that current page is not the first page", async () => {
    server.use(
      rest.delete(
        `${url}/api/workouts/*`,
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              workout: mockWorkouts[3],
            })
          );
        }
      )
    );
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    await act(() => dispatch({ type: "GO_TO_PAGE_NUMBER", payload: 1 }));
    await act(() =>
      dispatch({
        type: "SET_WORKOUTS",
        payload: {
          total: sample.total,
          allUserWorkoutsMuscleGroups: sample.allWorkoutsMuscleGroups,
          workoutsChunk: mockWorkouts.slice(3, 4),
          limit: 3,
          page: 1,
          pageSpread: [1, 2, 3],
          noWorkoutsByQuery: false,
        },
      })
    );
    let state = store.getState();
    expect(state.page).toBe(1);
    expect(state.workouts.workoutsChunk.length).toBe(1);
    await act(() =>
      result.current.deleteWorkout(state.workouts.workoutsChunk[0]._id)
    );
    state = store.getState();
    setTimeout(() => {
      expect(state.page).toBe(0);
    }, 500)
  });

  it("should update page state properly when all workouts from the current page have been deleted given that current page is the first page", async () => {
    server.use(
      rest.delete(
        `${url}/api/workouts/*`,
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              workout: mockWorkouts[0],
            })
          );
        }
      )
    );
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    act(() =>
      dispatch({
        type: "SET_WORKOUTS",
        payload: {
          total: sample.total,
          allUserWorkoutsMuscleGroups: sample.allWorkoutsMuscleGroups,
          workoutsChunk: mockWorkouts.slice(0, 1),
          limit: 3,
          page: 0,
          pageSpread: [1, 2, 3],
          noWorkoutsByQuery: false,
        },
      })
    );
    let state = store.getState();
    expect(state.page).toBe(0);
    expect(state.workouts.workoutsChunk.length).toBe(1);
    await act(() =>
      result.current.deleteWorkout(state.workouts.workoutsChunk[0]._id)
    );
    state = store.getState();
    setTimeout(() => {
      expect(state.page).toBe(1);
    }, 500);
  });

  it("should set error given that user wasn't authorized", async () => {
    server.use(
      rest.delete(
        `${url}/api/workouts/*`,
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              error: "Not authorized",
            })
          );
        }
      )
    );
    let state = store.getState();
    const prevTotal = state.workouts.total;
    expect(state.workouts.workoutsChunk[1]._id).toBe(
      mockWorkouts[1]._id
    );
    act(() => dispatch({ type: "LOGIN", payload: null }));
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    await act(() => result.current.deleteWorkout(mockWorkouts[1]._id));
    state = store.getState();
    expect(state.workouts.total).toBe(prevTotal);
    expect(state.workouts.workoutsChunk[1]._id).toBe(
      mockWorkouts[1]._id
    );
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/not authorized/i);
  });

  it("should set error given that workout id was invalid", async () => {
    server.use(
      rest.delete(
        `${url}/api/workouts/*`,
        (req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json({
              error: "Invalid workout id",
            })
          );
        }
      )
    );
    let state = store.getState();
    const prevTotal = state.workouts.total;
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    await act(() => result.current.deleteWorkout("invalidWorkoutId"));
    state = store.getState();
    expect(state.workouts.total).toBe(prevTotal);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/invalid workout id/i);
  });
});
