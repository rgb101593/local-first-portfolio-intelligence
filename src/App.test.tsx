// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App.js";

afterEach(cleanup);

describe("portfolio dashboard", () => {
  it("starts on the weekly investor view", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "weekly" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getByRole("heading", {
        name: "Operating momentum strengthened while one asset warrants attention",
      }),
    ).toBeVisible();
    expect(
      screen.getByText("Sunday-over-Sunday occupancy movement"),
    ).toBeVisible();
  });

  it("switches metrics and narrative to the daily source packet", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "daily" }));
    expect(screen.getByRole("button", { name: "daily" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getByRole("region", { name: "daily portfolio metrics" }),
    ).toHaveTextContent("Physical occupancy");
    expect(
      screen.getByRole("heading", {
        name: "Closing strength improved while forward leasing remains uneven",
      }),
    ).toBeVisible();
    expect(
      screen.queryByText("Sunday-over-Sunday occupancy movement"),
    ).not.toBeInTheDocument();
  });
});
