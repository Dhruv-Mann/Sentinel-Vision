import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // Base styles - common to all variants
    const baseStyles = cn(
      // Layout & Display
      "inline-flex items-center justify-center gap-2",
      "font-medium",
      "rounded-lg",
      "transition-all",
      "duration-[150ms]",
      "ease-out",
      
      // Focus styles - 2-3px focus ring with primary color at 40% opacity
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-[var(--color-border-focus)]",
      "focus-visible:ring-offset-2",
      "focus-visible:ring-offset-[var(--color-bg-page)]",
      
      // Active state - scale 0.97, brightness 95%
      "active:scale-[0.97]",
      "active:brightness-95",
      
      // Disabled state - opacity 50%, cursor not-allowed
      isDisabled && "opacity-50 cursor-not-allowed pointer-events-none"
    );

    // Variant styles
    const variantStyles = {
      primary: cn(
        "bg-[var(--color-accent)]",
        "text-[var(--color-bg-page)]",
        "hover:bg-[var(--color-accent-hover)]",
        "shadow-sm"
      ),
      secondary: cn(
        "bg-[var(--color-bg-input)]",
        "text-[var(--color-text-primary)]",
        "border border-[var(--color-border-main)]",
        "hover:bg-[var(--color-bg-hover)]",
        "hover:border-[var(--color-border-hover)]"
      ),
      outline: cn(
        "bg-transparent",
        "text-[var(--color-text-primary)]",
        "border border-[var(--color-border-main)]",
        "hover:bg-[var(--color-bg-hover)]",
        "hover:border-[var(--color-border-hover)]"
      ),
      ghost: cn(
        "bg-transparent",
        "text-[var(--color-text-primary)]",
        "hover:bg-[var(--color-bg-hover)]"
      ),
      destructive: cn(
        "bg-[var(--color-error)]",
        "text-white",
        "hover:bg-[var(--color-error)]/90",
        "shadow-sm"
      ),
    };

    // Size styles - consistent padding and font sizes
    // Minimum 44x44px touch target on mobile
    const sizeStyles = {
      sm: cn(
        "h-9",
        "min-h-[36px]",
        "px-3",
        "text-[var(--text-sm)]",
        // Icon-only: square aspect ratio
        !children && icon && "w-9 min-w-[36px]"
      ),
      md: cn(
        "h-10",
        "min-h-[40px]",
        "px-4",
        "text-[var(--text-base)]",
        // Icon-only: square aspect ratio
        !children && icon && "w-10 min-w-[40px]"
      ),
      lg: cn(
        "h-11",
        "min-h-[44px]", // Minimum touch target
        "px-6",
        "text-[var(--text-lg)]",
        // Icon-only: square aspect ratio
        !children && icon && "w-11 min-w-[44px]"
      ),
      xl: cn(
        "h-12",
        "min-h-[48px]",
        "px-8",
        "text-[var(--text-xl)]",
        // Icon-only: square aspect ratio
        !children && icon && "w-12 min-w-[48px]"
      ),
    };

    // Full width style
    const widthStyle = fullWidth ? "w-full" : "";

    // Render icon with proper positioning
    const renderIcon = () => {
      if (loading) {
        return <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />;
      }
      if (icon) {
        return <span className="inline-flex" aria-hidden="true">{icon}</span>;
      }
      return null;
    };

    // ARIA label for icon-only buttons
    const ariaLabel = !children && icon ? props["aria-label"] : undefined;

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          widthStyle,
          className
        )}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-busy={loading}
        {...props}
      >
        {iconPosition === "left" && renderIcon()}
        {loading ? (
          <span className="sr-only">Loading...</span>
        ) : (
          children && <span>{children}</span>
        )}
        {iconPosition === "right" && !loading && renderIcon()}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
