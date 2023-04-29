import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import Search from "../Search";

afterEach(() => {
  cleanup();
});

describe("<Search />", () => {
    it("should render search form properly", async () => {
      render(<Search />);
      const searchInput = await screen.findByPlaceholderText(/search workouts/i);
      const searchBtn = await screen.findByText(/search/i);
      expect(searchInput).toBeInTheDocument();
      expect(searchBtn).toBeInTheDocument();
    });

    it("should update input value as user types", async () => {
      user.setup();
      render(<Search />);
      const searchInput = await screen.findByPlaceholderText(/search workouts/i);
      await user.type(searchInput, "pu");
      expect(searchInput).toHaveValue("pu");
    });
})
