import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { useSignup } from "../useSignup";
import { Provider } from "react-redux";
import store from "../../redux/store";

let wrapper;
let url;

beforeAll(() => {
  wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  url = process.env.REACT_APP_API || "http://localhost:6060";
});

afterAll(() => {
  wrapper = null;
  url = null;
});

describe("useSignup()", () => {
  it("should return signup function", () => {
    const { result } = renderHook(useSignup, { wrapper });
    expect(result.current.signup).toBeTruthy();
    expect(typeof result.current.signup).toBe("function");
  });

  it("should set error given that input was invalid", async () => {
    server.use(
      rest.post(
        `${url}/api/users/signup`,
        (req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({
              error: "Invalid input",
            })
          );
        }
      )
    );
    const { result } = renderHook(useSignup, { wrapper });
    await act(async () => result.current.signup());
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/invalid input/i);
  });

  it("should set success message given that signup was successful", async () => {
    const { result } = renderHook(useSignup, { wrapper });
    await act(async () => result.current.signup());
    let state = store.getState();
    expect(state.flashMessages.error).toBeFalsy();
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(/please check your inbox/i);
  });
});
