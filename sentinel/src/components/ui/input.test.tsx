import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Input } from "./input";
import { Mail, Search } from "lucide-react";

describe("Input Component", () => {
  describe("Basic Rendering", () => {
    it("renders input field", () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText("Enter text");
      expect(input).toBeInTheDocument();
    });

    it("renders with label", () => {
      render(<Input label="Email" placeholder="Enter email" />);
      const label = screen.getByText("Email");
      const input = screen.getByPlaceholderText("Enter email");
      
      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(label).toHaveAttribute("for", input.id);
    });

    it("renders with custom id", () => {
      render(<Input id="custom-input" label="Name" />);
      const input = screen.getByLabelText("Name");
      expect(input).toHaveAttribute("id", "custom-input");
    });

    it("renders with placeholder at reduced opacity", () => {
      render(<Input placeholder="Search..." />);
      const input = screen.getByPlaceholderText("Search...");
      expect(input).toHaveClass("placeholder:opacity-50");
    });
  });

  describe("Label Spacing", () => {
    it("displays label above input with 8px spacing", () => {
      render(<Input label="Username" />);
      const label = screen.getByText("Username");
      expect(label).toHaveClass("mb-2"); // 8px spacing
    });
  });

  describe("States", () => {
    it("renders default state with neutral border", () => {
      render(<Input placeholder="Default" />);
      const input = screen.getByPlaceholderText("Default");
      expect(input).toHaveClass("border-[var(--color-border-main)]");
    });

    it("renders focus state with focus ring", () => {
      render(<Input placeholder="Focus test" />);
      const input = screen.getByPlaceholderText("Focus test");
      expect(input).toHaveClass("focus-visible:ring-2");
      expect(input).toHaveClass("focus-visible:ring-[var(--color-border-focus)]");
    });

    it("renders error state with red border", () => {
      render(<Input error="Invalid input" placeholder="Error test" />);
      const input = screen.getByPlaceholderText("Error test");
      expect(input).toHaveClass("border-[var(--color-error)]");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("renders success state with green border", () => {
      render(<Input success placeholder="Success test" />);
      const input = screen.getByPlaceholderText("Success test");
      expect(input).toHaveClass("border-[var(--color-success)]");
    });

    it("renders disabled state with reduced opacity", () => {
      render(<Input disabled placeholder="Disabled" />);
      const input = screen.getByPlaceholderText("Disabled");
      expect(input).toHaveClass("opacity-50");
      expect(input).toHaveClass("cursor-not-allowed");
      expect(input).toBeDisabled();
    });
  });

  describe("Focus Ring", () => {
    it("has 2-3px focus ring on keyboard focus", () => {
      render(<Input placeholder="Focus ring test" />);
      const input = screen.getByPlaceholderText("Focus ring test");
      expect(input).toHaveClass("focus-visible:ring-2");
      expect(input).toHaveClass("focus-visible:ring-offset-2");
    });
  });

  describe("Error Messages", () => {
    it("displays error message inline below input with red accent", () => {
      render(<Input error="This field is required" placeholder="Test" />);
      const errorMessage = screen.getByRole("alert");
      
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent("This field is required");
      expect(errorMessage).toHaveClass("text-[var(--color-error)]");
      expect(errorMessage).toHaveClass("mt-1.5");
    });

    it("associates error message with input via aria-describedby", () => {
      render(<Input error="Invalid email" placeholder="Email" />);
      const input = screen.getByPlaceholderText("Email");
      const errorMessage = screen.getByRole("alert");
      
      expect(input).toHaveAttribute("aria-describedby", errorMessage.id);
    });
  });

  describe("Success State", () => {
    it("displays success state with green border and checkmark", () => {
      render(<Input success placeholder="Success" />);
      const input = screen.getByPlaceholderText("Success");
      
      expect(input).toHaveClass("border-[var(--color-success)]");
      
      // Check for checkmark icon (lucide-react Check component)
      const container = input.parentElement;
      const checkmark = container?.querySelector('[aria-hidden="true"]');
      expect(checkmark).toBeInTheDocument();
    });
  });

  describe("Icon Support", () => {
    it("supports icon prefix within input field", () => {
      render(
        <Input
          icon={<Mail className="h-4 w-4" />}
          iconPosition="left"
          placeholder="Email"
        />
      );
      const input = screen.getByPlaceholderText("Email");
      expect(input).toHaveClass("pl-10");
    });

    it("supports icon suffix within input field", () => {
      render(
        <Input
          icon={<Search className="h-4 w-4" />}
          iconPosition="right"
          placeholder="Search"
        />
      );
      const input = screen.getByPlaceholderText("Search");
      expect(input).toHaveClass("pr-10");
    });

    it("positions left icon correctly", () => {
      const { container } = render(
        <Input
          icon={<Mail className="h-4 w-4" />}
          iconPosition="left"
          placeholder="Email"
        />
      );
      const iconContainer = container.querySelector(".left-3");
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveClass("absolute");
      expect(iconContainer).toHaveClass("top-1/2");
      expect(iconContainer).toHaveClass("-translate-y-1/2");
    });

    it("positions right icon correctly", () => {
      const { container } = render(
        <Input
          icon={<Search className="h-4 w-4" />}
          iconPosition="right"
          placeholder="Search"
        />
      );
      const iconContainer = container.querySelector(".right-3");
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveClass("absolute");
      expect(iconContainer).toHaveClass("top-1/2");
      expect(iconContainer).toHaveClass("-translate-y-1/2");
    });
  });

  describe("Minimum Height", () => {
    it("ensures minimum 40px height for comfortable interaction", () => {
      render(<Input placeholder="Height test" />);
      const input = screen.getByPlaceholderText("Height test");
      expect(input).toHaveClass("min-h-[40px]");
      expect(input).toHaveClass("h-10");
    });
  });

  describe("Helper Text", () => {
    it("displays helper text below input", () => {
      render(
        <Input
          helperText="Enter your email address"
          placeholder="Email"
        />
      );
      const helperText = screen.getByText("Enter your email address");
      expect(helperText).toBeInTheDocument();
      expect(helperText).toHaveClass("text-[var(--color-text-secondary)]");
      expect(helperText).toHaveClass("mt-1.5");
    });

    it("associates helper text with input via aria-describedby", () => {
      render(
        <Input
          helperText="Must be a valid email"
          placeholder="Email"
        />
      );
      const input = screen.getByPlaceholderText("Email");
      const helperText = screen.getByText("Must be a valid email");
      
      expect(input).toHaveAttribute("aria-describedby", helperText.id);
    });

    it("does not display helper text when error is present", () => {
      render(
        <Input
          error="Invalid email"
          helperText="Enter your email"
          placeholder="Email"
        />
      );
      
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
      expect(screen.queryByText("Enter your email")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper label association", () => {
      render(<Input label="Email Address" />);
      const input = screen.getByLabelText("Email Address");
      expect(input).toBeInTheDocument();
    });

    it("marks input as invalid when error is present", () => {
      render(<Input error="Required field" placeholder="Test" />);
      const input = screen.getByPlaceholderText("Test");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("announces error messages to screen readers", () => {
      render(<Input error="This field is required" placeholder="Test" />);
      const errorMessage = screen.getByRole("alert");
      expect(errorMessage).toBeInTheDocument();
    });

    it("hides decorative icons from screen readers", () => {
      const { container } = render(
        <Input
          icon={<Mail className="h-4 w-4" />}
          iconPosition="left"
          placeholder="Email"
        />
      );
      const iconContainer = container.querySelector('[aria-hidden="true"]');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe("Transitions", () => {
    it("has smooth transitions for border color", () => {
      render(<Input placeholder="Transition test" />);
      const input = screen.getByPlaceholderText("Transition test");
      expect(input).toHaveClass("transition-all");
      expect(input).toHaveClass("duration-[150ms]");
      expect(input).toHaveClass("ease-out");
    });
  });

  describe("Custom Props", () => {
    it("forwards standard input props", () => {
      render(
        <Input
          type="email"
          name="email"
          required
          placeholder="Email"
        />
      );
      const input = screen.getByPlaceholderText("Email");
      
      expect(input).toHaveAttribute("type", "email");
      expect(input).toHaveAttribute("name", "email");
      expect(input).toHaveAttribute("required");
    });

    it("applies custom className", () => {
      render(<Input className="custom-class" placeholder="Test" />);
      const input = screen.getByPlaceholderText("Test");
      expect(input).toHaveClass("custom-class");
    });

    it("forwards ref correctly", () => {
      const ref = { current: null };
      render(<Input ref={ref} placeholder="Ref test" />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });
});
