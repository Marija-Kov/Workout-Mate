import { renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import { useCreateWorkout } from "../useCreateWorkout";
import store from "../../redux/store";
import { Provider } from "react-redux";

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
  url = import.meta.env.REACT_APP_API || "http://localhost:6060";
});

afterAll(() => {
  wrapper = null;
  dispatch = null;
  mockUser = null;
  url = null;
});

describe("useCreateWorkout()", () => {
  it("should return createWorkout function", async () => {
    const { result } = renderHook(useCreateWorkout, { wrapper });
    expect(result.current.createWorkout).toBeTruthy();
    expect(typeof result.current.createWorkout).toBe("function");
  });

  it("should create a new workout given that user is authorized and input valid", async () => {
    const mockWorkout = {
      title: "squats",
      muscle_group: "leg",
      reps: 20,
      load: 15,
    };
    dispatch({ type: "LOGIN", payload: mockUser });
    let state = store.getState();
    const prevTotal = state.workouts.total;
    const { result } = renderHook(useCreateWorkout, { wrapper });
    await result.current.createWorkout(mockWorkout);
    state = store.getState();
    expect(state.workouts.total).toBe(prevTotal + 1);
    expect(state.workouts.workoutsChunk[0].title).toMatch(
      mockWorkout.title
    );
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(
      /successfully created workout/i
    );
  });

  it("should set error given that request wasn't authorized", async () => {
    const mockWorkout = {
      title: "squats",
      muscle_group: "leg",
      reps: 20,
      load: 15,
    };
    dispatch({ type: "LOGOUT" });
    const { result } = renderHook(useCreateWorkout, { wrapper });
    await result.current.createWorkout(mockWorkout);
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/not authorized/i);
  });

  it("should set error given that at least one input field was empty", async () => {
    server.use(
      http.post(
        `${url}/api/workouts`,
        () => {
          return new HttpResponse.json({
            error: "Please fill out the empty fields",
          }, { status: 422 })
        }
      )
    );
    const mockWorkout = { title: "squats", reps: 20 };
    dispatch({ type: "LOGIN", payload: mockUser });
    let state = store.getState();
    const prevTotal = state.workouts.total;
    const { result } = renderHook(useCreateWorkout, { wrapper });
    await result.current.createWorkout(mockWorkout);
    state = store.getState();
    expect(state.workouts.total).toBe(prevTotal);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/empty fields/i);
  });

  it("should set error given that title input was too long", async () => {
    server.use(
      http.post(
        `${url}/api/workouts`,
        () => {
          return new HttpResponse.json({
            error: "Too long title - max 30 characters",
          }, { status: 422 })
        }
      )
    );
    const mockWorkout = {
      title: "squatssssssssssssssssssssssssssssssss",
      muscle_group: "leg",
      reps: 20,
      load: 15,
    };
    dispatch({ type: "LOGIN", payload: mockUser });
    let state = store.getState();
    const prevTotal = state.workouts.total;
    const { result } = renderHook(useCreateWorkout, { wrapper });
    await result.current.createWorkout(mockWorkout);
    state = store.getState();
    expect(state.workouts.total).toBe(prevTotal);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/too long title/i);
  });

  it("should set error given that title input contained non-alphabetic characters", async () => {
    server.use(
      http.post(
        `${url}/api/workouts`,
        () => {
          return new HttpResponse.json({
            error: "Title may contain only letters",
          }, { status: 422 })
        }
      )
    );
    const mockWorkout = {
      title: "<squats>",
      muscle_group: "leg",
      reps: 20,
      load: 15,
    };
    dispatch({ type: "LOGIN", payload: mockUser });
    let state = store.getState();
    const prevTotal = state.workouts.total;
    const { result } = renderHook(useCreateWorkout, { wrapper });
    await result.current.createWorkout(mockWorkout);
    state = store.getState();
    expect(state.workouts.total).toBe(prevTotal);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(
      /title may contain only letters/i
    );
  });

  it("should set error given that load input value was too large", async () => {
    server.use(
      http.post(
        `${url}/api/workouts`,
        () => {
          return new HttpResponse.json({
            error: "load value too large",
          }, { status: 422 })
        }
      )
    );
    const mockWorkout = {
      title: "squats",
      muscle_group: "leg",
      reps: 20,
      load: 15000,
    };
    dispatch({ type: "LOGIN", payload: mockUser });
    let state = store.getState();
    const prevTotal = state.workouts.total;
    const { result } = renderHook(useCreateWorkout, { wrapper });
    await result.current.createWorkout(mockWorkout);
    state = store.getState();
    expect(state.workouts.total).toBe(prevTotal);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/load value too large/i);
  });

  it("should set error given that reps input value was too large", async () => {
    server.use(
      http.post(
        `${url}/api/workouts`,
        () => {
          return new HttpResponse.json({
            error: "reps value too large",
          }, { status: 422 })
        }
      )
    );
    const mockWorkout = {
      title: "squats",
      muscle_group: "leg",
      reps: 20000,
      load: 15,
    };
    dispatch({ type: "LOGIN", payload: mockUser });
    let state = store.getState();
    const prevTotal = state.workouts.total;
    const { result } = renderHook(useCreateWorkout, { wrapper });
    await result.current.createWorkout(mockWorkout);
    state = store.getState();
    expect(state.workouts.total).toBe(prevTotal);
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/reps value too large/i);
  });
});
