import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      success = false,
      helperText,
      icon,
      iconPosition = "left",
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID for label association if not provided
    const inputId = id || React.useId();
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    // Determine state styling
    const hasError = !!error;
    const hasSuccess = success && !hasError;

    // Base input styles
    const baseStyles = cn(
      // Layout & Display
      "w-full",
      "h-10",
      "min-h-[40px]", // Minimum 40px height for comfortable interaction
      "px-3",
      icon && iconPosition === "left" && "pl-10",
      icon && iconPosition === "right" && "pr-10",
      
      // Typography
      "text-[var(--text-base)]",
      "font-normal",
      
      // Appearance
      "bg-[var(--color-bg-input)]",
      "border",
      "rounded-lg",
      
      // Transitions
      "transition-all",
      "duration-[150ms]",
      "ease-out",
      
      // Placeholder
      "placeholder:text-[var(--color-text-muted)]",
      "placeholder:opacity-50",
      
      // Focus styles - 2-3px focus ring
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-[var(--color-border-focus)]",
      "focus-visible:ring-offset-2",
      "focus-visible:ring-offset-[var(--color-bg-page)]",
      
      // Disabled state
      disabled && "opacity-50 cursor-not-allowed"
    );

    // State-specific border colors
    const borderStyles = cn(
      // Default state
      !hasError && !hasSuccess && [
        "border-[var(--color-border-main)]",
        "focus:border-[var(--color-border-hover)]",
      ],
      // Error state - red border
      hasError && [
        "border-[var(--color-error)]",
        "focus:border-[var(--color-error)]",
      ],
      // Success state - green border
      hasSuccess && [
        "border-[var(--color-success)]",
        "focus:border-[var(--color-success)]",
      ]
    );

    // Text color
    const textStyles = cn(
      "text-[var(--color-text-primary)]",
      disabled && "text-[var(--color-text-muted)]"
    );

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block",
              "mb-2", // 8px spacing above input
              "text-[var(--text-sm)]",
              "font-medium",
              "text-[var(--color-text-primary)]",
              disabled && "opacity-50"
            )}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {icon && iconPosition === "left" && (
            <div
              className={cn(
                "absolute",
                "left-3",
                "top-1/2",
                "-translate-y-1/2",
                "flex",
                "items-center",
                "pointer-events-none",
                "text-[var(--color-text-muted)]",
                hasError && "text-[var(--color-error)]",
                hasSuccess && "text-[var(--color-success)]"
              )}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              baseStyles,
              borderStyles,
              textStyles,
              className
            )}
            disabled={disabled}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            {...props}
          />

          {/* Right Icon or Success Checkmark */}
          {(icon && iconPosition === "right") || hasSuccess ? (
            <div
              className={cn(
                "absolute",
                "right-3",
                "top-1/2",
                "-translate-y-1/2",
                "flex",
                "items-center",
                "pointer-events-none",
                "text-[var(--color-text-muted)]",
                hasError && "text-[var(--color-error)]",
                hasSuccess && "text-[var(--color-success)]"
              )}
              aria-hidden="true"
            >
              {hasSuccess && !icon ? (
                <Check className="h-4 w-4" />
              ) : (
                icon
              )}
            </div>
          ) : null}
        </div>

        {/* Error Message */}
        {error && (
          <p
            id={errorId}
            className={cn(
              "mt-1.5", // 6px spacing below input
              "text-[var(--text-sm)]",
              "text-[var(--color-error)]",
              "flex",
              "items-start",
              "gap-1"
            )}
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p
            id={helperId}
            className={cn(
              "mt-1.5", // 6px spacing below input
              "text-[var(--text-sm)]",
              "text-[var(--color-text-secondary)]"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
