import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

function Hello() {
  return <h1>blog harness</h1>;
}

describe("test harness", () => {
  it("renders a component with jsdom + jest-dom matchers", () => {
    render(<Hello />);
    expect(
      screen.getByRole("heading", { name: "blog harness" }),
    ).toBeInTheDocument();
  });
});
