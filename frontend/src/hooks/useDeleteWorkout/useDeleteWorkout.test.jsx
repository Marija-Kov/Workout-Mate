import { renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../test/mocks/server";
import useDeleteWorkout from "./useDeleteWorkout";
import { Provider } from "react-redux";
import store from "../../redux/store";
import { genSampleWorkouts } from "../../utils/test/genSampleWorkouts";

describe("useDeleteWorkout()", () => {
  const wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  const mockUser = {
    username: undefined,
    profileImg: undefined,
  };

  const url = import.meta.env.VITE_API || "http://localhost:6060";

  const sample = genSampleWorkouts();

  beforeEach(() => {
    store.dispatch({ type: "LOGIN", payload: mockUser });
  });

  afterEach(() => {
    store.dispatch({ type: "GO_TO_PAGE_NUMBER", payload: 0 });
    store.dispatch({ type: "RESET_WORKOUTS_STATE" });
    store.dispatch({ type: "LOGOUT" });
  });

  it("should return deleteWorkout function", () => {
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    expect(result.current.deleteWorkout).toBeTruthy();
    expect(typeof result.current.deleteWorkout).toBe("function");
  });

  it("should delete workout if the user was authorized and workout id valid", async () => {
    store.dispatch({
      type: "SET_WORKOUTS",
      payload: {
        foundCount: sample.foundCount,
        allMuscleGroups: sample.allMuscleGroups,
        chunk: sample.searchResults.slice(0, 3),
        limit: 3,
        noneFound: false,
      },
    });
    let state = store.getState();
    const prevCount = state.workouts.foundCount;
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    await result.current.deleteWorkout(state.workouts.chunk[0]._id); // must be an _id from the current chunk
    state = store.getState();
    expect(state.workouts.foundCount).toBe(prevCount - 1);
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(
      /successfully deleted workout/i
    );
  });

  it("should set error if the user isn't authorized to delete a workout", async () => {
    store.dispatch({
      type: "SET_WORKOUTS",
      payload: {
        foundCount: sample.foundCount,
        allMuscleGroups: sample.allMuscleGroups,
        chunk: sample.searchResults.slice(0, 3),
        limit: 3,
        noneFound: false,
      },
    });
    let state = store.getState();
    const prevCount = state.workouts.foundCount;
    store.dispatch({ type: "LOGIN", payload: null });
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    await result.current.deleteWorkout(state.workouts.chunk[0]._id);
    state = store.getState();
    expect(state.workouts.foundCount).toBe(prevCount);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/not authorized/i);
  });

  it("should set error if the workout id is invalid", async () => {
    server.use(
      http.delete(`${url}/api/workouts/*`, () => {
        return HttpResponse.json(
          {
            error: "Invalid workout id",
          },
          { status: 422 }
        );
      })
    );
    let state = store.getState();
    const prevCount = state.workouts.foundCount;
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    await result.current.deleteWorkout("invalidWorkoutId");
    state = store.getState();
    expect(state.workouts.foundCount).toBe(prevCount);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/invalid workout id/i);
  });

  it("should trigger page state update to the previous page once the last workout from the current page is deleted if the current page is not the first page", async () => {
    store.dispatch({
      type: "SET_WORKOUTS",
      payload: {
        foundCount: sample.foundCount,
        allMuscleGroups: sample.allMuscleGroups,
        chunk: sample.searchResults.slice(0, 1), // make sure that it has the same workout _id as the mock response used for this test
        limit: 3,
        noneFound: false,
      },
    });
    store.dispatch({ type: "GO_TO_PAGE_NUMBER", payload: 2 });
    let state = store.getState();
    expect(state.page).toBe(2); // confirm that it's not on the first page
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    await result.current.deleteWorkout(state.workouts.chunk[0]._id);
    state = store.getState();
    expect(state.page).toBe(1); // confirm that it flipped to the previous page
  });

  it("should trigger page state update to page 2 then back to page 1 when the last workout on page 1 has been deleted", async () => {
    vi.useFakeTimers();
    store.dispatch({
      type: "SET_WORKOUTS",
      payload: {
        foundCount: sample.foundCount,
        allMuscleGroups: sample.allMuscleGroups,
        chunk: sample.searchResults.slice(0, 1),
        limit: 3,
        noneFound: false,
      },
    });
    store.dispatch({ type: "GO_TO_PAGE_NUMBER", payload: 1 });
    let state = store.getState();
    expect(state.page).toBe(1);
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    await result.current.deleteWorkout(state.workouts.chunk[0]._id);
    state = store.getState();
    expect(state.page).toBe(2);
    vi.runAllTimers();
    state = store.getState();
    expect(state.page).toBe(1);
  });

  it("should trigger routine balance state update upon workout deletion", async () => {
    store.dispatch({
      type: "SET_WORKOUTS",
      payload: {
        foundCount: sample.foundCount,
        allMuscleGroups: sample.allMuscleGroups,
        chunk: sample.searchResults.slice(0, 3),
        limit: 3,
        noneFound: false,
      },
    });
    store.dispatch({
      type: "SET_ROUTINE_BALANCE",
      payload: sample.allMuscleGroups,
    });
    let state = store.getState();
    const observedMuscleGroup = state.workouts.chunk[0].muscle_group; // the muscle group of the workout that we're going to delete
    const prevPercentage = state.routineBalance[observedMuscleGroup];
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    await result.current.deleteWorkout(state.workouts.chunk[0]._id);
    state = store.getState(); // request state to get updated value of state.workouts.allMuscleGroups
    store.dispatch({
      type: "SET_ROUTINE_BALANCE",
      payload: state.workouts.allMuscleGroups,
    }); // Chart.jsx runs this
    state = store.getState(); // request state to get updated value of state.routineBalance
    const currPercentage = state.routineBalance[observedMuscleGroup];
    expect(Math.abs(currPercentage - prevPercentage)).not.toBe(0);
  });
});
