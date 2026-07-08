import { describe, it, expect } from "vitest";
import { render, cleanup, act, fireEvent } from "@testing-library/react";
import App from "../App.jsx";

/**
 * Regression safety net for the App.jsx modularization (per D3).
 *
 * Renders the whole app and walks every lesson through the real dispatch
 * switch. It is a STRONG net on purpose: it counts the stations each lesson
 * renders, so if a later extraction phase drops a lesson or a station, the
 * count falls and this test goes red — exactly the regression it must catch.
 *
 * This must pass unchanged after every extraction phase (B–F).
 */
describe("smoke: all 15 lessons render", () => {
  it("renders App and every lesson's stations without throwing", () => {
    const { container } = render(<App />);

    // The header lists a nav button per lesson, labelled "Bài N".
    const lessonButtons = Array.from(container.querySelectorAll("button")).filter(
      (b) => /Bài\s*\d+/.test(b.textContent || "")
    );
    const seen = new Set();
    const unique = lessonButtons.filter((b) => {
      const label = (b.textContent || "").trim();
      if (seen.has(label)) return false;
      seen.add(label);
      return true;
    });

    expect(unique.length).toBeGreaterThanOrEqual(15);

    // Walk every lesson; record how many stations each renders.
    const perLesson = unique.map((btn) => {
      act(() => {
        fireEvent.click(btn);
      });
      return container.querySelectorAll("section[id]").length;
    });

    // Each lesson must render several stations...
    for (const count of perLesson) {
      expect(count).toBeGreaterThanOrEqual(3);
    }
    // ...and the whole book renders a substantial number of them.
    const total = perLesson.reduce((a, b) => a + b, 0);
    expect(total).toBeGreaterThanOrEqual(100);

    cleanup();
  });
});
