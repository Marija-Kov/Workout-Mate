import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import useSendPasswordResetLink from "../useSendPasswordResetLink";
import { Provider } from "react-redux";
import store from "../../redux/store";

let wrapper;

beforeAll(() => {
  wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
});

afterAll(() => {
  wrapper = null;
});

describe("useSendPasswordResetLink()", () => {
  it("should return sendPasswordResetLink function", () => {
    const { result } = renderHook(useSendPasswordResetLink, { wrapper });
    expect(result.current.sendPasswordResetLink).toBeTruthy();
    expect(typeof result.current.sendPasswordResetLink).toBe("function");
  });

  it("should set sendPasswordResetLinkError message given that the input is invalid (not an email or email that doesn't exist in the database)", async () => {
    server.use(
      rest.post(
        `${process.env.REACT_APP_API}/api/reset-password`,
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
    expect(state.user.sendPasswordResetLinkError).toBeTruthy();
    expect(state.user.sendPasswordResetLinkError).toMatch(
      /please enter valid email address/i
    );
  });

  it("should set success message given that the input is valid and password reset email has been sent", async () => {
    const { result } = renderHook(useSendPasswordResetLink, { wrapper });
    await act(() => result.current.sendPasswordResetLink("valid@e.mail"));
    let state = store.getState();
    expect(state.user.success).toBeTruthy();
    expect(state.user.success).toMatch(/reset link sent to inbox/i);
  });
});
