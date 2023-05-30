import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { useLogin } from "../useLogin";
import { AuthContextProvider } from "../../context/AuthContext";

describe("useLogin()", () => {
  it("should have user and error state initially set to null", () => {
    const wrapper = AuthContextProvider;
    const { result } = renderHook(useLogin, { wrapper });
    expect(result.current.user).toBeFalsy();
    expect(result.current.error).toBeFalsy();
  });

  it("should set error state to true given that the server responded with an error", async () => {
    server.use(
      rest.post(
        `${process.env.REACT_APP_API}/api/users/login`,
        (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              error: "Invalid input or user not confirmed",
            })
          );
        }
      )
    );
    const wrapper = AuthContextProvider;
    const { result } = renderHook(useLogin, { wrapper });
    await act(async () => result.current.login());
    expect(result.current.error).toBeTruthy();
    expect(result.current.user).toBeFalsy();
  });

  it("should set user state to object including authorization token given that the server responded with a success message", async () => {
    const wrapper = AuthContextProvider;
    const { result } = renderHook(useLogin, { wrapper });
    await act(async () => result.current.login());
    expect(result.current.error).toBeFalsy();
    expect(result.current.user).toBeTruthy();
    expect(result.current.user.token).toBeTruthy();
  });

})
