import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { AuthContext } from "../../context/AuthContext";
import { useDeleteUser } from "../useDeleteUser";

let mockUser;

beforeAll(() => {
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
});

describe("useDeleteUser()", () => {
  it("should return deleteUser function and error set to default state (false)", () => {
    const wrapper = ({ children }) => {
      return (
        <AuthContext.Provider value={{ user: mockUser }}>
          {children}
        </AuthContext.Provider>
      );
    };
    const { result } = renderHook(useDeleteUser, { wrapper });
    expect(result.current.deleteUser).toBeTruthy();
    expect(result.current.error).toBeFalsy();
  });

  it("should set error state to 'true' if deleteUser function was run without authorization", async () => {
    const wrapper = ({ children }) => {
      return (
        <AuthContext.Provider value={{ user: null }}>
          {children}
        </AuthContext.Provider>
      );
    };
    const { result } = renderHook(useDeleteUser, { wrapper });
    await act(() => result.current.deleteUser(mockUser.id));
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toMatch(/not authorized/i);
  });

    it("should set error state to 'true' if user id wasn't found", async () => {
      server.use(
        rest.delete("/api/users/*", (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              success: "User id not found.",
            })
          );
        })
      );
      const wrapper = ({ children }) => {
        return (
          <AuthContext.Provider value={{ user: mockUser }}>
            {children}
          </AuthContext.Provider>
        );
      };
      const { result } = renderHook(useDeleteUser, { wrapper });
      await act(() => result.current.deleteUser("invalidUserId"));
      expect(result.current.error).toBeTruthy();
      expect(result.current.error).toMatch(/user id not found/i);
    });

    it("should run deleteUser function successfully given that the user is authorized", async () => {
      const wrapper = ({ children }) => {
        return (
          <AuthContext.Provider value={{ user: mockUser }}>
            {children}
          </AuthContext.Provider>
        );
      };
      const { result } = renderHook(useDeleteUser, { wrapper });
      await act(() => result.current.deleteUser(mockUser.id));
      expect(result.current.error).toBeFalsy();
    });
});
