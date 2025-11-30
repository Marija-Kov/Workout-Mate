import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NotFound from "./NotFound";

describe("<NotFound/>", () => {
  it("should render Page not found message", () => {
    render(<NotFound />);
    const pageNotFound = screen.getByText(/page not found/i);
    const redirectingMessage = screen.getByText(/redirecting/i);
    expect(pageNotFound).toBeInTheDocument();
    expect(redirectingMessage).toBeInTheDocument();
  });
});
