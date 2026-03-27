"use client";

import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle, Info, Clock, Star, Zap } from "lucide-react";

export default function BadgeDemoPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">
            Badge Component
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Visual indicators for status and categories with semantic variants
          </p>
        </div>

        {/* Variants Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Variants
          </h2>
          <div className="flex flex-wrap gap-4">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </section>

        {/* Sizes Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Sizes
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </div>
        </section>

        {/* With Icons Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            With Icons
          </h2>
          <div className="flex flex-wrap gap-4">
            <Badge variant="success" icon={<Check />}>
              Active
            </Badge>
            <Badge variant="error" icon={<X />}>
              Expired
            </Badge>
            <Badge variant="warning" icon={<AlertTriangle />}>
              Pending
            </Badge>
            <Badge variant="info" icon={<Info />}>
              Information
            </Badge>
            <Badge variant="default" icon={<Clock />}>
              Scheduled
            </Badge>
          </div>
        </section>

        {/* Icon Only Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Icon Only
          </h2>
          <div className="flex flex-wrap gap-4">
            <Badge variant="success" icon={<Check />} aria-label="Success" />
            <Badge variant="error" icon={<X />} aria-label="Error" />
            <Badge variant="warning" icon={<AlertTriangle />} aria-label="Warning" />
            <Badge variant="info" icon={<Info />} aria-label="Info" />
            <Badge variant="default" icon={<Star />} aria-label="Favorite" />
          </div>
        </section>

        {/* Size Variations with Icons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Size Variations with Icons
          </h2>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-[var(--color-text-secondary)] w-20">Small:</span>
              <Badge variant="success" size="sm" icon={<Check />}>
                Active
              </Badge>
              <Badge variant="warning" size="sm" icon={<Clock />}>
                Pending
              </Badge>
              <Badge variant="error" size="sm" icon={<X />}>
                Failed
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-[var(--color-text-secondary)] w-20">Medium:</span>
              <Badge variant="success" size="md" icon={<Check />}>
                Active
              </Badge>
              <Badge variant="warning" size="md" icon={<Clock />}>
                Pending
              </Badge>
              <Badge variant="error" size="md" icon={<X />}>
                Failed
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-[var(--color-text-secondary)] w-20">Large:</span>
              <Badge variant="success" size="lg" icon={<Check />}>
                Active
              </Badge>
              <Badge variant="warning" size="lg" icon={<Clock />}>
                Pending
              </Badge>
              <Badge variant="error" size="lg" icon={<X />}>
                Failed
              </Badge>
            </div>
          </div>
        </section>

        {/* Real-World Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Real-World Examples
          </h2>
          <div className="space-y-6">
            {/* Resume Status */}
            <div className="bg-[var(--color-bg-card-solid)] border border-[var(--color-border-main)] rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                Resume Status
              </h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="success" icon={<Check />}>
                  Active
                </Badge>
                <Badge variant="error" icon={<X />}>
                  Expired
                </Badge>
                <Badge variant="warning" icon={<Clock />}>
                  Expiring Soon
                </Badge>
                <Badge variant="info" icon={<Zap />}>
                  Premium
                </Badge>
              </div>
            </div>

            {/* Analytics Tags */}
            <div className="bg-[var(--color-bg-card-solid)] border border-[var(--color-border-main)] rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                Analytics Tags
              </h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default" size="sm">
                  Desktop
                </Badge>
                <Badge variant="default" size="sm">
                  Mobile
                </Badge>
                <Badge variant="default" size="sm">
                  Tablet
                </Badge>
                <Badge variant="info" size="sm">
                  New York
                </Badge>
                <Badge variant="info" size="sm">
                  San Francisco
                </Badge>
              </div>
            </div>

            {/* Notification Counts */}
            <div className="bg-[var(--color-bg-card-solid)] border border-[var(--color-border-main)] rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                Notification Counts
              </h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-text-primary)]">Messages</span>
                  <Badge variant="error" size="sm">
                    3
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-text-primary)]">Views</span>
                  <Badge variant="success" size="sm">
                    24
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-text-primary)]">Pending</span>
                  <Badge variant="warning" size="sm">
                    5
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Features */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Typography Features
          </h2>
          <div className="bg-[var(--color-bg-card-solid)] border border-[var(--color-border-main)] rounded-xl p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Uppercase with increased letter spacing:
              </p>
              <Badge variant="success">Active Status</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Pill shape (fully rounded corners):
              </p>
              <Badge variant="info">Rounded Badge</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Semibold font weight:
              </p>
              <Badge variant="warning">Bold Text</Badge>
            </div>
          </div>
        </section>

        {/* Accessibility */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Accessibility
          </h2>
          <div className="bg-[var(--color-bg-card-solid)] border border-[var(--color-border-main)] rounded-xl p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Icon-only badges with aria-label:
              </p>
              <div className="flex gap-3">
                <Badge variant="success" icon={<Check />} aria-label="Success status" />
                <Badge variant="error" icon={<X />} aria-label="Error status" />
                <Badge variant="warning" icon={<AlertTriangle />} aria-label="Warning status" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Semantic colors for status indication:
              </p>
              <div className="flex gap-3">
                <Badge variant="success">Green for active/completed</Badge>
                <Badge variant="error">Red for failed/expired</Badge>
                <Badge variant="warning">Orange for pending/attention</Badge>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
