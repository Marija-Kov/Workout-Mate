import { renderHook } from "@testing-library/react";
import useEditWorkout from "./useEditWorkout";
import { Provider } from "react-redux";
import store from "../../redux/store";

let wrapper;
let dispatch;
let mockUser;
let mockWorkout;

beforeAll(() => {
  wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  dispatch = store.dispatch;
  mockUser = {
    username: undefined,
    profileImg: undefined,
  };
  mockWorkout = {
    id: "mockId",
    title: "lunges",
    muscle_group: "leg",
    reps: "44",
    load: "21",
    user_id: "userid",
  };
});

beforeEach(() => {
  dispatch({ type: "LOGIN", payload: mockUser });
  dispatch({ type: "CREATE_WORKOUT", payload: mockWorkout });
});

afterAll(() => {
  wrapper = null;
  dispatch = null;
  mockUser = null;
  mockWorkout = null;
});

describe("useEditWorkout()", () => {
  it("should return editWorkout function", () => {
    const { result } = renderHook(useEditWorkout, { wrapper });
    expect(result.current.editWorkout).toBeTruthy();
    expect(typeof result.current.editWorkout).toBe("function");
  });

  it("should set error given that user isn't authorized", async () => {
    const mockUpdate = { title: "squats" };
    let state = store.getState();
    expect(state.workouts.chunk[0].title).toMatch(mockWorkout.title);
    dispatch({ type: "LOGOUT" });
    const { result } = renderHook(useEditWorkout, { wrapper });
    await result.current.editWorkout(mockWorkout.id, mockUpdate);
    state = store.getState();
    expect(state.workouts.chunk[0].title).toMatch(mockWorkout.title);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/not authorized/i);
  });

  it("should set error given that title is too long", async () => {
    const mockUpdate = {
      title: "squatszzszsszszzzsszzszszszszszzszszszszszszszszzszszszsz",
    };
    let state = store.getState();
    expect(state.workouts.chunk[0].title).toMatch(mockWorkout.title);
    const { result } = renderHook(useEditWorkout, { wrapper });
    await result.current.editWorkout(mockWorkout.id, mockUpdate);
    state = store.getState();
    expect(state.workouts.chunk[0].title).toMatch(mockWorkout.title);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(
      /too long title - max 30 characters/i
    );
  });

  it("should set error given that title contains non-alphabetic characters", async () => {
    const mockUpdate = { title: "<squats>" };
    let state = store.getState();
    expect(state.workouts.chunk[0].title).toMatch(mockWorkout.title);
    const { result } = renderHook(useEditWorkout, { wrapper });
    await result.current.editWorkout(mockWorkout.id, mockUpdate);
    state = store.getState();
    expect(state.workouts.chunk[0].title).toMatch(mockWorkout.title);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(
      /title may contain only letters/i
    );
  });

  it("should set error given that reps value is too large", async () => {
    const mockUpdate = { reps: "20000" };
    let state = store.getState();
    expect(state.workouts.chunk[0].reps).toMatch(mockWorkout.reps);
    const { result } = renderHook(useEditWorkout, { wrapper });
    await result.current.editWorkout(mockWorkout.id, mockUpdate);
    state = store.getState();
    expect(state.workouts.chunk[0].reps).toMatch(mockWorkout.reps);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/reps value too large/i);
  });

  it("should set error given that load value is too large", async () => {
    const mockUpdate = { load: "20000" };
    let state = store.getState();
    expect(state.workouts.chunk[0].load).toMatch(mockWorkout.load);
    const { result } = renderHook(useEditWorkout, { wrapper });
    await result.current.editWorkout(mockWorkout.id, mockUpdate);
    state = store.getState();
    expect(state.workouts.chunk[0].load).toMatch(mockWorkout.load);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/load value too large/i);
  });
  //***This is the only case where we have to make a mock api call/response.
  //***The errors in preceeding tests are handled by the client (which means hooks aren't really being tested!).
  it("should update workout given that user is authorized and input valid", async () => {
    const mockUpdate = { title: "squats" };
    let state = store.getState();
    expect(state.workouts.chunk[0].title).toMatch(/lunges/i);
    const { result } = renderHook(useEditWorkout, { wrapper });
    await result.current.editWorkout(mockWorkout.id, mockUpdate);
    state = store.getState(); // at this point state of error is changed, but not success
    expect(state.flashMessages.error).toBeFalsy();
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(
      /successfully updated workout/i
    );
    expect(state.workouts.chunk[0].title).toMatch(mockUpdate.title);
  });
});
