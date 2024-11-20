import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RequirePlayer from "./requirePlayer";
import { usePlayer } from "../hooks/usePlayer";

vi.mock("../hooks/usePlayer");

describe("RequirePlayer Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the Outlet when player is defined", () => {
    (usePlayer as Mock).mockReturnValue({ player: { name: "Test Player" } });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<RequirePlayer />}>
            <Route path="/" element={<div>Player Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Player Content")).toBeInTheDocument();
  });

  it("navigates to /signup when player is not defined", () => {
    (usePlayer as Mock).mockReturnValue({ player: null });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<RequirePlayer />} />
          <Route path="/signup" element={<div>Signup Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Signup Page")).toBeInTheDocument();
  });
});
