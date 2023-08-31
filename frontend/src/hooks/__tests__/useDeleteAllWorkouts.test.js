import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { useDeleteAllWorkouts } from "../useDeleteAllWorkouts"
import { Provider } from "react-redux";
import store from '../../redux/store';

let wrapper;
let dispatch;
let mockUser;
let mockWorkouts;

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
  mockWorkouts =[{
    _id: "mockId1",
    title: "lunges",
    muscle_group: "leg",
    reps: "44",
    load: "21",
    user_id: "userid"
   },
   {
    _id: "mockId2",
    title: "situps",
    muscle_group: "ab",
    reps: "44",
    load: "21",
    user_id: "userid"
   }] ;
})

afterAll(() => {
  wrapper = null;
  dispatch = null;
  mockUser = null;
  mockWorkouts = null;
})

describe("useDeleteAllWorkouts()", () => {
  it("should return deleteAllWorkouts function", () => {
    const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
    expect(result.current.deleteAllWorkouts).toBeTruthy();
    expect(typeof result.current.deleteAllWorkouts).toBe("function");
  });

  it("should delete all workouts given that deleteAllWorkouts was run with authorization", async () => {
    dispatch({type: "LOGIN_SUCCESS", payload: mockUser})
    for(let i = 0; i < mockWorkouts.length; ++i){
     dispatch({type: "CREATE_WORKOUT_SUCCESS", payload: mockWorkouts[i]}); 
    }  
    let state = store.getState();
    expect(state.workout.workouts.total).toBe(2);
    const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
    await act(() => result.current.deleteAllWorkouts());
    state = store.getState();
    expect(state.workout.workouts.total).toBe(0);
    expect(state.workout.deleteAllWorkoutsSuccess).toBeTruthy();
    expect(state.workout.deleteAllWorkoutsError).toBeFalsy();
    dispatch({type: "LOGOUT"});
  });

    it("should set deleteAllWorkoutsError message given that deleteAllWorkouts was run without authorization", async () => {
      dispatch({type: "LOGIN_SUCCESS", payload: mockUser})
      for(let i = 0; i < mockWorkouts.length; ++i){
       dispatch({type: "CREATE_WORKOUT_SUCCESS", payload: mockWorkouts[i]}); 
      }  
      let state = store.getState();
      expect(state.workout.workouts.total).toBe(2);
      dispatch({type: "LOGOUT"});
      const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
      await act(() => result.current.deleteAllWorkouts());
      state = store.getState();
      expect(state.workout.deleteAllWorkoutsSuccess).toBeFalsy();
      expect(state.workout.deleteAllWorkoutsError).toBeTruthy();
      expect(state.workout.deleteAllWorkoutsError).toMatch(/not authorized/i);
      dispatch({type: "LOGIN_SUCCESS", payload: mockUser})
      state = store.getState();
      expect(state.workout.workouts.total).toBe(2);
      dispatch({type:"DELETE_ALL_WORKOUTS_SUCCESS", payload: "All workouts deleted successfully"})
      dispatch({type: "LOGOUT"});
    });

    it("should set deleteAllWorkoutsError deleteAllWorkouts was not successful", async () => {
      server.use(
        rest.delete(`${process.env.REACT_APP_API}/api/workouts/`, (req, res, ctx) => {
          return res(
            ctx.status(500)
          );
        })
      );
      dispatch({type: "LOGIN_SUCCESS", payload: mockUser})
      for(let i = 0; i < mockWorkouts.length; ++i){
       dispatch({type: "CREATE_WORKOUT_SUCCESS", payload: mockWorkouts[i]}); 
      }  
      let state = store.getState();
      expect(state.workout.workouts.total).toBe(2);
      const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
      await act(() => result.current.deleteAllWorkouts());
      state = store.getState();
      expect(state.workout.deleteAllWorkoutsSuccess).toBeFalsy();
      expect(state.workout.deleteAllWorkoutsError).toBeTruthy();
      expect(state.workout.workouts.total).toBe(2);
      dispatch({type:"DELETE_ALL_WORKOUTS_SUCCESS", payload: "All workouts deleted successfully"});
      dispatch({type: "LOGOUT"});
    });

});
