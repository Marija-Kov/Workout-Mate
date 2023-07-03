import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { AuthContext } from "../../context/AuthContext";
import { WorkoutContext } from "../../context/WorkoutContext";
import useDeleteWorkout from "../useDeleteWorkout";

describe("useDeleteAllWorkouts()", () => {
  it("should return deleteWorkout function and default error state (false)", () => {
    const wrapper = ({ children }) => {
      return (
        <AuthContext.Provider value={{ user: {} }}>
          <WorkoutContext.Provider value={{ workouts: [] }}>
            {children}
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
    };
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    expect(result.current.deleteWorkout).toBeTruthy();
    expect(result.current.error).toBeFalsy();
  });

  it("should not change default error state (false) when deleteWorkout was run with authorization and valid workout id", async () => {
    const wrapper = ({ children }) => {
      return (
        <AuthContext.Provider value={{ user: {} }}>
          <WorkoutContext.Provider
            value={{ workouts: [], dispatch: () => {} }}
          >
            {children}
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
    };
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    await act(() => result.current.deleteWorkout("mockWorkoutId"));
    expect(result.current.error).toBeFalsy();
  });

  it("should change error state to 'true' when deleteWorkout was run without authorization", async () => {
    const wrapper = ({ children }) => {
      return (
        <AuthContext.Provider value={{ user: null }}>
          <WorkoutContext.Provider
            value={{ workouts: [], dispatch: () => {} }}
          >
            {children}
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
    };
    const { result } = renderHook(useDeleteWorkout, { wrapper });
    await act(() => result.current.deleteWorkout("mockWorkoutId"));
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toMatch(/must be logged in/i);
  });

    it("should change error state to 'true' when deleteWorkout was run with invalid workout id", async () => {
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
        const wrapper = ({ children }) => {
        return (
          <AuthContext.Provider value={{ user: {} }}>
            <WorkoutContext.Provider
              value={{ workouts: [], dispatch: () => {} }}
            >
              {children}
            </WorkoutContext.Provider>
          </AuthContext.Provider>
        );
      };
      const { result } = renderHook(useDeleteWorkout, { wrapper });
      await act(() => result.current.deleteWorkout("invalidWorkoutId"));
      expect(result.current.error).toBeTruthy();
      expect(result.current.error).toMatch(/invalid workout id/i);
    });

})