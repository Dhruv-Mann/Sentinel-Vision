# Input Component Implementation

## Overview

The Input component is a production-ready, accessible text input field with comprehensive validation states, icon support, and Apple-level design quality. It follows the design system tokens and provides clear visual feedback for all interaction states.

## Features

### Core Features
- ✅ Label with proper association (8px spacing above input)
- ✅ Placeholder text with reduced opacity (50%)
- ✅ Helper text for additional guidance
- ✅ Error messages with inline display
- ✅ Success state with green border and checkmark
- ✅ Icon prefix/suffix support
- ✅ Minimum 40px height for comfortable interaction
- ✅ Full TypeScript support with proper types

### States
- ✅ **Default**: Neutral border with subtle styling
- ✅ **Focus**: 2-3px focus ring with primary color at 40% opacity
- ✅ **Error**: Red border with error message below
- ✅ **Success**: Green border with optional checkmark icon
- ✅ **Disabled**: Reduced opacity (50%) with cursor-not-allowed

### Accessibility
- ✅ Proper label association via `htmlFor` and `id`
- ✅ Error messages announced to screen readers via `role="alert"`
- ✅ `aria-invalid` attribute when error is present
- ✅ `aria-describedby` for error and helper text association
- ✅ Decorative icons hidden from screen readers with `aria-hidden`
- ✅ Keyboard accessible with visible focus indicators
- ✅ Minimum 40px height for touch targets

### Design System Integration
- ✅ Uses CSS custom properties from design tokens
- ✅ Consistent spacing (base-8 scale)
- ✅ Typography tokens for text sizing
- ✅ Color tokens for theming (light/dark mode support)
- ✅ Animation tokens for smooth transitions (150ms)
- ✅ Border radius tokens (lg: 12px)

## API Reference

### Props

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;           // Label text displayed above input
  error?: string;           // Error message displayed below input
  success?: boolean;        // Success state with green border
  helperText?: string;      // Helper text displayed below input
  icon?: React.ReactNode;   // Icon element (Lucide React recommended)
  iconPosition?: "left" | "right"; // Icon position within input
}
```

### Inherited Props

All standard HTML input attributes are supported:
- `type`: "text" | "email" | "password" | "number" | "date" | "time" | etc.
- `placeholder`: Placeholder text
- `value`: Controlled value
- `onChange`: Change handler
- `onBlur`: Blur handler
- `disabled`: Disabled state
- `required`: Required field
- `name`: Form field name
- `id`: Custom ID (auto-generated if not provided)
- `className`: Additional CSS classes
- `ref`: Forward ref support

## Usage Examples

### Basic Input

```tsx
import { Input } from "@/components/ui/input";

<Input
  label="Email"
  placeholder="Enter your email"
/>
```

### With Helper Text

```tsx
<Input
  label="Username"
  placeholder="johndoe"
  helperText="Choose a unique username"
/>
```

### Error State

```tsx
<Input
  label="Email"
  placeholder="john@example.com"
  error="Please enter a valid email address"
/>
```

### Success State

```tsx
<Input
  label="Email"
  value="john@example.com"
  success
  readOnly
/>
```

### With Icon (Left)

```tsx
import { Mail } from "lucide-react";

<Input
  label="Email"
  placeholder="john@example.com"
  icon={<Mail className="h-4 w-4" />}
  iconPosition="left"
/>
```

### With Icon (Right)

```tsx
import { Search } from "lucide-react";

<Input
  label="Search"
  placeholder="Search..."
  icon={<Search className="h-4 w-4" />}
  iconPosition="right"
/>
```

### Interactive Validation

```tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

function EmailInput() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (value: string) => {
    if (!value) {
      setError("Email is required");
      setSuccess(false);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Please enter a valid email address");
      setSuccess(false);
    } else {
      setError("");
      setSuccess(true);
    }
  };

  return (
    <Input
      label="Email Address"
      type="email"
      placeholder="john@example.com"
      icon={<Mail className="h-4 w-4" />}
      iconPosition="left"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      onBlur={(e) => validateEmail(e.target.value)}
      error={error}
      success={success}
      helperText={!error && !success ? "We'll never share your email" : undefined}
    />
  );
}
```

### Password Input with Toggle

```tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";

function PasswordInput() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="Enter password"
        icon={<Lock className="h-4 w-4" />}
        iconPosition="left"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        helperText="Minimum 8 characters"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-[38px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
```

### Disabled State

```tsx
<Input
  label="Username"
  value="johndoe"
  disabled
/>
```

### Different Input Types

```tsx
// Text
<Input label="Name" type="text" placeholder="John Doe" />

// Email
<Input label="Email" type="email" placeholder="john@example.com" />

// Password
<Input label="Password" type="password" placeholder="••••••••" />

// Number
<Input label="Age" type="number" placeholder="25" />

// Date
<Input label="Birth Date" type="date" />

// Time
<Input label="Appointment Time" type="time" />
```

## Design Specifications

### Spacing
- **Label to Input**: 8px (mb-2)
- **Input to Helper/Error**: 6px (mt-1.5)
- **Input Height**: 40px minimum (h-10, min-h-[40px])
- **Horizontal Padding**: 12px (px-3)
- **Icon Padding**: 40px (pl-10 or pr-10 when icon present)

### Typography
- **Label**: 14px (text-sm), font-medium
- **Input Text**: 16px (text-base), font-normal
- **Helper/Error Text**: 14px (text-sm)
- **Placeholder**: 50% opacity

### Colors (Dark Theme)
- **Background**: `--color-bg-input` (#27272a)
- **Border Default**: `--color-border-main` (#27272a)
- **Border Hover**: `--color-border-hover` (#3f3f46)
- **Border Focus**: `--color-border-focus` (rgba(192, 192, 208, 0.4))
- **Border Error**: `--color-error` (#ef4444)
- **Border Success**: `--color-success` (#10b981)
- **Text Primary**: `--color-text-primary` (#f4f4f5)
- **Text Secondary**: `--color-text-secondary` (#a1a1aa)
- **Text Muted**: `--color-text-muted` (#71717a)

### Transitions
- **Duration**: 150ms (--duration-fast)
- **Easing**: ease-out (--ease-out)
- **Properties**: all (border-color, background-color, etc.)

### Focus Ring
- **Width**: 2px (ring-2)
- **Color**: `--color-border-focus` with 40% opacity
- **Offset**: 2px (ring-offset-2)

### Border Radius
- **Input**: 12px (rounded-lg, --radius-lg)

## Validation Patterns

### Email Validation

```typescript
const validateEmail = (email: string): string | undefined => {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address";
  }
  return undefined;
};
```

### Password Validation

```typescript
const validatePassword = (password: string): string | undefined => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain a number";
  return undefined;
};
```

### Required Field Validation

```typescript
const validateRequired = (value: string, fieldName: string): string | undefined => {
  if (!value || value.trim() === "") {
    return `${fieldName} is required`;
  }
  return undefined;
};
```

## Accessibility Checklist

- ✅ Label properly associated with input via `htmlFor` and `id`
- ✅ Error messages have `role="alert"` for screen reader announcements
- ✅ Input has `aria-invalid="true"` when error is present
- ✅ Error/helper text associated via `aria-describedby`
- ✅ Icons hidden from screen readers with `aria-hidden="true"`
- ✅ Visible focus indicator (2-3px ring) on keyboard focus
- ✅ Minimum 40px height for comfortable touch targets
- ✅ Disabled state prevents interaction and reduces opacity
- ✅ Placeholder text provides helpful guidance
- ✅ Color contrast meets WCAG 2.1 AA standards (4.5:1 for text)

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- Uses CSS custom properties for efficient theming
- Minimal re-renders with React.forwardRef
- No heavy dependencies (only Lucide React for icons)
- Optimized transitions (150ms, GPU-accelerated)
- Auto-generated IDs prevent unnecessary re-renders

## Testing

### Manual Testing Checklist

1. **Visual States**
   - [ ] Default state displays correctly
   - [ ] Focus state shows 2-3px ring
   - [ ] Error state shows red border and message
   - [ ] Success state shows green border and checkmark
   - [ ] Disabled state shows reduced opacity

2. **Keyboard Navigation**
   - [ ] Tab key focuses input
   - [ ] Focus ring is visible
   - [ ] Can type in focused input
   - [ ] Shift+Tab moves focus backward

3. **Validation**
   - [ ] Error message displays on validation failure
   - [ ] Error clears when input becomes valid
   - [ ] Success state shows when validation passes

4. **Icons**
   - [ ] Left icon displays correctly
   - [ ] Right icon displays correctly
   - [ ] Icon color changes with state (error/success)
   - [ ] Success checkmark appears when success=true

5. **Accessibility**
   - [ ] Screen reader announces label
   - [ ] Screen reader announces error messages
   - [ ] Focus indicator is visible
   - [ ] Disabled inputs cannot be focused

## Demo Page

Visit `/input-demo` to see all Input component variations and states in action.

## Requirements Validation

This implementation validates the following requirements from the Apple Frontend Redesign spec:

### Requirement 9: Input Component Redesign
- ✅ **9.1**: Display label above input field with consistent spacing (8px)
- ✅ **9.2**: Display placeholder text with reduced opacity (40-50%)
- ✅ **9.3**: Display focus ring on keyboard focus with 2-3px width
- ✅ **9.4**: Support error state with red border and error message below
- ✅ **9.5**: Support success state with green border and optional checkmark icon
- ✅ **9.6**: Support disabled state with reduced opacity and no pointer events
- ✅ **9.7**: Support icon prefix or suffix within the input field
- ✅ **9.8**: Transition border color over 150ms when user focuses input
- ✅ **9.9**: Display error message immediately below input when user enters invalid data
- ✅ **9.10**: Maintain minimum height of 40px for comfortable interaction

### Requirement 5: Component State System
- ✅ **5.1**: Define default state styling
- ✅ **5.2**: Define hover state (subtle background color change)
- ✅ **5.3**: Define focus state with visible focus ring (2-3px, 40-50% opacity)
- ✅ **5.5**: Define disabled state with 40-50% opacity and cursor-not-allowed
- ✅ **5.7**: Define error state with red accent color and descriptive message
- ✅ **5.8**: Smooth transition on hover over 150-200ms
- ✅ **5.9**: Display focus indicator immediately without transition delay

### Requirement 17: Accessibility Compliance
- ✅ **17.1**: All interactive elements keyboard accessible with Tab navigation
- ✅ **17.2**: Visible focus indicators on all focusable elements
- ✅ **17.6**: Minimum 4.5:1 contrast ratio for normal text
- ✅ **17.8**: Screen reader announcements for form validation errors

## Future Enhancements

- [ ] Add input masking support (phone numbers, credit cards)
- [ ] Add character counter for max-length inputs
- [ ] Add autocomplete dropdown integration
- [ ] Add input group support (prefix/suffix text)
- [ ] Add size variants (sm, md, lg)
- [ ] Add floating label animation
- [ ] Add clear button for text inputs
- [ ] Add loading state with spinner

## Related Components

- **Button**: For form submission actions
- **Form**: For grouping multiple inputs
- **Label**: Standalone label component
- **Error Message**: Standalone error display
- **Helper Text**: Standalone helper text component

## Changelog

### v1.0.0 (2026-03-27)
- Initial implementation
- All core features and states
- Full accessibility support
- Comprehensive documentation
- Demo page with all variations
