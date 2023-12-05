import { renderHook, act } from "@testing-library/react";
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
    id: "userid",
    email: "keech@mail.yu",
    token: "authorizationToken",
    username: undefined,
    profileImg: undefined,
    tokenExpires: Date.now() + 3600000,
  };
  jest.mock("../../utils/downloadJsonFile", () => ({
    downloadJsonFile: jest.fn(),
  }));
  window.URL.createObjectURL = jest.fn();
});

afterAll(() => {
  wrapper = null;
  dispatch = null;
  mockUser = null;
  jest.restoreAllMocks();
  window.URL.createObjectURL.mockReset();
});

describe("useDownloadData()", () => {
  it("should return downloadData function", async () => {
    const { result } = renderHook(useDownloadData, { wrapper });
    expect(result.current.downloadData).toBeTruthy();
    expect(typeof result.current.downloadData).toBe("function");
  });

  it("should set downloadDataError message given that request wasn't authorized", async () => {
    const { result } = renderHook(useDownloadData, { wrapper });
    await act(() => result.current.downloadData());
    let state = store.getState();
    expect(state.user.downloadDataError).toBeTruthy();
    expect(state.user.downloadDataError).toMatch(/not authorized/i);
  });

  it("should set success message given that the download started", async () => {
    dispatch({ type: "LOGIN_SUCCESS", payload: mockUser });
    const { result } = renderHook(useDownloadData, { wrapper });
    await act(() => result.current.downloadData());
    let state = store.getState();
    expect(state.user.success).toBeTruthy();
    expect(state.user.success).toMatch(/data download started/i);
    act(() => dispatch({ type: "RESET_USER_STATE" }));
  });
});
