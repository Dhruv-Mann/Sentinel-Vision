"use client";

import { Card } from "@/components/ui/card";
import { Heart, Star, TrendingUp } from "lucide-react";

export default function CardDemoPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">
            Card Component Demo
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Showcase of Card component variants, states, and configurations
          </p>
        </div>

        {/* Variants Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                Default Card
              </h3>
              <p className="text-[var(--color-text-secondary)]">
                Solid background with subtle shadow. Perfect for standard content containers.
              </p>
            </Card>

            <Card variant="glass">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                Glass Card
              </h3>
              <p className="text-[var(--color-text-secondary)]">
                Semi-transparent with backdrop blur. Creates a modern glassmorphism effect.
              </p>
            </Card>

            <Card variant="elevated">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                Elevated Card
              </h3>
              <p className="text-[var(--color-text-secondary)]">
                Higher shadow elevation for prominent content that needs emphasis.
              </p>
            </Card>
          </div>
        </section>

        {/* Clickable Cards Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Clickable Cards
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            Hover over these cards to see the elevation and border color transitions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default" clickable onClick={() => alert("Default card clicked!")}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[var(--color-success-bg)]">
                  <Heart className="w-5 h-5 text-[var(--color-success)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  Favorites
                </h3>
              </div>
              <p className="text-[var(--color-text-secondary)]">
                Click to view your favorite items
              </p>
            </Card>

            <Card variant="glass" clickable onClick={() => alert("Glass card clicked!")}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[var(--color-warning-bg)]">
                  <Star className="w-5 h-5 text-[var(--color-warning)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  Featured
                </h3>
              </div>
              <p className="text-[var(--color-text-secondary)]">
                Click to explore featured content
              </p>
            </Card>

            <Card variant="elevated" clickable onClick={() => alert("Elevated card clicked!")}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[var(--color-info-bg)]">
                  <TrendingUp className="w-5 h-5 text-[var(--color-info)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  Trending
                </h3>
              </div>
              <p className="text-[var(--color-text-secondary)]">
                Click to see trending topics
              </p>
            </Card>
          </div>
        </section>

        {/* Padding Sizes Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Padding Sizes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="sm">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                Small Padding
              </h3>
              <p className="text-[var(--color-text-secondary)]">
                16px padding for compact layouts
              </p>
            </Card>

            <Card padding="md">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                Medium Padding
              </h3>
              <p className="text-[var(--color-text-secondary)]">
                20px padding (default) for balanced spacing
              </p>
            </Card>

            <Card padding="lg">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                Large Padding
              </h3>
              <p className="text-[var(--color-text-secondary)]">
                24px padding for generous breathing room
              </p>
            </Card>
          </div>
        </section>

        {/* Complex Content Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Complex Content Example
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="default" clickable>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                      Resume Analytics
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Last updated 2 hours ago
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)] text-xs font-semibold">
                    Active
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                      1,234
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Total Views
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                      45s
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Avg Duration
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--color-border-main)]">
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Click to view detailed analytics
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="glass" padding="lg">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[var(--color-accent)]/10">
                    <Star className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                      Premium Feature
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Unlock advanced insights
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                    Real-time analytics
                  </li>
                  <li className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                    Geographic distribution
                  </li>
                  <li className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                    Device breakdown
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </section>

        {/* Combined Variants Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Combined Configurations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="elevated" clickable padding="lg">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                Elevated + Clickable + Large Padding
              </h3>
              <p className="text-[var(--color-text-secondary)]">
                Combines elevated shadow, clickable hover effects, and generous padding
              </p>
            </Card>

            <Card variant="glass" clickable padding="sm">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                Glass + Clickable + Small Padding
              </h3>
              <p className="text-[var(--color-text-secondary)]">
                Glassmorphism effect with compact spacing
              </p>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
