"use client";

import { useState } from "react";
import {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonGrid,
} from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SkeletonDemoPage() {
  const [showContent, setShowContent] = useState(false);
  const [animation, setAnimation] = useState<"pulse" | "wave" | "none">("pulse");

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">
            Skeleton Loading Component
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Production-ready skeleton placeholders with smooth animations for
            portfolio visual impact.
          </p>
        </div>

        {/* Controls */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Controls
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button
              variant={showContent ? "outline" : "primary"}
              onClick={() => setShowContent(!showContent)}
            >
              {showContent ? "Show Skeletons" : "Show Content"}
            </Button>
            <div className="flex gap-2">
              <Button
                variant={animation === "pulse" ? "primary" : "outline"}
                size="sm"
                onClick={() => setAnimation("pulse")}
              >
                Pulse
              </Button>
              <Button
                variant={animation === "wave" ? "primary" : "outline"}
                size="sm"
                onClick={() => setAnimation("wave")}
              >
                Wave
              </Button>
              <Button
                variant={animation === "none" ? "primary" : "outline"}
                size="sm"
                onClick={() => setAnimation("none")}
              >
                None
              </Button>
            </div>
          </div>
        </Card>

        {/* Basic Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Basic Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                Text Variant
              </h3>
              <Skeleton variant="text" width="100%" animation={animation} />
              <Skeleton variant="text" width="80%" animation={animation} />
              <Skeleton variant="text" width="60%" animation={animation} />
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                Circular Variant
              </h3>
              <div className="flex gap-4">
                <Skeleton variant="circular" width={40} height={40} animation={animation} />
                <Skeleton variant="circular" width={60} height={60} animation={animation} />
                <Skeleton variant="circular" width={80} height={80} animation={animation} />
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                Rectangular Variant
              </h3>
              <Skeleton variant="rectangular" height={100} animation={animation} />
              <Skeleton variant="rectangular" height={60} animation={animation} />
            </Card>
          </div>
        </section>

        {/* Pattern Components */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Pattern Components
          </h2>

          {/* SkeletonText */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-[var(--color-text-primary)]">
              SkeletonText
            </h3>
            <Card className="p-6">
              {!showContent ? (
                <SkeletonText lines={4} />
              ) : (
                <div className="space-y-2">
                  <p className="text-[var(--color-text-primary)]">
                    This is a paragraph of text that would normally be loaded from
                    an API.
                  </p>
                  <p className="text-[var(--color-text-primary)]">
                    The skeleton placeholder matches the structure and dimensions.
                  </p>
                  <p className="text-[var(--color-text-primary)]">
                    Notice how the widths vary for a more realistic appearance.
                  </p>
                  <p className="text-[var(--color-text-primary)]">
                    This creates a better user experience during loading states.
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* SkeletonAvatar */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-[var(--color-text-primary)]">
              SkeletonAvatar
            </h3>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                {!showContent ? (
                  <>
                    <SkeletonAvatar size="sm" />
                    <SkeletonAvatar size="md" />
                    <SkeletonAvatar size="lg" />
                    <SkeletonAvatar size="xl" />
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-xs font-semibold">
                      SM
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-sm font-semibold">
                      MD
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-base font-semibold">
                      LG
                    </div>
                    <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-lg font-semibold">
                      XL
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* SkeletonCard */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-[var(--color-text-primary)]">
              SkeletonCard
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {!showContent ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                <>
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-sm font-semibold">
                          {i}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-[var(--color-text-primary)]">
                            Card Title {i}
                          </h4>
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            Subtitle
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[var(--color-text-primary)]">
                          This is the main content area of the card.
                        </p>
                        <p className="text-[var(--color-text-secondary)]">
                          It contains multiple lines of text.
                        </p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm">Action 1</Button>
                        <Button size="sm" variant="outline">
                          Action 2
                        </Button>
                      </div>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* SkeletonGrid */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-[var(--color-text-primary)]">
              SkeletonGrid
            </h3>
            {!showContent ? (
              <SkeletonGrid columns={3} rows={2} gap={24} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-sm font-semibold">
                        {i}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[var(--color-text-primary)]">
                          Grid Item {i}
                        </h4>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          Description
                        </p>
                      </div>
                    </div>
                    <p className="text-[var(--color-text-primary)]">
                      Content for grid item {i}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm">View</Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Custom Dimensions */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Custom Dimensions
          </h2>
          <Card className="p-6 space-y-4">
            <Skeleton width="100%" height={200} animation={animation} />
            <Skeleton width="75%" height={100} animation={animation} />
            <Skeleton width="50%" height={60} animation={animation} />
            <Skeleton width="25%" height={40} animation={animation} />
          </Card>
        </section>

        {/* Real-World Example */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Real-World Example: User Profile
          </h2>
          <Card className="p-6">
            {!showContent ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <SkeletonAvatar size="xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="60%" />
                  </div>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton variant="text" width="100%" />
                      <Skeleton variant="text" width="60%" />
                    </div>
                  ))}
                </div>
                {/* Bio */}
                <SkeletonText lines={3} />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-2xl font-bold">
                    DM
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                      Dhruv Mann
                    </h3>
                    <p className="text-[var(--color-text-secondary)]">
                      Full Stack Developer
                    </p>
                  </div>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                      1,234
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Followers
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                      567
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Following
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                      89
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Projects
                    </p>
                  </div>
                </div>
                {/* Bio */}
                <div className="space-y-2">
                  <p className="text-[var(--color-text-primary)]">
                    Passionate about building beautiful, accessible web
                    applications.
                  </p>
                  <p className="text-[var(--color-text-primary)]">
                    Specializing in React, Next.js, and TypeScript.
                  </p>
                  <p className="text-[var(--color-text-primary)]">
                    Always learning and exploring new technologies.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}
