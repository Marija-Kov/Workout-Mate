import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import useSendPasswordResetLink from "../useSendPasswordResetLink";
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

describe("useSendPasswordResetLink()", () => {
  it("should return sendPasswordResetLink function", () => {
    const { result } = renderHook(useSendPasswordResetLink, { wrapper });
    expect(result.current.sendPasswordResetLink).toBeTruthy();
    expect(typeof result.current.sendPasswordResetLink).toBe("function");
  });

  it("should set error given that the input is invalid", async () => {
    server.use(
      rest.post(
        `${url}/api/reset-password`,
        (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              error: "Please enter valid email address",
            })
          );
        }
      )
    );
    const { result } = renderHook(useSendPasswordResetLink, { wrapper });
    await act(() => result.current.sendPasswordResetLink("gibberish"));
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(
      /please enter valid email address/i
    );
  });

  it("should set success message given that the input is valid", async () => {
    const { result } = renderHook(useSendPasswordResetLink, { wrapper });
    await act(() => result.current.sendPasswordResetLink("valid@e.mail"));
    let state = store.getState();
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(/reset link sent to inbox/i);
  });
});
