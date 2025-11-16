import { renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../test/mocks/server";
import useSendPasswordResetLink from "./useSendPasswordResetLink";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("useSendPasswordResetLink()", () => {
  const wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  const url = import.meta.env.VITE_API || "http://localhost:6060";

  it("should return sendPasswordResetLink function", () => {
    const { result } = renderHook(useSendPasswordResetLink, { wrapper });
    expect(result.current.sendPasswordResetLink).toBeTruthy();
    expect(typeof result.current.sendPasswordResetLink).toBe("function");
  });

  it("should set error if the input is invalid", async () => {
    server.use(
      http.post(`${url}/api/reset-password`, () => {
        return new HttpResponse.json(
          {
            error: "Please enter valid email address",
          },
          { status: 400 }
        );
      })
    );
    const { result } = renderHook(useSendPasswordResetLink, { wrapper });
    await result.current.sendPasswordResetLink("gibberish");
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(
      /please enter valid email address/i
    );
  });

  it("should set success message if the input is valid", async () => {
    const { result } = renderHook(useSendPasswordResetLink, { wrapper });
    await result.current.sendPasswordResetLink("valid@e.mail");
    let state = store.getState();
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(/reset link sent to inbox/i);
  });
});
