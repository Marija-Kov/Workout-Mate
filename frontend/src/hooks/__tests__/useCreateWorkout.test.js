import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { useCreateWorkout } from "../useCreateWorkout";
import { AuthContext } from "../../context/AuthContext";
import { WorkoutContext } from "../../context/WorkoutContext";

let mockWorkout;
let mockUser;
let mockWorkouts;

beforeAll(() => {
 mockWorkout = { title: "squats", muscle_group: "leg", reps: 20, load: 15};
   mockWorkouts = {
     allUserWorkoutsByQuery: [],
     workoutsChunk: [],
     limit: 3,
     noWorkoutsByQuery: false,
   };
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
 mockWorkout = null;
 mockUser = null;
 mockWorkouts = null;
})

describe("useCreateWorkout()", () => {
  it("should return createWorkout function and error state set to 'false'", async () => {
    const wrapper = ({ children }) => {
      return (
        <AuthContext.Provider value={{ user: mockUser }}>
          <WorkoutContext.Provider
            value={{ workouts: mockWorkouts }}
          >
            {children}
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
    };
    const { result } = renderHook(useCreateWorkout, { wrapper });
    expect(result.current.error).toBeFalsy();
    expect(result.current.createWorkout).toBeTruthy();
  });

  it("should not change default error state (false) when createWorkout was run with authorization and valid input", async () => {
    const wrapper = ({ children }) => {
      return (
        <AuthContext.Provider value={{ user: mockUser }}>
          <WorkoutContext.Provider
            value={{ workouts: mockWorkouts, dispatch: () => {} }}
          >
            {children}
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
    };
    const { result } = renderHook(useCreateWorkout, { wrapper });
    await act(() => result.current.createWorkout(mockWorkout));
    expect(result.current.error).toBeFalsy();
  });

  it("should set error state to 'true' given that request wasn't authorized", async () => {
    const mockWorkout = { title: "squats", muscle_group: "leg", reps: 20, load: 15 };
    const wrapper = ({ children }) => {
      return (
        <AuthContext.Provider value={{ user: null }}>
          <WorkoutContext.Provider
            value={{ workouts: mockWorkouts, dispatch: () => {} }}
          >
            {children}
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
    };
    const { result } = renderHook(useCreateWorkout, { wrapper });
    await act(() => result.current.createWorkout(mockWorkout));
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toMatch(/must be logged in/i);
  });

  it("should return error state set to 'true' given that input was invalid", async () => {
    server.use(
      rest.post(`${process.env.REACT_APP_API}/api/workouts`, (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            error: "all fields must be filled",
          })
        );
      })
    );
    const mockWorkout = { title: "squats", muscle_group: "leg", reps: 20 };
    const wrapper = ({ children }) => {
      return (
        <AuthContext.Provider value={{ user: mockUser }}>
          <WorkoutContext.Provider value={{ workouts: mockWorkouts, dispatch: () => {} }}>
            {children}
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
    };
    const { result } = renderHook(useCreateWorkout, { wrapper });
    await act(() => result.current.createWorkout(mockWorkout));
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toMatch(/empty fields/i);
  });
});
