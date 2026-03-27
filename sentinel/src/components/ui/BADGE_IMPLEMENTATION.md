# Badge Component Implementation

## Overview

The Badge component is a production-ready UI element designed for visual status indicators and category labels. It follows Apple-level design principles with semantic variants, flexible sizing, and comprehensive accessibility support.

## Requirements Validation

### Requirement 32.1: Badge Variants ✓
- **Default**: Neutral gray for general labels
- **Success**: Green semantic color for active/completed states
- **Warning**: Orange semantic color for pending/attention states
- **Error**: Red semantic color for failed/expired states
- **Info**: Blue semantic color for informational states

### Requirement 32.2: Badge Sizes ✓
- **Small (sm)**: 20px height, 8px horizontal padding, 10px font size
- **Medium (md)**: 24px height, 12px horizontal padding, 11px font size (default)
- **Large (lg)**: 28px height, 16px horizontal padding, 12px font size

### Requirement 32.3: Pill Shape ✓
- Uses `rounded-full` for fully rounded corners (pill shape)
- Consistent across all variants and sizes

### Requirement 32.4: Subtle Background Colors ✓
- Uses semantic color background tokens with 10% opacity
- Higher contrast text using full semantic colors
- Subtle borders with 20% opacity for definition

### Requirement 32.5: Icon + Text Combinations ✓
- Supports icon prop for adding icons
- Icons automatically sized based on badge size
- Proper spacing between icon and text (gap-1.5)
- Supports icon-only badges

### Requirement 32.6: Uppercase Text with Letter Spacing ✓
- Uses `uppercase` text transformation
- Applies `tracking-wide` (0.025em letter spacing)
- Uses `font-semibold` (600 weight) for emphasis

### Requirement 32.7: Semantic Colors ✓
- Green (`--color-success`) for active states
- Red (`--color-error`) for expired states
- Orange (`--color-warning`) for pending states
- Blue (`--color-info`) for informational states

## Component API

```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}
```

### Props

- **variant**: Visual style variant (default: "default")
- **size**: Size of the badge (default: "md")
- **icon**: Optional icon element to display before text
- **children**: Badge content (text or elements)
- **className**: Additional CSS classes
- **...props**: All standard HTML span attributes

## Usage Examples

### Basic Usage

```tsx
import { Badge } from "@/components/ui/badge";

// Simple text badge
<Badge>Default</Badge>

// Success variant
<Badge variant="success">Active</Badge>

// With size
<Badge variant="error" size="lg">Expired</Badge>
```

### With Icons

```tsx
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle } from "lucide-react";

// Icon + text
<Badge variant="success" icon={<Check />}>
  Active
</Badge>

// Icon only (requires aria-label)
<Badge variant="error" icon={<X />} aria-label="Error status" />
```

### Real-World Examples

```tsx
// Resume status
<Badge variant="success" icon={<Check />}>Active</Badge>
<Badge variant="error" icon={<X />}>Expired</Badge>
<Badge variant="warning" icon={<Clock />}>Expiring Soon</Badge>

// Analytics tags
<Badge variant="default" size="sm">Desktop</Badge>
<Badge variant="default" size="sm">Mobile</Badge>

// Notification counts
<Badge variant="error" size="sm">3</Badge>
```

## Design Tokens Used

### Colors
- `--color-bg-input`: Default background
- `--color-success`, `--color-success-bg`: Success variant
- `--color-warning`, `--color-warning-bg`: Warning variant
- `--color-error`, `--color-error-bg`: Error variant
- `--color-info`, `--color-info-bg`: Info variant
- `--color-border-main`: Default border
- `--color-text-secondary`: Default text

### Typography
- Font sizes: 10px (sm), 11px (md), 12px (lg)
- Font weight: 600 (semibold)
- Letter spacing: 0.025em (tracking-wide)
- Text transform: uppercase

### Spacing
- Heights: 20px (sm), 24px (md), 28px (lg)
- Horizontal padding: 8px (sm), 12px (md), 16px (lg)
- Icon gap: 4px (sm), 6px (md), 8px (lg)

### Border Radius
- `rounded-full`: Pill shape (9999px)

### Animation
- Duration: 150ms (--duration-fast)
- Easing: ease-out (--ease-out)

## Accessibility

### ARIA Support
- Accepts all standard HTML span attributes
- Supports `aria-label` for icon-only badges
- Supports `role="status"` for status indicators
- Icons marked with `aria-hidden="true"`

### Screen Reader Considerations
- Text content is always readable
- Icon-only badges should include `aria-label`
- Semantic colors provide visual meaning but text should be descriptive

### Keyboard Navigation
- Not focusable by default (display element, not interactive)
- If used in interactive contexts, wrap in button/link

## Testing

### Unit Tests
Comprehensive test suite covering:
- All variants render correctly
- All sizes apply appropriate styles
- Icon support (with text and icon-only)
- Typography features (uppercase, letter spacing)
- Accessibility attributes
- Edge cases (empty children, long text)

### Visual Testing
Demo page available at `/badge-demo` showcasing:
- All variants and sizes
- Icon combinations
- Real-world usage examples
- Typography features
- Accessibility patterns

## Performance

- Lightweight component with minimal DOM nodes
- Uses CSS custom properties for theming
- No JavaScript dependencies beyond React
- Optimized for tree-shaking

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Supports both light and dark themes
- Graceful degradation for older browsers

## Future Enhancements

Potential improvements for future iterations:
- Dismissible badges with close button
- Animated entrance/exit transitions
- Dot variant for minimal indicators
- Custom color variants
- Badge groups with spacing utilities

## Related Components

- **Button**: For interactive elements with similar styling
- **Card**: Often contains badges for status indication
- **Input**: May use badges for validation feedback

## Demo

Visit `/badge-demo` to see all variants, sizes, and usage examples in action.
