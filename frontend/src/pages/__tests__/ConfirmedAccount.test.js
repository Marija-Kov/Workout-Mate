import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { rest } from "msw";
import ConfirmedAccount from "../ConfirmedAccount";
import { server } from "../../mocks/server";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("<ConfirmedAccount />", () => {
    it("should render success message given that confirmation was successful", async () => {
      render(
        <Provider store={store}>
          <ConfirmedAccount />
        </Provider> 
      );
      const success = await screen.findByRole("alert");
      expect(success).toBeInTheDocument();
      expect(success).not.toHaveClass("error");
      expect(success.textContent).toMatch(/account confirmed/i);
    });

    it("should render error message given that confirmation token wasn't found or is expired", async () => {
      server.use(
       rest.get(`${process.env.REACT_APP_API}/api/users/*`, (req, res, ctx) => {
         return res(
           ctx.status(404),
           ctx.json({
             error: "User with provided token not found",
           })
         );
       })
     );
     render(
      <Provider store={store}>
         <ConfirmedAccount />
      </Provider> 
     );
     const errorEl = await screen.findByRole("alert");
     expect(errorEl).toBeInTheDocument();
     expect(errorEl).toHaveClass("error");
     expect(errorEl.textContent).toMatch(/not found/i)
    });

})