import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { useCreateWorkout } from "../useCreateWorkout";
import store from "../../redux/store";
import { Provider } from "react-redux";

let wrapper;
let dispatch;
let mockUser;

beforeAll(() => {
  wrapper = ({ children }) => {
    return (
      <Provider store={store}>
          {children}
      </Provider>
    );
  };
  dispatch = store.dispatch;
  mockUser = {
    id: "userid",
    email: "keech@mail.yu",
    token: "authorizationToken",
    username: undefined,
    profileImg: undefined,
    tokenExpires: Date.now() + 3600000,
  };
})

afterAll(() => {
  wrapper = null;
  dispatch = null;
  mockUser = null;
})

describe("useCreateWorkout()", () => {
  it("should return createWorkout function", async () => {
    const { result } = renderHook(useCreateWorkout, { wrapper });
    expect(result.current.createWorkout).toBeTruthy();
    expect(typeof result.current.createWorkout).toBe("function");
  });

  it("should create a new workout when createWorkout was run with authorization and valid input", async () => {
    const mockWorkout = { title: "squats", muscle_group: "leg", reps: 20, load: 15};
    server.use(
      rest.post(`${process.env.REACT_APP_API}/api/workouts`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            title: mockWorkout.title,
            muscle_group: mockWorkout.muscle_group,
            reps: mockWorkout.reps,
            load: mockWorkout.load,
          })
        );
      }),
    )
    dispatch({type: "LOGIN_SUCCESS", payload: mockUser});
    let state = store.getState();
    expect(state.workout.workouts.total).toBe(0);
    const { result } = renderHook(useCreateWorkout, { wrapper });
    await act(() => result.current.createWorkout(mockWorkout));
    state = store.getState();
    expect(state.workout.workouts.total).toBe(1);
    expect(state.workout.workouts.workoutsChunk[0].title).toMatch(mockWorkout.title);
    act(() => dispatch({type: "DELETE_ALL_WORKOUTS_SUCCESS", payload: "success"}));
    act(() => dispatch({type: "LOGOUT"}));
  });

  it("should set createWorkoutError message given that request wasn't authorized", async () => {
    const mockWorkout = { title: "squats", muscle_group: "leg", reps: 20, load: 15 };
    const { result } = renderHook(useCreateWorkout, { wrapper });
    await act(() => result.current.createWorkout(mockWorkout));
    let state = store.getState();
    expect(state.workout.createWorkoutError).toBeTruthy();
    expect(state.workout.createWorkoutError).toMatch(/not authorized/i);
  });

  it("should set createWorkoutError message given that at least one input field was empty", async () => {
    server.use(
      rest.post(`${process.env.REACT_APP_API}/api/workouts`, (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            error: "Please fill out the empty fields",
          })
        );
      })
    );
    const mockWorkout = { title: "squats", reps: 20 };
    dispatch({type: "LOGIN_SUCCESS", payload: mockUser});
    let state = store.getState();
    expect(state.workout.workouts.total).toBe(0);
    const { result } = renderHook(useCreateWorkout, { wrapper });
    await act(() => result.current.createWorkout(mockWorkout));
    state = store.getState();
    expect(state.workout.createWorkoutError).toBeTruthy();
    expect(state.workout.createWorkoutError).toMatch(/empty fields/i);
    act(() => dispatch({type: "DELETE_ALL_WORKOUTS_SUCCESS", payload: "success"}));
    act(() => dispatch({type: "LOGOUT"}));
  });

  it("should set createWorkoutError message given that title input was too long", async () => {
    server.use(
      rest.post(`${process.env.REACT_APP_API}/api/workouts`, (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            error: "Title too long - max 30 characters",
          })
        );
      })
    );
    const mockWorkout = { title: "squatssssssssssssssssssssssssssssssss", muscle_group: "leg", reps: 20, load: 15 };
    dispatch({type: "LOGIN_SUCCESS", payload: mockUser});
    let state = store.getState();
    expect(state.workout.workouts.total).toBe(0);
    const { result } = renderHook(useCreateWorkout, { wrapper });
    await act(() => result.current.createWorkout(mockWorkout));
    state = store.getState();
    expect(state.workout.createWorkoutError).toBeTruthy();
    expect(state.workout.createWorkoutError).toMatch(/title too long/i);
    act(() => dispatch({type: "DELETE_ALL_WORKOUTS_SUCCESS", payload: "success"}));
    act(() => dispatch({type: "LOGOUT"}));
  });

  it("should set createWorkoutError message given that title input contained non-alphabetic characters", async () => {
    server.use(
      rest.post(`${process.env.REACT_APP_API}/api/workouts`, (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            error: "Title may contain only letters",
          })
        );
      })
    );
    const mockWorkout = { title: "<squats>", muscle_group: "leg", reps: 20, load: 15 };
    dispatch({type: "LOGIN_SUCCESS", payload: mockUser});
    let state = store.getState();
    expect(state.workout.workouts.total).toBe(0);
    const { result } = renderHook(useCreateWorkout, { wrapper });
    await act(() => result.current.createWorkout(mockWorkout));
    state = store.getState();
    expect(state.workout.createWorkoutError).toBeTruthy();
    expect(state.workout.createWorkoutError).toMatch(/title may contain only letters/i);
    act(() => dispatch({type: "DELETE_ALL_WORKOUTS_SUCCESS", payload: "success"}));
    act(() => dispatch({type: "LOGOUT"}));
  });

  it("should set createWorkoutError message given that load input value was too large", async () => {
    server.use(
      rest.post(`${process.env.REACT_APP_API}/api/workouts`, (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            error: "load value too large",
          })
        );
      })
    );
    const mockWorkout = { title: "squats", muscle_group: "leg", reps: 20, load: 15000 };
    dispatch({type: "LOGIN_SUCCESS", payload: mockUser});
    let state = store.getState();
    expect(state.workout.workouts.total).toBe(0);
    const { result } = renderHook(useCreateWorkout, { wrapper });
    await act(() => result.current.createWorkout(mockWorkout));
    state = store.getState();
    expect(state.workout.createWorkoutError).toBeTruthy();
    expect(state.workout.createWorkoutError).toMatch(/load value too large/i);
    act(() => dispatch({type: "DELETE_ALL_WORKOUTS_SUCCESS", payload: "success"}));
    act(() => dispatch({type: "LOGOUT"}));
  });

  it("should set createWorkoutError message given that reps input value was too large", async () => {
    server.use(
      rest.post(`${process.env.REACT_APP_API}/api/workouts`, (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            error: "reps value too large",
          })
        );
      })
    );
    const mockWorkout = { title: "squats", muscle_group: "leg", reps: 20000, load: 15 };
    dispatch({type: "LOGIN_SUCCESS", payload: mockUser});
    let state = store.getState();
    expect(state.workout.workouts.total).toBe(0);
    const { result } = renderHook(useCreateWorkout, { wrapper });
    await act(() => result.current.createWorkout(mockWorkout));
    state = store.getState();
    expect(state.workout.createWorkoutError).toBeTruthy();
    expect(state.workout.createWorkoutError).toMatch(/reps value too large/i);
    act(() => dispatch({type: "DELETE_ALL_WORKOUTS_SUCCESS", payload: "success"}));
    act(() => dispatch({type: "LOGOUT"}));
  });
});
