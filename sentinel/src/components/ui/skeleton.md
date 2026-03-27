# Skeleton Component

Production-ready skeleton loading placeholders with smooth animations for Apple-level visual polish.

## Overview

The Skeleton component provides placeholder UI during content loading, improving perceived performance and user experience. It includes multiple variants, animations, and pre-built patterns for common use cases.

## Features

- **Multiple Variants**: Text, circular, and rectangular shapes
- **Smooth Animations**: Pulse and wave (shimmer) effects
- **Pattern Components**: Pre-built patterns for text, cards, avatars, and grids
- **Theme Compatible**: Uses design system tokens for consistent styling
- **Accessible**: Proper ARIA attributes for screen readers
- **Customizable**: Flexible width, height, and styling options

## Basic Usage

```tsx
import { Skeleton } from "@/components/ui/skeleton";

// Basic skeleton
<Skeleton />

// Text skeleton
<Skeleton variant="text" width="80%" />

// Circular skeleton (avatar)
<Skeleton variant="circular" width={40} height={40} />

// Rectangular skeleton with custom dimensions
<Skeleton variant="rectangular" width="100%" height={200} />
```

## Variants

### Text Variant
For text content placeholders with rounded corners.

```tsx
<Skeleton variant="text" width="100%" />
<Skeleton variant="text" width="80%" />
<Skeleton variant="text" width="60%" />
```

### Circular Variant
For avatar and profile image placeholders.

```tsx
<Skeleton variant="circular" width={48} height={48} />
```

### Rectangular Variant
For cards, images, and content blocks.

```tsx
<Skeleton variant="rectangular" height={200} />
```

## Animations

### Pulse Animation (Default)
Opacity fades from 100% → 50% → 100% over 2 seconds.

```tsx
<Skeleton animation="pulse" />
```

### Wave Animation
Shimmer gradient sweeps across the skeleton over 1.5 seconds.

```tsx
<Skeleton animation="wave" />
```

### No Animation
Static placeholder without animation.

```tsx
<Skeleton animation="none" />
```

## Pattern Components

### SkeletonText
Multiple text lines with varying widths for realistic appearance.

```tsx
import { SkeletonText } from "@/components/ui/skeleton";

<SkeletonText lines={3} />
```

**Props:**
- `lines?: number` - Number of text lines (default: 3)
- `className?: string` - Additional CSS classes

### SkeletonCard
Complete card structure with header, content, and footer.

```tsx
import { SkeletonCard } from "@/components/ui/skeleton";

<SkeletonCard />
```

**Props:**
- `className?: string` - Additional CSS classes

### SkeletonAvatar
Circular avatar placeholder with size variants.

```tsx
import { SkeletonAvatar } from "@/components/ui/skeleton";

<SkeletonAvatar size="md" />
```

**Props:**
- `size?: "sm" | "md" | "lg" | "xl"` - Avatar size (default: "md")
  - sm: 32px
  - md: 40px
  - lg: 48px
  - xl: 64px
- `className?: string` - Additional CSS classes

### SkeletonGrid
Grid of skeleton cards matching your content layout.

```tsx
import { SkeletonGrid } from "@/components/ui/skeleton";

<SkeletonGrid columns={3} rows={2} gap={16} />
```

**Props:**
- `columns?: number` - Number of columns (default: 3)
- `rows?: number` - Number of rows (default: 2)
- `gap?: number` - Gap between items in pixels (default: 16)
- `className?: string` - Additional CSS classes

## Real-World Examples

### Loading Dashboard Cards

```tsx
import { SkeletonCard } from "@/components/ui/skeleton";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => (
        <Card key={item.id}>{/* Actual content */}</Card>
      ))}
    </div>
  );
}
```

### Loading User Profile

```tsx
import { SkeletonAvatar, SkeletonText } from "@/components/ui/skeleton";

function UserProfile() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <SkeletonAvatar size="xl" />
        <div className="flex-1">
          <SkeletonText lines={2} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <img src={user.avatar} className="w-16 h-16 rounded-full" />
      <div>
        <h3>{user.name}</h3>
        <p>{user.bio}</p>
      </div>
    </div>
  );
}
```

### Loading Article Content

```tsx
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

function Article() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <article className="space-y-6">
        {/* Title */}
        <Skeleton variant="text" width="70%" height={32} />
        
        {/* Featured image */}
        <Skeleton variant="rectangular" height={400} />
        
        {/* Content */}
        <SkeletonText lines={8} />
      </article>
    );
  }

  return (
    <article>
      <h1>{article.title}</h1>
      <img src={article.image} />
      <p>{article.content}</p>
    </article>
  );
}
```

### Loading Data Table

```tsx
import { Skeleton } from "@/components/ui/skeleton";

function DataTable() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="20%" />
            <Skeleton variant="text" width="15%" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <table>
      {/* Actual table content */}
    </table>
  );
}
```

## API Reference

### Skeleton Props

```typescript
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}
```

**Props:**
- `variant` - Shape of the skeleton (default: "rectangular")
- `width` - Width in pixels (number) or CSS value (string)
- `height` - Height in pixels (number) or CSS value (string)
- `animation` - Animation type (default: "pulse")
- `className` - Additional CSS classes
- `style` - Inline styles (merged with dimension styles)

## Design System Integration

The Skeleton component uses design system tokens for consistent styling:

- **Background**: `--color-bg-input` (neutral gray)
- **Border Radius**: `--radius-lg` (12px) for rectangular
- **Animation Duration**: 2s for pulse, 1.5s for wave
- **Transitions**: 200ms for opacity changes

## Accessibility

The component includes proper ARIA attributes:

- `aria-busy="true"` - Indicates loading state
- `aria-live="polite"` - Announces changes to screen readers

## Performance Considerations

- Uses CSS transforms for animations (GPU-accelerated)
- Minimal DOM nodes for pattern components
- No JavaScript animations (pure CSS)
- Respects `prefers-reduced-motion` via Tailwind's `animate-pulse`

## Browser Support

Works in all modern browsers that support:
- CSS custom properties
- CSS animations
- CSS transforms
- Flexbox and Grid

## Requirements Validation

This component validates the following requirements:

- **30.1**: Skeleton placeholders matching dimensions of actual content
- **30.2**: Subtle shimmer animation to indicate loading state
- **30.3**: Neutral gray colors consistent with design system
- **30.4**: Skeleton cards in same grid layout as actual cards
- **30.5**: Skeleton text lines with varying widths for realism
- **30.6**: Smooth transition to actual content when loading completes
- **30.7**: Display skeleton placeholders immediately when data is loading
- **30.8**: Fade out skeletons and fade in content over 200ms
- **5.6**: Loading state with skeleton placeholder
- **18.1**: Skeleton placeholders for content being fetched
- **18.6**: Match skeleton placeholder dimensions to actual content
- **18.7**: Skeleton placeholders with subtle shimmer animation

## Demo

Visit `/skeleton-demo` to see all variants and patterns in action with interactive controls.
