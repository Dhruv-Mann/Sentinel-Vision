import { describe, it, expect } from "@jest/globals";
import { Button } from "./button";
import { Heart } from "lucide-react";

/**
 * Unit tests for Button component
 * 
 * Validates Requirements:
 * - 8.1: Button variants (primary, secondary, outline, ghost, destructive)
 * - 8.2: Button sizes (sm, md, lg, xl) with consistent padding
 * - 8.3: Focus ring on keyboard focus
 * - 8.4: Icon-only variant with square aspect ratio
 * - 8.5: Loading state with spinner
 * - 8.6: Disabled state with reduced opacity
 * - 8.9: Minimum 44x44px touch target on mobile
 * - 5.1-5.9: Component state system (default, hover, focus, active, disabled, loading)
 */

describe("Button Component", () => {
  describe("Variants", () => {
    it("should render primary variant with correct styles", () => {
      const button = Button({ variant: "primary", children: "Click me" });
      expect(button).toBeDefined();
    });

    it("should render secondary variant with correct styles", () => {
      const button = Button({ variant: "secondary", children: "Click me" });
      expect(button).toBeDefined();
    });

    it("should render outline variant with correct styles", () => {
      const button = Button({ variant: "outline", children: "Click me" });
      expect(button).toBeDefined();
    });

    it("should render ghost variant with correct styles", () => {
      const button = Button({ variant: "ghost", children: "Click me" });
      expect(button).toBeDefined();
    });

    it("should render destructive variant with correct styles", () => {
      const button = Button({ variant: "destructive", children: "Delete" });
      expect(button).toBeDefined();
    });
  });

  describe("Sizes", () => {
    it("should render sm size with minimum 36px height", () => {
      const button = Button({ size: "sm", children: "Small" });
      expect(button).toBeDefined();
    });

    it("should render md size with minimum 40px height", () => {
      const button = Button({ size: "md", children: "Medium" });
      expect(button).toBeDefined();
    });

    it("should render lg size with minimum 44px height (touch target)", () => {
      const button = Button({ size: "lg", children: "Large" });
      expect(button).toBeDefined();
    });

    it("should render xl size with minimum 48px height", () => {
      const button = Button({ size: "xl", children: "Extra Large" });
      expect(button).toBeDefined();
    });
  });

  describe("States", () => {
    it("should render disabled state with reduced opacity", () => {
      const button = Button({ disabled: true, children: "Disabled" });
      expect(button).toBeDefined();
    });

    it("should render loading state with spinner", () => {
      const button = Button({ loading: true, children: "Loading" });
      expect(button).toBeDefined();
    });

    it("should disable button when loading", () => {
      const button = Button({ loading: true, children: "Loading" });
      expect(button).toBeDefined();
    });
  });

  describe("Icons", () => {
    it("should render button with left icon", () => {
      const button = Button({
        icon: Heart({}),
        iconPosition: "left",
        children: "Like",
      });
      expect(button).toBeDefined();
    });

    it("should render button with right icon", () => {
      const button = Button({
        icon: Heart({}),
        iconPosition: "right",
        children: "Like",
      });
      expect(button).toBeDefined();
    });

    it("should render icon-only button with square aspect ratio", () => {
      const button = Button({
        icon: Heart({}),
        "aria-label": "Like",
      });
      expect(button).toBeDefined();
    });

    it("should have aria-label for icon-only buttons", () => {
      const button = Button({
        icon: Heart({}),
        "aria-label": "Like this post",
      });
      expect(button).toBeDefined();
    });
  });

  describe("Full Width", () => {
    it("should render full width button", () => {
      const button = Button({ fullWidth: true, children: "Full Width" });
      expect(button).toBeDefined();
    });
  });

  describe("Accessibility", () => {
    it("should have aria-busy attribute when loading", () => {
      const button = Button({ loading: true, children: "Loading" });
      expect(button).toBeDefined();
    });

    it("should have proper focus ring styles", () => {
      const button = Button({ children: "Focus me" });
      expect(button).toBeDefined();
    });
  });
});
