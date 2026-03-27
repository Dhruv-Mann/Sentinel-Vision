# Button Component

## Overview

The Button component is a fully accessible, production-ready interactive element that implements all requirements from the Apple Frontend Redesign specification. It provides multiple variants, sizes, and states with smooth animations and comprehensive accessibility support.

## Requirements Validation

### Requirement 8: Button Component Redesign

✅ **8.1** - Variants: primary, secondary, outline, ghost, destructive  
✅ **8.2** - Sizes: sm, md, lg, xl with consistent padding and font sizes  
✅ **8.3** - Focus ring: 2-3px width with primary color at 40% opacity  
✅ **8.4** - Icon-only variant with square aspect ratio  
✅ **8.5** - Loading state with spinner replacing content  
✅ **8.6** - Disabled state with reduced opacity (50%) and no pointer events  
✅ **8.7** - Hover transition: Background color over 150ms  
✅ **8.8** - Active state: Applied immediately on click  
✅ **8.9** - Touch target: Minimum 44x44px on mobile (lg and xl sizes)

### Requirement 5: Component State System

✅ **5.1** - Default state styling  
✅ **5.2** - Hover state with subtle background color change  
✅ **5.3** - Focus state with visible focus ring  
✅ **5.4** - Active state with scale reduction (0.97) and brightness adjustment  
✅ **5.5** - Disabled state with 50% opacity and cursor-not-allowed  
✅ **5.6** - Loading state with spinner  
✅ **5.8** - Smooth hover transition over 150ms  
✅ **5.9** - Focus indicator displays immediately without transition delay

## API Reference

### Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}
```

#### `variant`
- **Type**: `"primary" | "secondary" | "outline" | "ghost" | "destructive"`
- **Default**: `"primary"`
- **Description**: Visual style variant of the button

**Variants:**
- `primary`: Solid background with accent color (default)
- `secondary`: Subtle background with border
- `outline`: Transparent background with border
- `ghost`: Transparent background, no border
- `destructive`: Red accent for dangerous actions

#### `size`
- **Type**: `"sm" | "md" | "lg" | "xl"`
- **Default**: `"md"`
- **Description**: Size of the button with consistent padding

**Sizes:**
- `sm`: 36px min height, 12px horizontal padding
- `md`: 40px min height, 16px horizontal padding
- `lg`: 44px min height, 24px horizontal padding (meets touch target requirement)
- `xl`: 48px min height, 32px horizontal padding

#### `loading`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Shows loading spinner and disables the button

#### `icon`
- **Type**: `React.ReactNode`
- **Default**: `undefined`
- **Description**: Icon element to display in the button

#### `iconPosition`
- **Type**: `"left" | "right"`
- **Default**: `"left"`
- **Description**: Position of the icon relative to text

#### `fullWidth`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Makes the button span the full width of its container

## Usage Examples

### Basic Usage

```tsx
import { Button } from "@/components/ui/button";

export default function Example() {
  return <Button>Click me</Button>;
}
```

### Variants

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
```

### Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

### With Icons

```tsx
import { Heart, Download } from "lucide-react";

// Icon on the left
<Button icon={<Heart />} iconPosition="left">
  Like
</Button>

// Icon on the right
<Button icon={<Download />} iconPosition="right">
  Download
</Button>

// Icon-only button (requires aria-label)
<Button icon={<Heart />} aria-label="Like this post" />
```

### Loading State

```tsx
const [loading, setLoading] = useState(false);

<Button loading={loading} onClick={() => setLoading(true)}>
  Submit
</Button>
```

### Disabled State

```tsx
<Button disabled>Disabled Button</Button>
```

### Full Width

```tsx
<Button fullWidth>Full Width Button</Button>
```

### Form Integration

```tsx
<form onSubmit={handleSubmit}>
  <Button type="submit" loading={isSubmitting}>
    Submit Form
  </Button>
</form>
```

## States

### Default
Base styling with appropriate variant colors.

### Hover
- Background opacity increases by ~10%
- Transition duration: 150ms
- Easing: ease-out

### Focus
- 2-3px focus ring with primary color at 40% opacity
- Ring offset: 2px
- Visible on keyboard navigation (focus-visible)

### Active
- Scale: 0.97
- Brightness: 95%
- Applied immediately on click

### Disabled
- Opacity: 50%
- Cursor: not-allowed
- Pointer events: none

### Loading
- Spinner replaces content
- Button is disabled
- aria-busy attribute set to true
- Screen reader announces "Loading..."

## Accessibility

### Keyboard Navigation
- Fully keyboard accessible via Tab key
- Enter and Space keys trigger the button
- Focus indicator visible on keyboard focus

### Screen Reader Support
- Icon-only buttons require `aria-label` prop
- Loading state announced via `aria-busy` attribute
- Disabled state prevents interaction

### Touch Targets
- `lg` size: 44x44px minimum (meets WCAG requirement)
- `xl` size: 48x48px minimum
- Recommended for mobile interfaces

### Focus Management
- Focus ring uses `focus-visible` to show only on keyboard navigation
- Focus ring color: `--color-border-focus` (40% opacity)
- Focus ring width: 2px
- Focus ring offset: 2px

## Design Tokens

The Button component uses the following design tokens from `globals.css`:

### Colors
- `--color-accent`: Primary button background
- `--color-accent-hover`: Primary button hover state
- `--color-bg-input`: Secondary button background
- `--color-bg-hover`: Hover state background
- `--color-border-main`: Border color
- `--color-border-hover`: Border hover color
- `--color-border-focus`: Focus ring color
- `--color-error`: Destructive button background
- `--color-text-primary`: Text color
- `--color-bg-page`: Background for focus ring offset

### Typography
- `--text-sm`: Small button text (12px)
- `--text-base`: Medium button text (16px)
- `--text-lg`: Large button text (18px)
- `--text-xl`: Extra large button text (20px)

### Animation
- `--duration-fast`: 150ms (hover transitions)
- `--ease-out`: cubic-bezier(0, 0, 0.2, 1)

### Border Radius
- `--radius-lg`: 12px (button corners)

## Best Practices

### Do's
✅ Use `primary` variant for main call-to-action buttons  
✅ Use `destructive` variant for dangerous actions (delete, remove)  
✅ Provide `aria-label` for icon-only buttons  
✅ Use `loading` state during async operations  
✅ Use `lg` or `xl` sizes for mobile touch targets  
✅ Use `fullWidth` for form submit buttons on mobile  

### Don'ts
❌ Don't use multiple primary buttons in the same section  
❌ Don't forget `aria-label` on icon-only buttons  
❌ Don't use `sm` size for primary mobile interactions  
❌ Don't nest interactive elements inside buttons  
❌ Don't override focus styles (accessibility requirement)  

## Testing

To test the Button component, visit the demo page:

```
http://localhost:3000/button-demo
```

The demo page showcases:
- All 5 variants
- All 4 sizes
- All states (default, hover, focus, active, disabled, loading)
- Icon positioning (left, right, icon-only)
- Full width variant
- Accessibility features

## Browser Support

The Button component is compatible with:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

## Performance

- No runtime dependencies beyond React and lucide-react
- CSS-only animations (no JavaScript)
- Minimal re-renders (uses React.forwardRef)
- Tree-shakeable icon imports

## Related Components

- **Input**: Form input component with similar state system
- **Card**: Container component with similar hover states
- **Modal**: Dialog component that uses Button for actions
