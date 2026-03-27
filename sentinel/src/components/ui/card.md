# Card Component

A production-ready Card component with variants, hover states, and flexible padding options. Built for the Apple Frontend Redesign spec.

## Features

- **Three Variants**: Default (solid), Glass (glassmorphism), and Elevated (high shadow)
- **Clickable State**: Optional hover effects with shadow elevation and border color transitions
- **Flexible Padding**: Small (16px), Medium (20px), and Large (24px) options
- **Modern Design**: 16px border radius with subtle 1px borders
- **Smooth Transitions**: 200ms transitions for shadow and border changes
- **Design System Integration**: Uses CSS custom properties from the design token system

## Usage

```tsx
import { Card } from "@/components/ui/card";

// Basic card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// Glass variant with clickable state
<Card variant="glass" clickable onClick={() => console.log("Clicked!")}>
  <h3>Clickable Glass Card</h3>
  <p>Hover to see the effect</p>
</Card>

// Elevated card with large padding
<Card variant="elevated" padding="lg">
  <h3>Elevated Card</h3>
  <p>With generous padding</p>
</Card>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "glass" \| "elevated"` | `"default"` | Visual style variant |
| `clickable` | `boolean` | `false` | Enables hover effects and pointer cursor |
| `padding` | `"sm" \| "md" \| "lg"` | `"md"` | Internal padding size |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Card content |

## Variants

### Default
- Solid background (`--color-bg-card-solid`)
- Subtle shadow (`shadow-sm`)
- Best for standard content containers

### Glass
- Semi-transparent background (`--color-bg-card`)
- Backdrop blur effect
- Modern glassmorphism appearance

### Elevated
- Solid background with higher shadow (`shadow-lg`)
- Prominent elevation for emphasis
- Hover increases to `shadow-xl` when clickable

## Clickable State

When `clickable={true}`:
- Cursor changes to pointer
- Shadow elevation increases on hover
- Border color shifts to `--color-border-hover`
- Smooth 200ms transition

## Padding Sizes

- **Small (`sm`)**: 16px - Compact layouts
- **Medium (`md`)**: 20px - Default, balanced spacing
- **Large (`lg`)**: 24px - Generous breathing room

## Design Tokens Used

- Border radius: `rounded-xl` (16px)
- Border: `border-[var(--color-border-main)]`
- Transitions: `duration-200 ease-out`
- Shadows: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`

## Accessibility

- Semantic HTML (`<div>`)
- Supports all standard HTML div attributes
- Accepts ARIA attributes for enhanced accessibility
- Keyboard accessible when clickable (via onClick handler)

## Requirements Validated

- **10.1**: 16px border-radius for modern appearance ✓
- **10.2**: 1px subtle border with low-contrast color ✓
- **10.3**: Consistent internal padding (20-24px) ✓
- **10.4**: Hover state with shadow elevation increase ✓
- **10.5**: Clickable variant with cursor pointer ✓
- **10.7**: Transition shadow and border over 200ms ✓

## Demo

Visit `/card-demo` to see all variants and configurations in action.
