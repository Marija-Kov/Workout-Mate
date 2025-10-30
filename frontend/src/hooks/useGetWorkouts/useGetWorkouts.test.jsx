import { renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import useGetWorkouts from "./useGetWorkouts";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("useGetWorkouts()", () => {
  const wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  const mockUser = {
    username: undefined,
    profileImg: undefined,
  };

  const url = import.meta.env.VITE_API || "http://localhost:6060";

  it("should return getWorkouts function", () => {
    const { result } = renderHook(useGetWorkouts, { wrapper });
    expect(result.current.getWorkouts).toBeTruthy();
    expect(typeof result.current.getWorkouts).toBe("function");
  });

  it("should set error if the user is not authorized", async () => {
    store.dispatch({ type: "LOGOUT" });
    const { result } = renderHook(useGetWorkouts, { wrapper });
    await result.current.getWorkouts("pu", 0);
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/not authorized/i);
  });

  it("should set server error", async () => {
    // TODO: runtime interception not working
    server.use(
      http.get(`${url}/api/workouts/*`, () => {
        return HttpResponse.json(
          {
            error: "Something went wrong",
          },
          { status: 500 }
        );
      })
    );
    const mockWorkout = {
      id: "mockId",
      title: "lunges",
      muscle_group: "leg",
      reps: "44",
      load: "21",
      user_id: "userid",
    };
    store.dispatch({ type: "LOGIN", payload: mockUser });
    store.dispatch({ type: "CREATE_WORKOUT", payload: mockWorkout });
    const { result } = renderHook(useGetWorkouts, { wrapper });
    await result.current.getWorkouts("lu", 0);
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/something went wrong/i);
  });

  it("should return search results if the user is authorized", async () => {
    // TODO: all mock items used in one test should come from one source
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
    store.dispatch({ type: "LOGIN", payload: mockUser });
    store.dispatch({ type: "CREATE_WORKOUT", payload: mockWorkouts[0] });
    store.dispatch({ type: "CREATE_WORKOUT", payload: mockWorkouts[1] });
    let state = store.getState();
    expect(state.workouts.chunk[0].title).toMatch(mockWorkouts[1].title);
    expect(state.workouts.chunk[1].title).toMatch(mockWorkouts[0].title);
    const { result } = renderHook(useGetWorkouts, { wrapper });
    await result.current.getWorkouts(mockWorkouts[1].title.slice(0, 1), 0);
    state = store.getState();
    expect(state.workouts.chunk[0].title).toBe(mockWorkouts[0].title);
  });
});
