import { renderHook, act, cleanup } from "@testing-library/react";
import { server, rest } from "../../mocks/server";
import { useLogin } from "../useLogin";
import { AuthContextProvider } from "../../context/AuthContext";

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

describe("useLogin()", () => {
  it("should have user and error state initially set to null", () => {
    const wrapper = AuthContextProvider;
    const { result } = renderHook(useLogin, { wrapper });
    expect(result.current.user).toBeFalsy();
    expect(result.current.error).toBeFalsy();
  });

  it("should set error state to true given that the server responded with an error", async () => {
    server.use(
      rest.post("api/users/login", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            error: "Invalid input or user not confirmed",
          })
        );
      })
    );
    const wrapper = AuthContextProvider;
    const { result } = renderHook(useLogin, { wrapper });
    await act(async () => result.current.login());
    await expect(result.current.error).toBeTruthy();
    await expect(result.current.user).toBeFalsy();
  });

  it("should set user state to object including authorization token given that the server responded with a success message", async () => {
    const wrapper = AuthContextProvider;
    const { result } = renderHook(useLogin, { wrapper });
    await act(async () => result.current.login());
    await expect(result.current.error).toBeFalsy();
    await expect(result.current.user).toBeTruthy();
    await expect(result.current.user.token).toBeTruthy();
  });

})
