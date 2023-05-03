import { render, screen, cleanup } from "@testing-library/react";
import About from "../About";

afterEach(() => {
  cleanup();
});

describe("<About />", () => {
  it("should render About page correctly", () => {
    render(<About />);
    const githubLink = screen.getByAltText(/github/i);
    expect(githubLink).toBeInTheDocument();
  });
});
