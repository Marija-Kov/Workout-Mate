import { describe, it, expect, vi } from 'vitest';
import { renderHook } from "@testing-library/react";
import { useDownloadData } from "../useDownloadData";
import store from "../../redux/store";
import { Provider } from "react-redux";

let wrapper;
let dispatch;
let mockUser;

beforeAll(() => {
  wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  dispatch = store.dispatch;
  mockUser = {
    username: undefined,
    profileImg: undefined,
  };
  window.URL.createObjectURL = vi.fn();
});

afterAll(() => {
  wrapper = null;
  dispatch = null;
  mockUser = null;
  vi.resetAllMocks();
  window.URL.createObjectURL.mockReset();
});

describe("useDownloadData()", () => {
  it("should return downloadData function", async () => {
    const { result } = renderHook(useDownloadData, { wrapper });
    expect(result.current.downloadData).toBeTruthy();
    expect(typeof result.current.downloadData).toBe("function");
  });

  it("should set error given that user isn't authorized", async () => {
    dispatch({ type: "LOGOUT" });
    const { result } = renderHook(useDownloadData, { wrapper });
    await result.current.downloadData();
    let state = store.getState();
    expect(state.flashMessages.error).toBeTruthy();
    expect(state.flashMessages.error).toMatch(/not authorized/i);
  });

  it("should set success message given that the download started", async () => {
    dispatch({ type: "LOGIN", payload: mockUser });
    const { result } = renderHook(useDownloadData, { wrapper });
    await result.current.downloadData();
    let state = store.getState();
    expect(state.flashMessages.success).toBeTruthy();
    expect(state.flashMessages.success).toMatch(/data download started/i);
  });
});
