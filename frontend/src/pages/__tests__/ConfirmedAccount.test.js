import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { jest } from "@jest/globals"
import ConfirmedAccount from "../ConfirmedAccount";
import { Provider } from "react-redux";
import store from "../../redux/store";

let dispatch = store.dispatch;

jest.mock("../../hooks/useGetAccountConfirmationToken", () => ({
    useGetAccountConfirmationToken: () => {
        return {
            getAccountConfirmationToken: () => {}
        };
   }
}))

jest.mock("../../hooks/useConfirmAccount", () => ({
    useConfirmAccount: () => {
        return {
            confirmAccount: () => {}
        };
   }
}))

afterAll(() => {
    dispatch = null
    jest.restoreAllMocks()
})

describe("<ConfirmedAccount />", () => {
    it("should render success message given that confirmation was successful", async () => {
        render(
        <Provider store={store}>
          <ConfirmedAccount />
        </Provider> 
      );
      await act(() => dispatch({type: "CONFIRM_ACCOUNT_SUCCESS", payload: "Account confirmed"}))
      const success = await screen.findByRole("alert");
      expect(success).toBeInTheDocument();
      expect(success).not.toHaveClass("error");
      expect(success.textContent).toMatch(/account confirmed/i);
    });

    it("should render error message given that confirmation token wasn't found or is expired", async () => {
     render(
      <Provider store={store}>
         <ConfirmedAccount />
      </Provider> 
     );
     await act(() => dispatch({type: "CONFIRM_ACCOUNT_FAIL", payload: "Not found"}))
     const errorEl = await screen.findByRole("alert");
     expect(errorEl).toBeInTheDocument();
     expect(errorEl).toHaveClass("error");
     expect(errorEl.textContent).toMatch(/not found/i)
    });

})