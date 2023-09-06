import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import useDeleteWorkout from "../useDeleteWorkout";
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

describe("useDeleteWorkout()", () => {
  it("should return deleteWorkout function", () => {
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    expect(result.current.deleteWorkout).toBeTruthy();
    expect(typeof result.current.deleteWorkout).toBe("function");
  });

  it("should delete a workout given that deleteWorkout was run with authorization and valid workout id", async () => {
    server.use(
      rest.delete(
        `${process.env.REACT_APP_API}/api/workouts/*`,
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              workout: mockWorkouts[1]
            })
          );
        }
      )
    );
    dispatch({type: "LOGIN_SUCCESS", payload: mockUser})
    for(let i = 0; i < mockWorkouts.length; ++i){
     dispatch({type: "CREATE_WORKOUT_SUCCESS", payload: mockWorkouts[i]}); 
    }  
    let state = store.getState();
    expect(state.workout.workouts.total).toBe(2);
    expect(state.workout.workouts.workoutsChunk[0]._id).toBe(mockWorkouts[1]._id); 
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    await act(() => result.current.deleteWorkout(mockWorkouts[1]._id));
    state = store.getState();
    expect(state.workout.workouts.total).toBe(1);
    expect(state.workout.workouts.workoutsChunk[0]._id).toBe(mockWorkouts[0]._id);
    act(() => dispatch({type: "DELETE_ALL_WORKOUTS_SUCCESS", payload: "success"}));
    act(() => dispatch({type: "LOGOUT"}))
  });

  it("should set deleteWorkoutError message given that deleteWorkout was run without authorization", async () => {
    server.use(
      rest.delete(
        `${process.env.REACT_APP_API}/api/workouts/*`,
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              error: "Not authorized"
            })
          );
        }
      )
    );
    dispatch({type: "LOGIN_SUCCESS", payload: mockUser})
    for(let i = 0; i < mockWorkouts.length; ++i){
     dispatch({type: "CREATE_WORKOUT_SUCCESS", payload: mockWorkouts[i]}); 
    }  
    let state = store.getState();
    expect(state.workout.workouts.total).toBe(2);
    expect(state.workout.workouts.workoutsChunk[0]._id).toBe(mockWorkouts[1]._id); 
    dispatch({type: "LOGOUT"})
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    await act(() => result.current.deleteWorkout(mockWorkouts[1]._id));
    state = store.getState();
    expect(state.workout.deleteWorkoutError).toBeTruthy();
    expect(state.workout.deleteWorkoutError).toMatch(/not authorized/i);
    act(() => dispatch({type: "LOGIN_SUCCESS", payload: mockUser}))
    act(() => dispatch({type: "DELETE_ALL_WORKOUTS_SUCCESS", payload: "success"}));
    act(() => dispatch({type: "LOGOUT"}))
  });

  it("should set deleteWorkoutError message given that deleteWorkout was run with invalid workout id", async () => {
     server.use(
       rest.delete(`${process.env.REACT_APP_API}/api/workouts/*`, (req, res, ctx) => {
         return res(
           ctx.status(404),
           ctx.json({
             error: "Invalid workout id"
           })
         );
       })
     );
     dispatch({type: "LOGIN_SUCCESS", payload: mockUser})
     for(let i = 0; i < mockWorkouts.length; ++i){
      dispatch({type: "CREATE_WORKOUT_SUCCESS", payload: mockWorkouts[i]}); 
     }  
    let state = store.getState();
    expect(state.workout.workouts.total).toBe(2);
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    await act(() => result.current.deleteWorkout("invalidWorkoutId"));
    state = store.getState();
    expect(state.workout.workouts.total).toBe(2);
    expect(state.workout.deleteWorkoutError).toBeTruthy();
    expect(state.workout.deleteWorkoutError).toMatch(/invalid workout id/i);
    act(() => dispatch({type: "DELETE_ALL_WORKOUTS_SUCCESS", payload: "success"}));
    act(() => dispatch({type: "LOGOUT"}))
  });

})