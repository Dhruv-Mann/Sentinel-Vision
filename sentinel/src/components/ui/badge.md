# Badge Component

Visual indicator for status and categories with semantic variants.

## Quick Reference

```tsx
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

// Basic
<Badge>Default</Badge>

// Variants
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Expired</Badge>
<Badge variant="info">Info</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// With Icon
<Badge variant="success" icon={<Check />}>Active</Badge>

// Icon Only
<Badge variant="error" icon={<X />} aria-label="Error" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | "default" \| "success" \| "warning" \| "error" \| "info" | "default" | Visual style variant |
| size | "sm" \| "md" \| "lg" | "md" | Badge size |
| icon | React.ReactNode | - | Optional icon element |
| children | React.ReactNode | - | Badge content |
| className | string | - | Additional CSS classes |

## Features

- ✓ Semantic color variants
- ✓ Three size options
- ✓ Icon support
- ✓ Pill shape (fully rounded)
- ✓ Uppercase text with letter spacing
- ✓ Accessible with ARIA support
- ✓ Theme-aware (light/dark)

## Design Tokens

- Colors: Semantic color system
- Typography: 10-12px, semibold, uppercase
- Spacing: 8-16px horizontal padding
- Border Radius: Full (pill shape)
- Animation: 150ms transitions

## Accessibility

- Use `aria-label` for icon-only badges
- Semantic colors provide visual meaning
- Text should be descriptive for screen readers
- Not focusable (display element)

## Demo

See `/badge-demo` for live examples.
