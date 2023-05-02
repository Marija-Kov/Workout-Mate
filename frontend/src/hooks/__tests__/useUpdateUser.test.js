import { renderHook, act } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../mocks/server";
import { AuthContext } from "../../context/AuthContext";
import { useUpdateUser } from "../useUpdateUser";

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

describe("useUpdateUser()", () => {
  it("should return updateUser function and default values of states: error, isLoading and success (null)", () => {
    const wrapper = ({ children }) => {
      return (
        <AuthContext.Provider value={{ user: mockUser }}>
          {children}
        </AuthContext.Provider>
      );
    };
    const { result } = renderHook(useUpdateUser, { wrapper });
    expect(result.current.updateUser).toBeTruthy();
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeFalsy();
    expect(result.current.success).toBeFalsy();
  });

  it("should set error state to truthy and success to falsy if updateUser was run without authorization", async () => {
    const newData = {
      username: "keechrr",
      profileImg: "profileImgString",
    };
    const wrapper = ({ children }) => {
      return (
        <AuthContext.Provider value={{ user: null }}>
          {children}
        </AuthContext.Provider>
      );
    };
    const { result } = renderHook(useUpdateUser, { wrapper });
    await act(() =>
      result.current.updateUser(newData.username, newData.profileImg)
    );
    expect(result.current.error).toBeTruthy();
    expect(result.current.success).toBeFalsy();
    expect(result.current.error).toMatch(/not authorized/i);
  });

  it("should set error state to truthy and success to falsy if updateUser was run with invalid input", async () => {
    server.use(
      rest.patch("/api/users/*", (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
    const wrapper = ({ children }) => {
      return (
        <AuthContext.Provider value={{ user: mockUser, dispatch: () => {} }}>
          {children}
        </AuthContext.Provider>
      );
    };
    const { result } = renderHook(useUpdateUser, { wrapper });
    await act(() => result.current.updateUser("thisUsernameIsTooLong444555"));
    expect(result.current.error).toBeTruthy();
    expect(result.current.success).toBeFalsy();
    expect(result.current.error).toMatch(/invalid input/i);
  });

  it("should run updateUser, set success state to 'true', error state to 'false' given that user is authorized and input is valid", async () => {
    const newData = {
      username: "keechrr",
      profileImg: "profileImgString",
    };
    const wrapper = ({ children }) => {
      return (
        <AuthContext.Provider value={{ user: mockUser, dispatch: () => {} }}>
          {children}
        </AuthContext.Provider>
      );
    };
    const { result } = renderHook(useUpdateUser, { wrapper });
    await act(() =>
      result.current.updateUser(newData.username, newData.profileImg)
    );
    expect(result.current.error).toBeFalsy();
    expect(result.current.success).toBeTruthy();
    expect(result.current.success).toMatch(/updated successfully/i);
  });
});
