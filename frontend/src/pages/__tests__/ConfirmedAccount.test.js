import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfirmedAccount from "../ConfirmedAccount";
import { server, rest } from "../../mocks/server";

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

describe("<ConfirmedAccount />", () => {

    it("should render error message given that the confirmation was not successful", async () => {
     server.use(
       rest.get("api/users/*", (req, res, ctx) => {
         return res(
           ctx.status(404),
           ctx.json({
             error: "Expired token or already confirmed",
           })
         );
       })
     );
     render(<ConfirmedAccount />);
     const errorEl = await screen.findByRole("alert");
     const mayHaveAlreadyBeenConfirmed = await screen.findByText(/already been confirmed/i)
     await expect(errorEl).toBeInTheDocument();
     await expect(errorEl).toHaveClass("error");
     await expect(mayHaveAlreadyBeenConfirmed).toBeInTheDocument();
    });

    it("should render success message given that the confirmation was successful", async () => {
      render(<ConfirmedAccount />);
      const success = await screen.findByText(/account has been confirmed/i);
      await expect(success).toBeInTheDocument();
    });
})