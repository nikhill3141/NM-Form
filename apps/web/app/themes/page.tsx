"use client";

import type { ComponentType } from "react";
import { PageShell } from "~/components/nm/site-chrome";
import { SectionHeading } from "~/components/nm/ui-blocks";
import { themeCards } from "~/components/nm/data";
import { Button } from "~/components/ui/button";

function isLightBackground(hex: string) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.6;
}

// All verified "Free to use under the Unsplash License" — no Unsplash+ paywalled photos.
const photoThemes: Record<string, string> = {
  "Forest Cinematic":
    "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?auto=format&fit=crop&w=1600&q=70",
  "Ocean Flow":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=70",
  "Cosmic Dark":
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1600&q=70",
  "Minimal Luxury":
    "https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?auto=format&fit=crop&w=1600&q=70",
  "Cyber Neon":
    "https://images.unsplash.com/photo-1560052775-e4f689f06f07?auto=format&fit=crop&w=1600&q=70",
  "Sakura Dawn":
    "https://images.unsplash.com/photo-1519882189396-71f93cb4714b?auto=format&fit=crop&w=1600&q=70",
  "Shonen Rush":
    "https://images.unsplash.com/photo-1707554472086-6219affba85a?auto=format&fit=crop&w=1600&q=70",
  "Ink Wash":
    "https://images.unsplash.com/photo-1622593192705-4699764fc000?auto=format&fit=crop&w=1600&q=70",
  "Retro Arcade":
    "https://images.unsplash.com/photo-1636070759654-5c93bbca2862?auto=format&fit=crop&w=1600&q=70",
};

const displayOrder = [
  "Forest Cinematic",
  "Cosmic Dark",
  "Ocean Flow",
  "Sakura Dawn",
  "Minimal Luxury",
  "Cyber Neon",
  "Shonen Rush",
  "Ink Wash",
  "Retro Arcade",
];

const spanClasses: Record<string, string> = {
  "Forest Cinematic": "xl:col-span-2 xl:row-span-2",
  "Cosmic Dark": "xl:row-span-2",
  "Shonen Rush": "xl:col-span-2",
  "Ink Wash": "xl:col-span-2",
  "Retro Arcade": "xl:col-span-2",
};

const newThemes = new Set(["Sakura Dawn", "Shonen Rush", "Ink Wash", "Retro Arcade"]);

function ThemeBentoCard({ theme }: { theme: (typeof themeCards)[number] }) {
  const Icon = theme.icon as ComponentType<{ className?: string }>;
  const isLightCard = isLightBackground(theme.background);
  const span = spanClasses[theme.name] ?? "";
  const isNew = newThemes.has(theme.name);
  const photo = photoThemes[theme.name];

  return (
    <div
      className={`theme-card group relative flex min-h-[240px] flex-col overflow-hidden rounded-2xl border border-white/12 shadow-2xl shadow-black/25 ${span}`}
      style={{ "--card-accent": theme.accent } as React.CSSProperties}
    >
      {/* faded background photo */}
      {photo && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.34] transition-opacity duration-500 group-hover:opacity-[0.44]"
          style={{ backgroundImage: `url(${photo})` }}
        />
      )}

      {/* theme color tint, sits above the photo so text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, ${theme.surface}, ${theme.background})`,
          opacity: photo ? 0.82 : 1,
        }}
      />

      <div className="nm-theme-ring pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex h-full flex-col p-6">
        <div className="mb-6 flex items-start justify-between">
          <div
            className="flex size-11 items-center justify-center rounded-lg border border-white/12"
            style={{
              color: theme.accent,
              boxShadow: `0 0 30px color-mix(in srgb, ${theme.accent} 22%, transparent)`,
            }}
          >
            <Icon className="size-5" />
          </div>
          {isNew && (
            <span className="rounded-full border border-white/15 bg-black/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white/85 backdrop-blur">
              New
            </span>
          )}
        </div>

        <h3 className={`text-xl font-semibold ${isLightCard ? "text-zinc-950" : "text-white"}`}>
          {theme.name}
        </h3>
        <p
          className={`mt-2 max-w-sm text-sm leading-6 ${isLightCard ? "text-zinc-700" : "text-white/70"}`}
        >
          {theme.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {theme.chips.map((chip) => (
            <span
              className={`rounded-full border px-3 py-1 text-xs ${
                isLightCard
                  ? "border-zinc-200 bg-white/70 text-zinc-700"
                  : "border-white/12 bg-white/10 text-white/72"
              }`}
              key={chip}
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <Button
            className={`translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 ${
              isLightCard
                ? "border border-zinc-300 bg-white/80 text-zinc-900 hover:bg-white"
                : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
            }`}
            size="sm"
            variant="outline"
          >
            Use this theme
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ThemesPage() {
  const orderedThemes = displayOrder
    .map((name) => themeCards.find((t) => t.name === name))
    .filter((t): t is (typeof themeCards)[number] => Boolean(t));

  return (
    <PageShell>
      <section className="relative overflow-hidden px-6 py-20">
        {/* <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-24 size-[420px] rounded-full opacity-40 blur-[110px] dark:opacity-30"
          style={{ background: "radial-gradient(circle, #4ADE80, transparent 70%)" }}
        /> */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-24 size-[380px] rounded-full opacity-30 blur-[110px] dark:opacity-25"
          style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/3 size-[320px] -translate-x-1/2 rounded-full opacity-20 blur-[100px] dark:opacity-15"
          style={{ background: "radial-gradient(circle, #38BDF8, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-7xl ">

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:xl:auto-rows-[minmax(240px,auto)]">
            {orderedThemes.map((theme) => (
              <ThemeBentoCard key={theme.name} theme={theme} />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
