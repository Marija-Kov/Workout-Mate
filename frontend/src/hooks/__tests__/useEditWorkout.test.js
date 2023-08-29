import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import useEditWorkout from "../useEditWorkout";
import { Provider } from "react-redux";
import store from '../../redux/store';

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

describe("useEditWorkout()", () => {
  it("should return editWorkout function", () => {
    const { result } = renderHook(useEditWorkout, { wrapper });
    expect(result.current.editWorkout).toBeTruthy();
    expect(typeof result.current.editWorkout).toBe("function");
  });

  it("should update workout given that editWorkout was run with authorization and valid input", async () => {
    const mockWorkout = {
      id: "mockId",
      title: "lunges",
      muscle_group: "leg",
      reps: "44",
      load: "21",
      user_id: "userid"
     }
    const mockUpdate = { title: "squats" };
    server.use(
      rest.patch(`${process.env.REACT_APP_API}/api/workouts/*`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            title: mockUpdate.title,
          })
        );
      }),
    )
    dispatch({type: "LOGIN_SUCCESS", payload: mockUser})
    dispatch({type: "CREATE_WORKOUT_SUCCESS", payload: mockWorkout})
    let state = store.getState()
    expect(state.workout.workouts.workoutsChunk[0].title).toMatch(/lunges/i);
    const closeEdit = () => {};
    const { result } = renderHook(useEditWorkout, { wrapper });
    await act(() =>
    result.current.editWorkout(
          mockWorkout.id,
          mockUpdate,
          closeEdit
        )
        );
        state = store.getState()
        expect(state.workout.updateWorkoutError).toBeFalsy();
        expect(state.workout.workouts.workoutsChunk[0].title).toMatch(mockUpdate.title);
        dispatch({type: "DELETE_ALL_WORKOUTS_SUCCESS", payload: "success"});
        dispatch({type: "LOGOUT"})
      });
  
  it("should set updateWorkoutError message given that request wasn't authorized", async () => {
    const mockWorkout = {
      id: "mockId",
      title: "lunges",
      muscle_group: "leg",
      reps: "44",
      load: "21",
      user_id: "userid"
     }
    const mockUpdate = { title: "squats" };
    dispatch({type: "LOGIN_SUCCESS", payload: mockUser});
    dispatch({type: "CREATE_WORKOUT_SUCCESS", payload: mockWorkout});
    let state = store.getState()
    expect(state.workout.workouts.workoutsChunk[0].title).toMatch(mockWorkout.title);
    dispatch({type: "LOGOUT"});
    const closeEdit = () => {};
    const { result } = renderHook(useEditWorkout, { wrapper });
    await act(() =>
    result.current.editWorkout(
      mockWorkout.id,
      mockUpdate,
      closeEdit
    )
    );
    state = store.getState()
    expect(state.workout.workouts.workoutsChunk[0].title).toMatch(mockWorkout.title);
    expect(state.workout.updateWorkoutError).toBeTruthy();
    expect(state.workout.updateWorkoutError).toMatch(/you must be logged in/i);
    dispatch({type: "DELETE_ALL_WORKOUTS_SUCCESS", payload: "All workouts deleted successfully"});
  });

});
