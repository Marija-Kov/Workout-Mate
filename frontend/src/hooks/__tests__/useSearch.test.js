import { renderHook } from "@testing-library/react";
import { rest } from "msw";
import { act } from "react-dom/test-utils";
import { AuthContext } from "../../context/AuthContext";
import { WorkoutContext } from "../../context/WorkoutContext";
import { server } from "../../mocks/server";
import { useSearch } from "../useSearch";

let mockUser;
let mockWorkouts;

beforeAll(() => {
  
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
});

afterAll(() => {
  mockUser = null;
  mockWorkouts = null;
});

describe("useSearch()", () => {
  it("should return search function and all states set to default values (falsy)", () => {
    const wrapper = ({ children }) => {
      return (
        <AuthContext.Provider value={{ user: mockUser }}>
          <WorkoutContext.Provider value={{ workouts: mockWorkouts }}>
            {children}
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
    };
    const { result } = renderHook(useSearch, { wrapper });
    expect(result.current.search).toBeTruthy();
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.limit).toBeFalsy();
    expect(result.current.total).toBeFalsy();
    expect(result.current.error).toBeFalsy();
  });

  it("should set error to truthy if search was run without authorization", async () => {
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
    const { result } = renderHook(useSearch, { wrapper });
    await act(() => result.current.search("pu", 0));
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toMatch(/not authorized/i);
  });

  it("should set error to truthy if search was not successful", async () => {
    server.use(
      rest.get("/api/workouts/*", (req, res, ctx) => {
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
        <AuthContext.Provider value={{ user: mockUser }}>
          <WorkoutContext.Provider
            value={{ workouts: mockWorkouts, dispatch: () => {} }}
          >
            {children}
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
    };
    const { result } = renderHook(useSearch, { wrapper });
    await act(() => result.current.search("pu", 0));
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toMatch(/something went wrong/i);
  });

  it("should run search function and update total and limit states to truthy", async () => {
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
    const { result } = renderHook(useSearch, { wrapper });
    await act(() => result.current.search("pu", 0));
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeFalsy();
    expect(result.current.limit).toBeTruthy();
    expect(result.current.total).toBeTruthy();
  });
});
