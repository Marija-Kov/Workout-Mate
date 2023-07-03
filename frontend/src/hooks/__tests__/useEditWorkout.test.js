import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { AuthContext } from "../../context/AuthContext";
import { WorkoutContext } from "../../context/WorkoutContext";
import useEditWorkout from "../useEditWorkout";

describe("useEditWorkout()", () => {
  it("should return editWorkout function and error state set to 'false'", () => {
    const wrapper = ({ children }) => {
      return (
        <AuthContext.Provider value={{ user: {} }}>
          <WorkoutContext.Provider value={{ workouts: [] }}>
            {children}
          </WorkoutContext.Provider>
        </AuthContext.Provider>
      );
    };
    const { result } = renderHook(useEditWorkout, { wrapper });
    expect(result.current.error).toBeFalsy();
    expect(result.current.editWorkout).toBeTruthy();
  });

  it("should not change default error state (false) when editWorkout was run with authorization and valid input", async () => {
    const mockUpdateWorkout = { title: "squats", load: 15 };
    const mockOldWorkout = {
      id: "mockId",
      title: "lunges",
      muscle_group: "leg",
      reps: "44",
      load: "21",
      user_id: {}.id
    }
    const closeEdit = () => {};
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
    const { result } = renderHook(useEditWorkout, { wrapper });
    await act(() =>
      result.current.editWorkout(
        mockOldWorkout.id,
        mockUpdateWorkout,
        closeEdit
      )
    );
    expect(result.current.error).toBeFalsy();
  });

  it("should set error state to 'true' given that request wasn't authorized", async () => {
    const mockUpdateWorkout = { title: "squats", load: 15 };
    const mockOldWorkout = {
      id: "mockId",
      title: "lunges",
      muscle_group: "leg",
      reps: "44",
      load: "21",
      user_id: {}.id
    }
    const closeEdit = () => {};
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
    const { result } = renderHook(useEditWorkout, { wrapper });
    await act(() =>
      result.current.editWorkout(
        mockOldWorkout.id,
        mockUpdateWorkout,
        closeEdit
      )
    );
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toMatch(/must be logged in/i);
  });

    it("should set error state to 'true' given that input was invalid", async () => {
      const mockUpdateWorkout = { title: "", load: 15 };
      const mockOldWorkout = {
        id: "mockId",
        title: "lunges",
        muscle_group: "leg",
        reps: "44",
        load: "21",
        user_id: {}.id
      }
      const closeEdit = () => {};
      server.use(
        rest.patch(
          `${process.env.REACT_APP_API}/api/workouts/*`,
          (req, res, ctx) => {
            return res(
              ctx.status(400),
              ctx.json({
                error: "all fields must be filled",
              })
            );
          }
        )
      );
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
      const { result } = renderHook(useEditWorkout, { wrapper });
      await act(() =>
        result.current.editWorkout(
          mockOldWorkout.id,
          mockUpdateWorkout,
          closeEdit
        )
      );
      expect(result.current.error).toBeTruthy();
      expect(result.current.error).toMatch(/must be logged in/i);
    });

});
