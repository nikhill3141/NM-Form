"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowLeft, ArrowRight, Check, Leaf, Mail, Moon, Sun } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

type LegalPageLayoutProps = {
  title: string;
  description: string;
  lastUpdated?: string;
  children: ReactNode;
};

const legalLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  {
    label: "Refund & Cancellation",
    href: "/refund-cancellation",
  },
];

export function LegalPageLayout({
  title,
  description,
  lastUpdated = "September 22, 2026",
  children,
}: LegalPageLayoutProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <main className="min-h-screen bg-[#f5f7f4] text-[#182019] transition-colors duration-300 dark:bg-[#0b100d] dark:text-[#edf4ef]">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-15%] h-[420px] w-[420px] rounded-full bg-emerald-300/10 blur-[120px] dark:bg-emerald-500/10" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[420px] w-[420px] rounded-full bg-lime-300/10 blur-[120px] dark:bg-lime-500/5" />
      </div>

      <div className="relative mx-auto min-h-screen w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {/* Header */}
        <header className="sticky top-4 z-50 mb-10">
          <div className="flex items-center justify-between rounded-2xl border border-black/[0.07] bg-white/75 px-4  shadow-[0_10px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#111713]/75 dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
            <Link className="" href="/">
              {/* <img src={""} /> */}
              <img
                src={"/Forest From Text Logo LightMode.png"}
                alt="Forest Form"
                className="h-15 ml-8 scale-280 mt-2 w-auto dark:hidden"
              />

              <img
                src={"/Forest_form_text_dark_mode-removebg-preview.png"}
                alt="Forest Form"
                className="hidden h-15 ml-6 scale-250 mt-2  w-auto dark:block"
              />
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="hidden rounded-xl px-3 py-2 text-sm text-black/55 transition hover:bg-black/[0.04] hover:text-black sm:block dark:text-white/55 dark:hover:bg-white/[0.05] dark:hover:text-white"
              >
                Home
              </Link>

              {mounted && (
                <button
                  type="button"
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.07] bg-black/[0.025] transition hover:bg-black/[0.06] dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:bg-white/[0.07]"
                >
                  {isDark ? (
                    <Sun className="h-4 w-4 text-amber-300" />
                  ) : (
                    <Moon className="h-4 w-4 text-black/65" />
                  )}
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto mb-12 max-w-4xl">
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 text-sm text-black/50 transition hover:text-black dark:text-white/45 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forest Forms
          </Link>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/[0.06] px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Forest Forms
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-black/55 sm:text-lg dark:text-white/50">
            {description}
          </p>

          <p className="mt-4 text-xs text-black/40 dark:text-white/35">
            Last updated: {lastUpdated}
          </p>
        </section>

        {/* Content */}
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[190px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <nav className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
              {legalLinks.map((link) => {
                const active = link.href === getCurrentPath();

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition ${
                      active
                        ? "bg-black/[0.06] text-black dark:bg-white/[0.07] dark:text-white"
                        : "text-black/45 hover:bg-black/[0.035] hover:text-black/75 dark:text-white/45 dark:hover:bg-white/[0.04] dark:hover:text-white/75"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main document */}
          <article className="min-w-0">
            <div className="rounded-3xl border border-black/[0.07] bg-white/80 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.04)] backdrop-blur-xl sm:p-8 lg:p-10 dark:border-white/[0.08] dark:bg-[#101611]/80 dark:shadow-[0_20px_70px_rgba(0,0,0,0.18)]">
              <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:tracking-[-0.02em] prose-headings:font-semibold prose-p:leading-7 prose-p:text-black/60 dark:prose-p:text-white/55 prose-li:text-black/60 dark:prose-li:text-white/55 prose-strong:text-black dark:prose-strong:text-white">
                {children}
              </div>
            </div>

            {/* Bottom navigation */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                href="/contact"
                className="group flex items-center justify-between rounded-2xl border border-black/[0.07] bg-white/65 p-4 transition hover:bg-white dark:border-white/[0.08] dark:bg-white/[0.025] dark:hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-xs text-black/40 dark:text-white/35">Need help?</p>
                    <p className="mt-0.5 text-sm font-medium">Contact Forest Forms</p>
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-black/30 transition group-hover:translate-x-0.5 dark:text-white/30" />
              </Link>

              <Link
                href="/"
                className="group flex items-center justify-between rounded-2xl border border-black/[0.07] bg-white/65 p-4 transition hover:bg-white dark:border-white/[0.08] dark:bg-white/[0.025] dark:hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-xs text-black/40 dark:text-white/35">Forest Forms</p>
                    <p className="mt-0.5 text-sm font-medium">Back to homepage</p>
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-black/30 transition group-hover:translate-x-0.5 dark:text-white/30" />
              </Link>
            </div>
          </article>
        </div>

        {/* Footer */}
        <footer className="mx-auto mt-14 max-w-5xl border-t border-black/[0.07] py-7 dark:border-white/[0.08]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Forest Forms</p>
              <p className="mt-1 text-xs text-black/40 dark:text-white/35">
                Build forms that feel like an experience.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-black/45 dark:text-white/40">
              <Link href="/about" className="hover:text-black dark:hover:text-white">
                About
              </Link>
              <Link href="/contact" className="hover:text-black dark:hover:text-white">
                Contact
              </Link>
              <Link href="/terms" className="hover:text-black dark:hover:text-white">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-black dark:hover:text-white">
                Privacy
              </Link>
              <Link href="/refund-cancellation" className="hover:text-black dark:hover:text-white">
                Refunds
              </Link>
            </div>
          </div>

          <p className="mt-6 text-[11px] text-black/30 dark:text-white/25">
            © {new Date().getFullYear()} Forest Forms. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}

function getCurrentPath() {
  if (typeof window === "undefined") return "";
  return window.location.pathname;
}
