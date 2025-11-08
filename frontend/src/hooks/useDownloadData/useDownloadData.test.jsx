import { renderHook } from "@testing-library/react";
import useDownloadData from "./useDownloadData";
import store from "../../redux/store";
import { Provider } from "react-redux";

describe("useDownloadData()", () => {
  it("should return downloadData function", async () => {
    let wrapper = ({ children }) => {
      return <Provider store={store}>{children}</Provider>;
    };
    const { result } = renderHook(useDownloadData, { wrapper });
    expect(result.current.downloadData).toBeTruthy();
    expect(typeof result.current.downloadData).toBe("function");
  });
});
