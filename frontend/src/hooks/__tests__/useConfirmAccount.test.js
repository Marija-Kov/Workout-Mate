import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { useConfirmAccount } from "../useConfirmAccount";
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

describe("useConfirmAccount()", () => {
  it("should return confirmAccount function", () => {
    const { result } = renderHook(useConfirmAccount, { wrapper });
    expect(result.current.confirmAccount).toBeTruthy();
    expect(typeof result.current.confirmAccount).toBe("function");
  });

  it("should set confirmAccountError message given that token is invalid", async () => {
    server.use(
      rest.get(
        `${url}/api/users/confirmaccount/:accountConfirmationToken`,
        (req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json({
              error: "Invalid account confirmation token",
            })
          );
        }
      )
    );
    const invalidToken = "423324";
    const { result } = renderHook(useConfirmAccount, { wrapper });
    await act(async () => result.current.confirmAccount(invalidToken));
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(
      /invalid account confirmation token/i
    );
  });

  it("should set confirmAccountError message given that token is not found", async () => {
    server.use(
      rest.get(
        `${url}/api/users/confirmaccount/:accountConfirmationToken`,
        (req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json({
              error: "Account confirmation token not found",
            })
          );
        }
      )
    );
    const noToken = null;
    const { result } = renderHook(useConfirmAccount, { wrapper });
    await act(async () => result.current.confirmAccount(noToken));
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(
      /account confirmation token not found/i
    );
  });

  it("should set success message given that account confirmation token is valid", async () => {
    const validToken = "validToken";
    const { result } = renderHook(useConfirmAccount, { wrapper });
    await act(async () => result.current.confirmAccount(validToken));
    let state = store.getState();
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(
      /account confirmed/i
    );
  });
});
