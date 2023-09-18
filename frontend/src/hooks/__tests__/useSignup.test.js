import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { useSignup } from "../useSignup";
import { Provider } from "react-redux";
import store from "../../redux/store";

let wrapper;

beforeAll(() => {
  wrapper = ({ children }) => {
    return (
      <Provider store={store}>
          {children}
      </Provider>
    );
  };
})

afterAll(() => {
  wrapper = null;
})

describe("useSignup()", ()=> {
    it("should return signup function", () => {
        const { result } = renderHook(useSignup, { wrapper });
        expect(result.current.signup).toBeTruthy()
        expect(typeof result.current.signup).toBe("function")
    });

     it("should set signupError message given that input was invalid", async () => {
       server.use(
         rest.post(
           `${process.env.REACT_APP_API}/api/users/signup`,
           (req, res, ctx) => {
             return res(
              ctx.status(400),
              ctx.json({
                error: "Invalid input"
             })); 
           }
         )
       ); 
      const { result } = renderHook(useSignup, { wrapper });
         await act(async () =>
           result.current.signup()
         );
      let state = store.getState();
      expect(state.user.signupError).toBeTruthy();
      expect(state.user.signupError).toMatch(/invalid input/i);
     });

    it("should set success message given that signup was successful", async () => {
      const { result } = renderHook(useSignup, { wrapper });
      await act(async () => result.current.signup());
      let state = store.getState();
      expect(state.user.signupError).toBeFalsy();
      expect(state.user.success).toBeTruthy();
      expect(state.user.success).toMatch(/please check your inbox/i);
    })

})