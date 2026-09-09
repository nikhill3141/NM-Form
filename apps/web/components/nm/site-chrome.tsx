import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Leaf, Menu, PackageIcon, Sparkles, ThermometerSnowflake } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { navItems } from "./data";
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
              <img src={"/Forest From Text Logo LightMode.png"} alt="Forest Form" className="h-38 w-auto mt-1 dark:hidden" />

              <img src={"/Forest_form_text_dark_mode-removebg-preview.png"} alt="Forest Form" className="hidden h-35 mt-2 w-auto dark:block" />
           
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

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-emerald-900/10 bg-emerald-50 px-6 py-16 text-emerald-950 dark:border-white/10 dark:bg-[#030806] dark:text-emerald-50">
      <div className="forest-noise absolute inset-0 opacity-35" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-lg bg-emerald-300 text-emerald-950">
              <Sparkles className="size-5" />
            </span>
            <span className="text-xl font-semibold">NM Forms</span>
          </div>
          <p className="max-w-md text-sm leading-6 text-emerald-900/68 dark:text-emerald-50/68">
            Immersive forms, cinematic themes, and analytics built for modern teams that care about the response experience.
          </p>
        </div>
        {[
          ["Product", "Builder", "Explore", "Themes", "Analytics"],
          ["Company", "Pricing", "Customers", "Security"],
          ["Social", "LinkedIn", "X", "GitHub", "Dribbble"],
        ].map(([title, ...items]) => (
          <div key={title}>
            <p className="mb-4 text-sm font-semibold text-emerald-950 dark:text-white">{title}</p>
            <div className="grid gap-3 text-sm text-emerald-900/62 dark:text-emerald-50/62">
              {items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        ))}
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
      <SiteNav />
      {children}
      <Footer />
    </main>
  );
}
