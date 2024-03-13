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
    username: undefined,
    profileImg: undefined,
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

  it("should set error if user is not authorized", async () => {
    dispatch({ type: "LOGOUT" });
    const { result } = renderHook(useSearch, { wrapper });
    await act(() => result.current.search("pu", 0));
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/not authorized/i);
  });

  it("should set error if something goes wrong on the server side", async () => {
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
    dispatch({ type: "LOGIN", payload: mockUser });
    dispatch({ type: "CREATE_WORKOUT", payload: mockWorkout });
    const { result } = renderHook(useSearch, { wrapper });
    await act(() => result.current.search("lu", 0));
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/something went wrong/i);
  });

  it("should return search results given that user is authorized", async () => {
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
    dispatch({ type: "LOGIN", payload: mockUser });
    dispatch({ type: "CREATE_WORKOUT", payload: mockWorkouts[0] });
    dispatch({ type: "CREATE_WORKOUT", payload: mockWorkouts[1] });
    let state = store.getState();
    expect(state.workouts.workoutsChunk[0].title).toMatch(
      mockWorkouts[1].title
    );
    expect(state.workouts.workoutsChunk[1].title).toMatch(
      mockWorkouts[0].title
    );
    const { result } = renderHook(useSearch, { wrapper });
    await act(() =>
      result.current.search(mockWorkouts[1].title.slice(0, 1), 0)
    );
    state = store.getState();
    expect(state.workouts.workoutsChunk[0].title).toBe(
      mockWorkouts[0].title
    );
  });
});
