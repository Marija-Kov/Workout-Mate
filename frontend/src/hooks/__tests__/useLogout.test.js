import { renderHook, act } from "@testing-library/react";
import { AuthContext } from "../../context/AuthContext";
import { WorkoutContext } from "../../context/WorkoutContext";
import { useLogout }  from "../useLogout";

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

describe("useLogout()", () => {
  it("should return logout function and run it", () => {
       const wrapper = ({ children }) => {
         return (
           <AuthContext.Provider value={{ user: mockUser, dispatch: () => {} }}>
             <WorkoutContext.Provider
               value={{ workouts: mockWorkouts, dispatch: () => {} }}
             >
               {children}
             </WorkoutContext.Provider>
           </AuthContext.Provider>
         );
       };
   const { result } = renderHook(useLogout, { wrapper });
   expect(result.current.logout).toBeTruthy();
   act(() => {
    const loggedOut = result.current.logout()
    expect(loggedOut).toMatch(/logged out/i);
   });
  });
});
