import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "elevated";
  clickable?: boolean;
  padding?: "sm" | "md" | "lg";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      clickable = false,
      padding = "md",
      children,
      ...props
    },
    ref
  ) => {
    // Base styles - common to all variants
    const baseStyles = cn(
      // Layout & Display
      "relative",
      "w-full",
      
      // Border radius: 12-16px for modern appearance
      "rounded-xl", // 16px (--radius-xl)
      
      // Border: 1px subtle border with low-contrast color
      "border",
      "border-[var(--color-border-main)]",
      
      // Transitions - shadow and border over 200ms
      "transition-all",
      "duration-200",
      "ease-out",
      
      // Clickable cursor
      clickable && "cursor-pointer"
    );

    // Variant styles
    const variantStyles = {
      default: cn(
        // Solid background
        "bg-[var(--color-bg-card-solid)]",
        // Subtle shadow
        "shadow-sm",
        // Hover state for clickable cards
        clickable && [
          "hover:shadow-md", // Shadow elevation increase
          "hover:border-[var(--color-border-hover)]", // Border color shift
        ]
      ),
      glass: cn(
        // Semi-transparent background with backdrop blur
        "bg-[var(--color-bg-card)]",
        "backdrop-blur-md",
        // Subtle shadow
        "shadow-sm",
        // Hover state for clickable cards
        clickable && [
          "hover:shadow-md", // Shadow elevation increase
          "hover:border-[var(--color-border-hover)]", // Border color shift
          "hover:bg-[var(--color-bg-card)]/90", // Slight background opacity increase
        ]
      ),
      elevated: cn(
        // Solid background
        "bg-[var(--color-bg-card-solid)]",
        // Higher elevation shadow
        "shadow-lg",
        // Hover state for clickable cards
        clickable && [
          "hover:shadow-xl", // Shadow elevation increase
          "hover:border-[var(--color-border-hover)]", // Border color shift
        ]
      ),
    };

    // Padding styles - consistent internal padding (20-24px)
    const paddingStyles = {
      sm: "p-4", // 16px
      md: "p-5", // 20px
      lg: "p-6", // 24px
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
