import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      icon,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles - common to all variants
    const baseStyles = cn(
      // Layout & Display
      "inline-flex",
      "items-center",
      "justify-center",
      "gap-1.5",
      
      // Border radius: Full (pill shape) for status badges
      "rounded-full",
      
      // Typography - uppercase with increased letter spacing
      "font-semibold", // 600 weight
      "uppercase",
      "tracking-wide", // 0.025em letter spacing
      
      // Transitions
      "transition-colors",
      "duration-[150ms]",
      "ease-out"
    );

    // Variant styles - subtle background colors with higher contrast text
    const variantStyles = {
      default: cn(
        "bg-[var(--color-bg-input)]",
        "text-[var(--color-text-secondary)]",
        "border border-[var(--color-border-main)]"
      ),
      success: cn(
        "bg-[var(--color-success-bg)]",
        "text-[var(--color-success)]",
        "border border-[var(--color-success)]/20"
      ),
      warning: cn(
        "bg-[var(--color-warning-bg)]",
        "text-[var(--color-warning)]",
        "border border-[var(--color-warning)]/20"
      ),
      error: cn(
        "bg-[var(--color-error-bg)]",
        "text-[var(--color-error)]",
        "border border-[var(--color-error)]/20"
      ),
      info: cn(
        "bg-[var(--color-info-bg)]",
        "text-[var(--color-info)]",
        "border border-[var(--color-info)]/20"
      ),
    };

    // Size styles - appropriate padding and font sizes
    const sizeStyles = {
      sm: cn(
        "h-5",
        "px-2", // 8px horizontal padding
        "text-[10px]", // 10px font size
        "gap-1"
      ),
      md: cn(
        "h-6",
        "px-3", // 12px horizontal padding
        "text-[11px]", // 11px font size
        "gap-1.5"
      ),
      lg: cn(
        "h-7",
        "px-4", // 16px horizontal padding
        "text-[12px]", // 12px font size
        "gap-2"
      ),
    };

    // Icon size based on badge size
    const iconSizeClass = {
      sm: "h-3 w-3",
      md: "h-3.5 w-3.5",
      lg: "h-4 w-4",
    };

    return (
      <span
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {icon && (
          <span className={cn("inline-flex", iconSizeClass[size])} aria-hidden="true">
            {icon}
          </span>
        )}
        {children && <span>{children}</span>}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
