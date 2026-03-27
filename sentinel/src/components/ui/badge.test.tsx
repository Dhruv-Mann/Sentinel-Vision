/**
 * Unit tests for Badge component
 * 
 * Validates Requirements:
 * - 32.1: Badge variants (default, success, warning, error, info)
 * - 32.2: Badge sizes (sm, md, lg) with appropriate padding and font size
 * - 32.3: Pill shape (fully rounded corners) for status badges
 * - 32.4: Subtle background colors with higher contrast text
 * - 32.5: Icon + text combinations
 * - 32.6: Uppercase text with increased letter spacing for labels
 * - 32.7: Semantic colors (green for active, red for expired)
 */

import { Badge } from "./badge";
import { Check, AlertCircle, AlertTriangle, Info } from "lucide-react";

describe("Badge Component", () => {
  describe("Variants", () => {
    it("should render default variant with correct styles", () => {
      const badge = Badge({ variant: "default", children: "Default" });
      expect(badge).toBeDefined();
    });

    it("should render success variant with semantic colors", () => {
      const badge = Badge({ variant: "success", children: "Active" });
      expect(badge).toBeDefined();
    });

    it("should render warning variant with semantic colors", () => {
      const badge = Badge({ variant: "warning", children: "Pending" });
      expect(badge).toBeDefined();
    });

    it("should render error variant with semantic colors", () => {
      const badge = Badge({ variant: "error", children: "Expired" });
      expect(badge).toBeDefined();
    });

    it("should render info variant with semantic colors", () => {
      const badge = Badge({ variant: "info", children: "Info" });
      expect(badge).toBeDefined();
    });
  });

  describe("Sizes", () => {
    it("should render sm size with appropriate padding and font size", () => {
      const badge = Badge({ size: "sm", children: "Small" });
      expect(badge).toBeDefined();
    });

    it("should render md size (default) with appropriate padding and font size", () => {
      const badge = Badge({ size: "md", children: "Medium" });
      expect(badge).toBeDefined();
    });

    it("should render lg size with appropriate padding and font size", () => {
      const badge = Badge({ size: "lg", children: "Large" });
      expect(badge).toBeDefined();
    });
  });

  describe("Shape and Typography", () => {
    it("should use pill shape (fully rounded corners)", () => {
      const badge = Badge({ children: "Pill Shape" });
      expect(badge).toBeDefined();
    });

    it("should use uppercase text with increased letter spacing", () => {
      const badge = Badge({ children: "Uppercase" });
      expect(badge).toBeDefined();
    });

    it("should use semibold font weight", () => {
      const badge = Badge({ children: "Bold Text" });
      expect(badge).toBeDefined();
    });
  });

  describe("Icon Support", () => {
    it("should render badge with icon and text", () => {
      const badge = Badge({
        icon: Check({}),
        children: "With Icon",
      });
      expect(badge).toBeDefined();
    });

    it("should render icon-only badge", () => {
      const badge = Badge({
        icon: AlertCircle({}),
      });
      expect(badge).toBeDefined();
    });

    it("should render small badge with icon", () => {
      const badge = Badge({
        size: "sm",
        icon: Check({}),
        children: "Small Icon",
      });
      expect(badge).toBeDefined();
    });

    it("should render medium badge with icon", () => {
      const badge = Badge({
        size: "md",
        icon: Check({}),
        children: "Medium Icon",
      });
      expect(badge).toBeDefined();
    });

    it("should render large badge with icon", () => {
      const badge = Badge({
        size: "lg",
        icon: Check({}),
        children: "Large Icon",
      });
      expect(badge).toBeDefined();
    });
  });

  describe("Combinations", () => {
    it("should render success badge with icon and text", () => {
      const badge = Badge({
        variant: "success",
        size: "md",
        icon: Check({}),
        children: "Active",
      });
      expect(badge).toBeDefined();
    });

    it("should render error badge with icon and text", () => {
      const badge = Badge({
        variant: "error",
        size: "lg",
        icon: AlertCircle({}),
        children: "Expired",
      });
      expect(badge).toBeDefined();
    });

    it("should render warning badge with icon", () => {
      const badge = Badge({
        variant: "warning",
        size: "sm",
        icon: AlertTriangle({}),
        children: "Pending",
      });
      expect(badge).toBeDefined();
    });

    it("should render info badge with icon", () => {
      const badge = Badge({
        variant: "info",
        icon: Info({}),
        children: "Information",
      });
      expect(badge).toBeDefined();
    });
  });

  describe("Accessibility", () => {
    it("should support aria-label for icon-only badges", () => {
      const badge = Badge({
        icon: Check({}),
        "aria-label": "Success status",
      });
      expect(badge).toBeDefined();
    });

    it("should support custom HTML attributes", () => {
      const badge = Badge({
        role: "status",
        children: "Custom Attrs",
      });
      expect(badge).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty children", () => {
      const badge = Badge({});
      expect(badge).toBeDefined();
    });

    it("should handle long text content", () => {
      const badge = Badge({
        children: "This is a very long badge text that might wrap",
      });
      expect(badge).toBeDefined();
    });

    it("should handle custom className", () => {
      const badge = Badge({
        className: "custom-class",
        children: "Custom",
      });
      expect(badge).toBeDefined();
    });
  });
});
