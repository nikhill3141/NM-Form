import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Leaf, Menu, PackageIcon, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { exploreAndThemesNavItems, navItems } from "./data";
import { ThemeToggle } from "./theme-toggle";

export function SiteNav({ showThemeNotice = false }: { showThemeNotice?: boolean }) {
  return (
    <>
      {showThemeNotice && (
        <div className="fixed left-0 right-0 top-0 z-[60] flex h-9 items-center justify-center border-b border-emerald-300/20 bg-emerald-950/92 px-4 text-center text-xs font-medium text-emerald-50 shadow-[0_10px_34px_rgba(6,78,59,0.22)] backdrop-blur-xl sm:text-sm">
          <PackageIcon className="mr-2 size-3.5 shrink-0 text-emerald-200" />
          <span className="truncate">New themes are coming soon.</span>
        </div>
      )}
      <header
        className={
          showThemeNotice
            ? "fixed left-0 right-0 top-12 z-50 px-4"
            : "fixed left-0 right-0 top-4 z-50 px-4"
        }
      >
        <div className="nm-panel mx-auto flex p-2 h-14 max-w-7xl items-center justify-between ">
          <Link className="" href="/">
            {/* <img src={""} /> */}
            <img
              src={"/Forest From Text Logo LightMode.png"}
              alt="Forest Form"
              className=" h-20 mt-1 scale-230 w-20 ml-9 dark:hidden"
            />

            <img
              src={"/Forest_form_text_dark_mode-removebg-preview.png"}
              alt="Forest Form"
              className="hidden h-20 mt-2 scale-200 w-20 ml-8 dark:block"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                className="rounded-lg px-4 py-2 text-sm text-emerald-900/72 transition hover:bg-emerald-100/70 hover:text-emerald-950 dark:text-emerald-50/78 dark:hover:bg-white/10 dark:hover:text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild className="nm-button-glass h-9 px-4 text-base" variant="outline">
              <Link href="/signup">SignUp</Link>
            </Button>
            <Button
              asChild
              className="hidden bg-emerald-300 text-emerald-950 hover:bg-emerald-200 md:inline-flex"
            >
              <Link href="/builder">
                Start Building
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="nm-button-glass lg:hidden" size="icon" variant="outline">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="border-emerald-900/10 bg-emerald-50 text-emerald-950 dark:border-white/10 dark:bg-[#06120d] dark:text-emerald-50">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3 text-emerald-950 dark:text-white">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-300 text-emerald-950">
                      <Leaf className="size-4" />
                    </span>
                    NM Forms
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 grid gap-2">
                  {navItems.map((item) => (
                    <Link
                      className="rounded-lg border border-emerald-900/10 bg-white/70 px-4 py-3 text-sm font-medium text-emerald-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-emerald-50"
                      href={item.href}
                      key={item.href}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    className="rounded-lg bg-emerald-300 px-4 py-3 text-sm font-semibold text-emerald-950"
                    href="/builder"
                  >
                    Start Building
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}

// explore and theame navbar
export function ExploreAndThemeNav() {
  return (
    <>
      <header>
        <div className="nm-panel mx-auto flex p-2 h-14 max-w-7xl items-center justify-between ">
          <Link className="" href="/">
            {/* <img src={""} /> */}
            <img
              src={"/Forest From Text Logo LightMode.png"}
              alt="Forest Form"
              className="h-38 w-auto mt-1 dark:hidden"
            />

            <img
              src={"/Forest_form_text_dark_mode-removebg-preview.png"}
              alt="Forest Form"
              className="hidden h-35 mt-2 w-auto dark:block"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {exploreAndThemesNavItems.map((item) => (
              <Link
                className="rounded-lg px-4 py-2 text-sm text-emerald-900/72 transition hover:bg-emerald-100/70 hover:text-emerald-950 dark:text-emerald-50/78 dark:hover:bg-white/10 dark:hover:text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild className="nm-button-glass h-9 px-4 text-base" variant="outline">
              <Link href="/signup">SignUp</Link>
            </Button>
            <Button
              asChild
              className="hidden bg-emerald-300 text-emerald-950 hover:bg-emerald-200 md:inline-flex"
            >
              <Link href="/builder">
                Start Building
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="nm-button-glass lg:hidden" size="icon" variant="outline">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="border-emerald-900/10 bg-emerald-50 text-emerald-950 dark:border-white/10 dark:bg-[#06120d] dark:text-emerald-50">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3 text-emerald-950 dark:text-white">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-300 text-emerald-950">
                      <Leaf className="size-4" />
                    </span>
                    NM Forms
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 grid gap-2">
                  {navItems.map((item) => (
                    <Link
                      className="rounded-lg border border-emerald-900/10 bg-white/70 px-4 py-3 text-sm font-medium text-emerald-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-emerald-50"
                      href={item.href}
                      key={item.href}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    className="rounded-lg bg-emerald-300 px-4 py-3 text-sm font-semibold text-emerald-950"
                    href="/builder"
                  >
                    Start Building
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}



export function Footer() {
  const footerSections = [
    {
      title: "Product",
      items: [
        { label: "Builder", href: "/builder" },
        { label: "Explore", href: "/explore" },
        { label: "Themes", href: "/themes" },
        { label: "Analytics", href: "/analytics" },
      ],
    },
    {
      title: "Company",
      items: [
        { label: "Pricing", href: "/pricing" },
        { label: "About Us", href: "/about" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      items: [
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        {
          label: "Refund & Cancellation",
          href: "/refund-cancellation",
        },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-emerald-900/10 bg-emerald-50 px-6 py-16 text-emerald-950 dark:border-white/10 dark:bg-[#030806] dark:text-emerald-50">
      <div className="forest-noise absolute inset-0 opacity-35" />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <Link className="" href="/">
            {/* <img src={""} /> */}
            <img
              src={"/Forest From Text Logo LightMode.png"}
              alt="Forest Form"
              className="scale-200 h-35 mt-2 ml-20 w-auto  dark:hidden"
            />

            <img
              src={"/Forest_form_text_dark_mode-removebg-preview.png"}
              alt="Forest Form"
              className="hidden scale-200 h-35 mt-2 ml-20 w-auto dark:block"
            />
          </Link>

          <p className="max-w-md text-sm leading-6 text-emerald-900/68 dark:text-emerald-50/68">
            Immersive forms, cinematic themes, and AI-powered form creation built for modern teams
            that care about the response experience.
          </p>

          <p className="mt-5 text-xs text-emerald-900/45 dark:text-emerald-50/40">
            Build forms that feel like an experience.
          </p>
        </div>

        {/* Footer sections */}
        {footerSections.map((section) => (
          <div key={section.title}>
            <p className="mb-4 text-sm font-semibold text-emerald-950 dark:text-white">
              {section.title}
            </p>

            <div className="grid gap-3 text-sm text-emerald-900/62 dark:text-emerald-50/62">
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="w-fit transition-colors hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="relative mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-emerald-900/10 pt-6 text-xs text-emerald-900/50 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:text-emerald-50/40">
        <p>© {new Date().getFullYear()} Forest Forms. All rights reserved.</p>

        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link
            href="/terms"
            className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            Terms
          </Link>

          <Link
            href="/privacy"
            className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            Privacy
          </Link>

          <Link
            href="/refund-cancellation"
            className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            Refunds & Cancellation
          </Link>

          <Link
            href="/contact"
            className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="nm-app min-h-screen mt-8">
      <ExploreAndThemeNav />
      {children}
      <Footer />
    </main>
  );
}
