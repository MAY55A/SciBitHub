import { describe, expect, it, vi } from "vitest";
import { areEqualArrays, debounce, formatDate } from "@/src/utils/utils";

describe("core utility helpers", () => {
  describe("areEqualArrays", () => {
    it("returns true for arrays with the same items regardless of order", () => {
      expect(areEqualArrays(["b", "a"], ["a", "b"])).toBe(true);
    });

    it("returns false for arrays of different lengths or elements", () => {
      expect(areEqualArrays(["a"], ["a", "b"])).toBe(false);
      expect(areEqualArrays(["a", "c"], ["a", "b"])).toBe(false);
    });
  });

  describe("debounce", () => {
    it("delays invocation until the wait window elapses", () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const debounced = debounce(fn, 200);

      debounced("first");
      debounced("second");
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(200);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith("second");
      vi.useRealTimers();
    });
  });

  describe("formatDate", () => {
    it("formats same-day timestamps as Today and multi-day timestamps relatively", () => {
      const todayIso = new Date().toISOString();
      const threeDaysAgoIso = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

      expect(formatDate(todayIso)).toBe("Today");
      expect(formatDate(threeDaysAgoIso)).toBe("3d ago");
    });
  });
});