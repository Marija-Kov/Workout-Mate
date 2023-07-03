import { renderHook, act } from "@testing-library/react";
import { AuthContext } from "../../context/AuthContext";
import { WorkoutContext } from "../../context/WorkoutContext";
import { useLogout }  from "../useLogout";

describe("useLogout()", () => {
  it("should return logout function and run it", () => {
       const wrapper = ({ children }) => {
         return (
           <AuthContext.Provider value={{ user: {}, dispatch: () => {} }}>
             <WorkoutContext.Provider
               value={{ workouts: [], dispatch: () => {} }}
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
