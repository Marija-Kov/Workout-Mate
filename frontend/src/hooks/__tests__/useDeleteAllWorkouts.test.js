import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { AuthContext } from "../../context/AuthContext";
import { WorkoutContext } from "../../context/WorkoutContext";
import { useDeleteAllWorkouts } from "../useDeleteAllWorkouts"

describe("useDeleteAllWorkouts()", () => {
  it("should return deleteAllWorkouts function and error with delault state (false)", () => {
      const wrapper = ({ children }) => {
        return (
          <AuthContext.Provider value={{ user: {} }}>
            <WorkoutContext.Provider value={{ workouts: [] }}>
              {children}
            </WorkoutContext.Provider>
          </AuthContext.Provider>
        );
      };
    const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
    expect(result.current.deleteAllWorkouts).toBeTruthy();
    expect(result.current.error).toBeFalsy();
  });

  it("should not change default error state (false) when deleteAllWorkouts was run with authorization", async () => {
    const wrapper = ({ children }) => {
        return (
          <AuthContext.Provider value={{ user: {} }}>
            <WorkoutContext.Provider value={{ workouts: [], dispatch: () => {} }}>
              {children}
            </WorkoutContext.Provider>
          </AuthContext.Provider>
        );
      };
    const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
    await act(() => result.current.deleteAllWorkouts());
    expect(result.current.error).toBeFalsy();
  });

    it("should change error state to 'true' when deleteAllWorkouts was run without authorization", async () => {
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
      const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
      await act(() => result.current.deleteAllWorkouts());
      expect(result.current.error).toBeTruthy();
      expect(result.current.error).toMatch(/must be logged in/i);
    });

    it("should change error state to 'true' when deleteAllWorkouts was not successful", async () => {
      server.use(
        rest.delete(`${process.env.REACT_APP_API}/api/workouts/`, (req, res, ctx) => {
          return res(
            ctx.status(404)
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
      const { result } = renderHook(useDeleteAllWorkouts, { wrapper });
      await act(() => result.current.deleteAllWorkouts());
      expect(result.current.error).toBeTruthy();
      expect(result.current.error).toMatch(/something went wrong/i);
    });

});
