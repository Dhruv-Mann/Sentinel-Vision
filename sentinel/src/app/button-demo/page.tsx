"use client";

import { Button } from "@/components/ui/button";
import { Heart, Download, Trash2, Settings, Plus } from "lucide-react";
import { useState } from "react";

/**
 * Button Component Demo Page
 * 
 * This page demonstrates all Button component variants, sizes, and states
 * as specified in Requirements 8.1-8.9 and 5.1-5.9
 */
export default function ButtonDemoPage() {
  const [loading, setLoading] = useState(false);

  const handleLoadingClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-2">
            Button Component Demo
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Demonstrating all variants, sizes, and states
          </p>
        </div>

        {/* Variants Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Variants (Requirement 8.1)
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Destructive Button</Button>
          </div>
        </section>

        {/* Sizes Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Sizes (Requirement 8.2, 8.9)
          </h2>
          <div className="flex flex-wrap items-end gap-4">
            <Button size="sm">Small (36px min)</Button>
            <Button size="md">Medium (40px min)</Button>
            <Button size="lg">Large (44px min - Touch Target)</Button>
            <Button size="xl">Extra Large (48px min)</Button>
          </div>
        </section>

        {/* States Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            States (Requirements 5.1-5.9, 8.3, 8.5, 8.6)
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-3">
                Default, Hover, Focus, Active
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button>Default State</Button>
                <Button>Hover Over Me</Button>
                <Button>Tab to Focus Me</Button>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">
                Hover: Background opacity +10%, transition 150ms<br />
                Focus: 2-3px focus ring with primary color at 40% opacity<br />
                Active: Scale 0.97, brightness 95%
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-3">
                Disabled State (Requirement 8.6)
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button disabled variant="primary">
                  Disabled Primary
                </Button>
                <Button disabled variant="secondary">
                  Disabled Secondary
                </Button>
                <Button disabled variant="outline">
                  Disabled Outline
                </Button>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">
                Opacity 50%, cursor not-allowed
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-3">
                Loading State (Requirement 8.5)
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button loading={loading} onClick={handleLoadingClick}>
                  {loading ? "Loading..." : "Click to Load"}
                </Button>
                <Button loading variant="secondary">
                  Loading Secondary
                </Button>
                <Button loading variant="outline">
                  Loading Outline
                </Button>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">
                Spinner replaces content, button disabled, aria-busy attribute
              </p>
            </div>
          </div>
        </section>

        {/* Icons Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Icons (Requirement 8.4)
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-3">
                Icon Position
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button icon={<Heart />} iconPosition="left">
                  Like
                </Button>
                <Button icon={<Download />} iconPosition="right" variant="secondary">
                  Download
                </Button>
                <Button icon={<Plus />} iconPosition="left" variant="outline">
                  Add Item
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-3">
                Icon-Only Buttons (Square Aspect Ratio)
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button icon={<Heart />} aria-label="Like" size="sm" />
                <Button icon={<Download />} aria-label="Download" size="md" variant="secondary" />
                <Button icon={<Settings />} aria-label="Settings" size="lg" variant="outline" />
                <Button icon={<Trash2 />} aria-label="Delete" size="xl" variant="destructive" />
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">
                Icon-only buttons have square aspect ratio and require aria-label
              </p>
            </div>
          </div>
        </section>

        {/* Full Width Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Full Width
          </h2>
          <div className="space-y-3">
            <Button fullWidth variant="primary">
              Full Width Primary Button
            </Button>
            <Button fullWidth variant="secondary">
              Full Width Secondary Button
            </Button>
          </div>
        </section>

        {/* Accessibility Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Accessibility Features (Requirement 17.1-17.3)
          </h2>
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border-main)] rounded-lg p-6 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <div>
                <p className="text-[var(--color-text-primary)] font-medium">
                  Keyboard Navigation
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  All buttons are keyboard accessible with Tab navigation
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <div>
                <p className="text-[var(--color-text-primary)] font-medium">
                  Focus Indicators
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  2-3px focus ring with primary color at 40-50% opacity
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <div>
                <p className="text-[var(--color-text-primary)] font-medium">
                  ARIA Labels
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Icon-only buttons include aria-label for screen readers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <div>
                <p className="text-[var(--color-text-primary)] font-medium">
                  Loading State Announcement
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Screen readers announce loading state via aria-busy
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <div>
                <p className="text-[var(--color-text-primary)] font-medium">
                  Touch Target Size
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Minimum 44x44px touch target on mobile (lg and xl sizes)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Design Tokens Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Design Tokens Used
          </h2>
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border-main)] rounded-lg p-6 space-y-2 font-mono text-sm">
            <p className="text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-text-primary)]">Colors:</span> --color-accent, --color-accent-hover, --color-bg-input, --color-bg-hover, --color-border-main, --color-border-hover, --color-border-focus, --color-error
            </p>
            <p className="text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-text-primary)]">Typography:</span> --text-sm, --text-base, --text-lg, --text-xl
            </p>
            <p className="text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-text-primary)]">Animation:</span> --duration-fast (150ms), --ease-out
            </p>
            <p className="text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-text-primary)]">Border Radius:</span> --radius-lg (12px)
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
