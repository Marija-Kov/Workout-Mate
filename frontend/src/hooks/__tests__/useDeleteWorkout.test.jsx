import { renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";
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
  url = import.meta.env.REACT_APP_API || "http://localhost:6060";
});

beforeEach(() => {
  dispatch({ type: "LOGIN", payload: mockUser });
  sample = genSampleWorkouts();
  mockWorkouts = sample.searchResults;
});

afterEach(() => {
  dispatch({ type: "GO_TO_PAGE_NUMBER", payload: 0 });
  dispatch({ type: "SET_ROUTINE_BALANCE", payload: [] });
  dispatch({ type: "RESET_WORKOUTS_STATE" });
  dispatch({ type: "LOGOUT" });
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
    let state = store.getState();
    const prevTotal = state.workouts.total;
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    await result.current.deleteWorkout("w2");
    state = store.getState();
    expect(state.workouts.total).toBe(prevTotal - 1);
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(/successfully deleted workout/i);
  });

  it("should update page state properly when all workouts from the current page have been deleted given that current page is not the first page", async () => {
    dispatch({
      type: "SET_WORKOUTS",
      payload: {
        total: sample.total,
        allUserWorkoutsMuscleGroups: sample.allUserWorkoutsMuscleGroups,
        workoutsChunk: mockWorkouts.slice(3, 4),
        limit: 3,
        page: 1,
        pageSpread: [1, 2, 3],
        noWorkoutsByQuery: false,
      },
    });
    let state = store.getState();
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    // TODO: Fails here because action.payload is always the 
    // json.workout from the initial happy path handler
    await result.current.deleteWorkout(state.workouts.workoutsChunk[0]._id);
    state = store.getState();
    expect(state.page).toBe(0);
  });
  
  it("should update page state properly when all workouts from the current page have been deleted given that current page is the first page", async () => {
    dispatch({
      type: "SET_WORKOUTS",
      payload: {
        total: sample.total,
        allUserWorkoutsMuscleGroups: sample.allUserWorkoutsMuscleGroups,
        workoutsChunk: mockWorkouts.slice(0, 1),
        limit: 3,
        page: 0,
        pageSpread: [1, 2, 3],
        noWorkoutsByQuery: false,
      },
    });
    let state = store.getState();
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    // TODO: Fails here because action.payload is always the 
    // json.workout from the initial happy path handler
    await result.current.deleteWorkout(state.workouts.workoutsChunk[0]._id);
    state = store.getState();
    expect(state.workouts.workoutsChunk.length).toBe(3);
    expect(state.page).toBe(1);
  });

  it("should set error given that user wasn't authorized", async () => {
    let state = store.getState();
    const prevTotal = state.workouts.total;
    expect(state.workouts.workoutsChunk[1]._id).toBe(
      mockWorkouts[1]._id
    );
    dispatch({ type: "LOGIN", payload: null });
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    await result.current.deleteWorkout("w0");
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
      http.delete(
        `${url}/api/workouts/*"`,
        () => {
          return HttpResponse.json({
            error: "Invalid workout id",
          }, { status: 422 });
        }
      )
    );
    let state = store.getState();
    const prevTotal = state.workouts.total;
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    await result.current.deleteWorkout("invalidWorkoutId");
    state = store.getState();
    expect(state.workouts.total).toBe(prevTotal);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/invalid workout id/i);
  });
});
