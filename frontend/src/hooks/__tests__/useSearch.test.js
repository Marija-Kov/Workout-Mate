import { renderHook } from "@testing-library/react";
import { rest } from "msw";
import { act } from "react-dom/test-utils";
import { server } from "../../mocks/server";
import { useSearch } from "../useSearch";
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
    token: "authorizationToken",
    username: undefined,
    profileImg: undefined,
    tokenExpires: Date.now() + 3600000,
  };
});

afterAll(() => {
  wrapper = null;
  dispatch = null;
  mockUser = null;
});

describe("useSearch()", () => {
  it("should return search function", () => {
    const { result } = renderHook(useSearch, { wrapper });
    expect(result.current.search).toBeTruthy();
    expect(typeof result.current.search).toBe("function");
  });

  it("should set error to truthy if search was run without authorization", async () => {
    const { result } = renderHook(useSearch, { wrapper });
    await act(() => result.current.search("pu", 0));
    let state = store.getState();
    expect(state.workout.setWorkoutsError).toBeTruthy();
    expect(state.workout.setWorkoutsError).toMatch(/not authorized/i);
  });

  it("should set setWorkoutsError message if search was not successful", async () => {
    server.use(
      rest.get(
        `${process.env.REACT_APP_API}/api/workouts/*`,
        (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              error: "Something went wrong",
            })
          );
        }
      )
    );
    const mockWorkout = {
      id: "mockId",
      title: "lunges",
      muscle_group: "leg",
      reps: "44",
      load: "21",
      user_id: "userid",
    };
    dispatch({ type: "LOGIN_SUCCESS", payload: mockUser });
    dispatch({ type: "CREATE_WORKOUT_SUCCESS", payload: mockWorkout });
    const { result } = renderHook(useSearch, { wrapper });
    await act(() => result.current.search("lu", 0));
    let state = store.getState();
    expect(state.workout.setWorkoutsError).toBeTruthy();
    expect(state.workout.setWorkoutsError).toMatch(/something went wrong/i);
    dispatch({ type: "DELETE_ALL_WORKOUTS_SUCCESS", payload: "success" });
    act(() => dispatch({ type: "LOGOUT" }));
  });

  it("should update workout state with search result workouts given that user is authorized", async () => {
    const mockWorkouts = [
      {
        id: "mockId1",
        title: "lunges",
        muscle_group: "leg",
        reps: "44",
        load: "21",
        user_id: "userid",
      },
      {
        id: "mockId2",
        title: "pushups",
        muscle_group: "chest",
        reps: "44",
        load: "21",
        user_id: "userid",
      },
    ];
    server.use(
      rest.get(
        `${process.env.REACT_APP_API}/api/workouts/*`,
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              workoutsChunk: [...mockWorkouts.slice(0, 2)],
              allUserWorkoutsMuscleGroups: [
                ...mockWorkouts.map((m) => m.muscle_group),
              ],
              total: 2,
              limit: 3,
              noWorkoutsByQuery: false,
            })
          );
        }
      )
    );
    dispatch({ type: "LOGIN_SUCCESS", payload: mockUser });
    dispatch({ type: "CREATE_WORKOUT_SUCCESS", payload: mockWorkouts[0] });
    dispatch({ type: "CREATE_WORKOUT_SUCCESS", payload: mockWorkouts[1] });
    let state = store.getState();
    expect(state.workout.workouts.total).toBe(2);
    expect(state.workout.workouts.workoutsChunk[0].title).toMatch(
      mockWorkouts[1].title
    );
    expect(state.workout.workouts.workoutsChunk[1].title).toMatch(
      mockWorkouts[0].title
    );
    const { result } = renderHook(useSearch, { wrapper });
    await act(() =>
      result.current.search(mockWorkouts[1].title.slice(0, 1), 0)
    );
    state = store.getState();
    expect(state.workout.workouts.workoutsChunk[0].title).toBe(
      mockWorkouts[0].title
    );
    dispatch({ type: "DELETE_ALL_WORKOUTS_SUCCESS", payload: "success" });
    act(() => dispatch({ type: "LOGOUT" }));
  });
});
