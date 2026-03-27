# Input Component

A production-ready, accessible text input field with comprehensive validation states and Apple-level design quality.

## Quick Start

```tsx
import { Input } from "@/components/ui/input";

// Basic usage
<Input label="Email" placeholder="Enter your email" />

// With validation
<Input 
  label="Email" 
  error="Invalid email address"
  placeholder="john@example.com" 
/>

// With icon
import { Mail } from "lucide-react";
<Input 
  label="Email"
  icon={<Mail className="h-4 w-4" />}
  iconPosition="left"
  placeholder="john@example.com"
/>
```

## Features

- ✅ Label with 8px spacing
- ✅ Error/success states
- ✅ Icon prefix/suffix
- ✅ Helper text
- ✅ 40px minimum height
- ✅ 2-3px focus ring
- ✅ Full accessibility
- ✅ TypeScript support

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label text above input |
| `error` | `string` | - | Error message below input |
| `success` | `boolean` | `false` | Success state with green border |
| `helperText` | `string` | - | Helper text below input |
| `icon` | `ReactNode` | - | Icon element |
| `iconPosition` | `"left" \| "right"` | `"left"` | Icon position |

Plus all standard HTML input attributes (`type`, `placeholder`, `value`, `onChange`, etc.)

## States

- **Default**: Neutral border
- **Focus**: 2-3px focus ring
- **Error**: Red border + error message
- **Success**: Green border + checkmark
- **Disabled**: 50% opacity

## Demo

Visit `/input-demo` to see all variations.

## Documentation

See [INPUT_IMPLEMENTATION.md](./INPUT_IMPLEMENTATION.md) for complete documentation.
