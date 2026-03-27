import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = "rectangular",
      width,
      height,
      animation = "pulse",
      style,
      ...props
    },
    ref
  ) => {
    // Base styles - common to all variants
    const baseStyles = cn(
      // Background - neutral gray matching theme
      "bg-[var(--color-bg-input)]",
      
      // Overflow hidden for wave animation
      "overflow-hidden",
      
      // Relative positioning for wave gradient
      "relative",
      
      // Transitions
      "transition-opacity",
      "duration-200",
      "ease-out"
    );

    // Variant styles
    const variantStyles = {
      text: cn(
        // Text-like appearance with rounded corners
        "rounded",
        // Default text height if not specified
        !height && "h-4"
      ),
      circular: cn(
        // Circular shape for avatars
        "rounded-full",
        // Default circular dimensions if not specified
        !width && !height && "h-12 w-12"
      ),
      rectangular: cn(
        // Rectangular shape for cards and images
        "rounded-lg", // 12px border radius
        // Default rectangular dimensions if not specified
        !height && "h-24"
      ),
    };

    // Animation styles
    const animationStyles = {
      pulse: cn(
        // Pulse animation: opacity 100% → 50% → 100%, 2s infinite
        "animate-pulse"
      ),
      wave: cn(
        // Wave animation: shimmer gradient, 1.5s infinite
        "before:absolute",
        "before:inset-0",
        "before:-translate-x-full",
        "before:animate-[shimmer_1.5s_infinite]",
        "before:bg-gradient-to-r",
        "before:from-transparent",
        "before:via-[var(--color-bg-hover)]",
        "before:to-transparent"
      ),
      none: "",
    };

    // Convert width/height to CSS values
    const dimensionStyles: React.CSSProperties = {
      ...(width && { width: typeof width === "number" ? `${width}px` : width }),
      ...(height && { height: typeof height === "number" ? `${height}px` : height }),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          animationStyles[animation],
          className
        )}
        style={dimensionStyles}
        aria-busy="true"
        aria-live="polite"
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

// Skeleton pattern components for common use cases

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

/**
 * SkeletonText - Multiple text lines with varying widths for realism
 * Usage: <SkeletonText lines={3} />
 */
export const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, className }, ref) => {
    // Varying widths for realistic text appearance
    const widths = ["100%", "80%", "60%"];
    
    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            width={widths[index % widths.length]}
            animation="pulse"
          />
        ))}
      </div>
    );
  }
);

SkeletonText.displayName = "SkeletonText";

export interface SkeletonCardProps {
  className?: string;
}

/**
 * SkeletonCard - Card-shaped skeleton matching typical card dimensions
 * Usage: <SkeletonCard />
 */
export const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-[var(--color-border-main)] p-5 space-y-4",
          className
        )}
      >
        {/* Header with avatar and title */}
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={40} height={40} animation="pulse" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="60%" animation="pulse" />
            <Skeleton variant="text" width="40%" animation="pulse" />
          </div>
        </div>
        
        {/* Content area */}
        <div className="space-y-2">
          <Skeleton variant="text" width="100%" animation="pulse" />
          <Skeleton variant="text" width="90%" animation="pulse" />
          <Skeleton variant="text" width="70%" animation="pulse" />
        </div>
        
        {/* Footer actions */}
        <div className="flex gap-2 pt-2">
          <Skeleton variant="rectangular" width={80} height={36} animation="pulse" />
          <Skeleton variant="rectangular" width={80} height={36} animation="pulse" />
        </div>
      </div>
    );
  }
);

SkeletonCard.displayName = "SkeletonCard";

export interface SkeletonAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

/**
 * SkeletonAvatar - Circular skeleton for profile images
 * Usage: <SkeletonAvatar size="lg" />
 */
export const SkeletonAvatar = React.forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ size = "md", className }, ref) => {
    const sizeMap = {
      sm: 32,
      md: 40,
      lg: 48,
      xl: 64,
    };
    
    return (
      <Skeleton
        ref={ref}
        variant="circular"
        width={sizeMap[size]}
        height={sizeMap[size]}
        animation="pulse"
        className={className}
      />
    );
  }
);

SkeletonAvatar.displayName = "SkeletonAvatar";

export interface SkeletonGridProps {
  columns?: number;
  rows?: number;
  gap?: number;
  className?: string;
}

/**
 * SkeletonGrid - Multiple skeletons in grid layout matching actual content
 * Usage: <SkeletonGrid columns={3} rows={2} />
 */
export const SkeletonGrid = React.forwardRef<HTMLDivElement, SkeletonGridProps>(
  ({ columns = 3, rows = 2, gap = 16, className }, ref) => {
    const totalItems = columns * rows;
    
    return (
      <div
        ref={ref}
        className={cn("grid", className)}
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`,
        }}
      >
        {Array.from({ length: totalItems }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }
);

SkeletonGrid.displayName = "SkeletonGrid";

export { Skeleton };
