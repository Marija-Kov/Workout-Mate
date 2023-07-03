import { renderHook } from "@testing-library/react";
import { rest } from "msw";
import { act } from "react-dom/test-utils";
import { AuthContext } from "../../context/AuthContext";
import { WorkoutContext } from "../../context/WorkoutContext";
import { server } from "../../mocks/server";
import { useSearch } from "../useSearch";

describe("useSearch()", () => {
  it("should return search function and all states set to default values (falsy)", () => {
    const wrapper = ({ children }) => {
      return (
        <AuthContext.Provider value={{ user: {} }}>
          <WorkoutContext.Provider value={{ workouts: [] }}>
            {children}
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
    };
    const { result } = renderHook(useSearch, { wrapper });
    expect(result.current.search).toBeTruthy();
    expect(result.current.isLoading).toBe(null);
    expect(result.current.limit).toBe(null);
    expect(result.current.allWorkoutsMuscleGroups.length).toBe(0);
    expect(result.current.total).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it("should set error to truthy if search was run without authorization", async () => {
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
    const { result } = renderHook(useSearch, { wrapper });
    await act(() => result.current.search("pu", 0));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toMatch(/not authorized/i);
  });

  it("should set error to truthy if search was not successful", async () => {
    server.use(
      rest.get(`${process.env.REACT_APP_API}/api/workouts/*`, (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            error: "Something went wrong",
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
    const { result } = renderHook(useSearch, { wrapper });
    await act(() => result.current.search("pu", 0));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.allWorkoutsMuscleGroups.length).toBe(0);
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toMatch(/something went wrong/i);
  });

  it("should run search function and update total and limit states to truthy", async () => {
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
    const { result } = renderHook(useSearch, { wrapper });
    await act(() => result.current.search("pu", 0));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.allWorkoutsMuscleGroups.length).not.toBe(0);
    expect(result.current.limit).toBeTruthy();
    expect(result.current.total).toBeTruthy();
  });
});
