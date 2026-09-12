import Link from "next/link";
import { ArrowRight, Eye, Leaf, Star } from "lucide-react";
import { Button } from "~/components/ui/button";
import { SiteNav, Footer } from "~/components/nm/site-chrome";
import {
  AIAnalysisShowcase,
  BuilderMockup,
  DashboardPreview,
  GlassPanel,
  SectionHeading,
  ThemeStrip,
  VideoFallbackHero,
} from "~/components/nm/ui-blocks";
import { experienceFeatures, pricingPlans, trustedTeams } from "~/components/nm/data";
import FormPreviewCard from "~/components/nm/HeroThemeComponent";

const reviews = [
  {
    name: "Mira Shah",
    role: "Product Lead, Northwind",
    quote:
      "It felt less like a survey and more like a guided conversation. Our completion rate jumped almost overnight.",
  },
  {
    name: "Aarav Patel",
    role: "Growth Marketer",
    quote:
      "The theme system made our launch feedback page feel like part of the campaign, not a bolted-on form at the end.",
  },
  {
    name: "Neha Rao",
    role: "Data Analyst, Fernwell",
    quote:
      "I could finally see where people slowed down and which questions actually carried the flow.",
  },
  {
    name: "Devansh Iyer",
    role: "Founder, Loopline",
    quote:
      "We swapped three separate tools for this one. My team stopped asking me which form builder to use this week.",
  },
  {
    name: "Priya Menon",
    role: "UX Researcher",
    quote:
      "Respondents actually mentioned enjoying the questions. That never once happened with our old setup.",
  },
  {
    name: "Kabir Singh",
    role: "Ops Manager",
    quote:
      "Setup took an afternoon, not a sprint. The analytics dashboard alone justified moving over.",
  },
  {
    name: "Sara Fernandes",
    role: "CX Lead, Hallow & Co.",
    quote:
      "The branching logic is the first version of this I haven't had to fight with a spreadsheet to plan out.",
  },
  {
    name: "Rohan Desai",
    role: "Indie Hacker",
    quote:
      "The cheapest plan gave me more than tools twice the price. Support also actually replies.",
  },
];

function TestimonialsMarquee() {
  const loop = [...reviews, ...reviews];

  return (
    <section className="relative overflow-hidden py-20">
      <div className="nm-hero-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40" />
      <div className="mx-auto mb-10 max-w-7xl px-6">
        <SectionHeading
          description="A few words from teams who trust us and enjoy the results after using premium themes "
          eyebrow="Feedbacks"
          title="What people say about us"
        />
      </div>

      <div
        className="nm-marquee-strip relative w-full"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <div className="nm-marquee-track flex w-max gap-5 px-6">
          {loop.map((t, i) => (
            <GlassPanel
              className="group w-[280px] shrink-0 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 sm:w-[320px]"
              key={`${t.name}-${i}`}
            >
              <div className="mb-4 flex items-center gap-3">
                <img
                  alt=""
                  className="size-10 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900"
                  height={40}
                  src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(t.name)}`}
                  width={40}
                />
                <div>
                  <p className="text-sm font-semibold text-emerald-950 dark:text-white">{t.name}</p>
                  <p className="text-xs text-emerald-700/70 dark:text-emerald-100/60">{t.role}</p>
                </div>
              </div>

              <div className="mb-3 flex gap-0.5 text-emerald-400">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star className="size-3.5 fill-current" key={s} />
                ))}
              </div>

              <p className="text-sm leading-6 text-emerald-950/80 dark:text-emerald-50/75">
                {t.quote}
              </p>
            </GlassPanel>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes nm-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .nm-marquee-track {
          animation: nm-marquee 42s linear infinite;
          will-change: transform;
        }
        .nm-marquee-strip:hover .nm-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .nm-marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

export default function Home() {
  return (
    <main className="nm-app min-h-screen overflow-hidden scroll-none">
      <SiteNav showThemeNotice />

      {/* hero */}
      <section className="relative min-h-screen overflow-hidden px-6 pb-20 pt-44 md:pt-48">
        <VideoFallbackHero />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_0.30fr]">
          <div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] text-black dark:text-white md:text-7xl">
              Bulid, Analyze... <br /> Custom Forms With Engaging Themes
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black dark:text-emerald-50/74">
              Create immersive, beautiful, shareable forms with cinematic engaging themes and modern
              interactions. And also smooth response analysis
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="magnetic-button h-12 bg-emerald-300 px-6 text-base text-emerald-950 hover:bg-emerald-200"
              >
                <Link href="/builder">
                  Start Building
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild className="nm-button-glass h-12 px-6 text-base" variant="outline">
                <Link href="/themes">
                  Explore Themes
                  <Eye className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
          <FormPreviewCard />
        </div>
      </section>

      {/* testimonials */}
      <TestimonialsMarquee />

      {/* theame strip*/}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            description="Switch the whole emotional register of a form while keeping labels, inputs, and focus states readable."
            eyebrow="Themes"
            title="Explore Moden Themes"
          />
          <ThemeStrip />
        </div>
      </section>

      {/* builder review pannel */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl items-center  lg:grid-cols-[0.95fr_1.05fr]">
          <SectionHeading
            description="The same builder your team uses: add question blocks, drag fields into the right order, set expiry and visibility, then publish without leaving the canvas."
            eyebrow="Builder"
            title="Build, reorder, and publish from one focused canvas."
          />
          <BuilderMockup />
        </div>
      </section>

      {/* analytics */}
      <AIAnalysisShowcase />

      {/* pricing */}
      <section className="px-6 py-24" id="pricing">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            centered
            description="With the paid plans you can make your data flows and analysis grow like tree"
            eyebrow="Pricing"
            title="Take Data With Good Vibes and Premium Themes"
          />
          <section className="py-24">
            <div className="mx-auto max-w-5xl px-6">
              <div className="grid gap-6 lg:grid-cols-3 lg:items-center">
                {pricingPlans.map((plan) => (
                  <GlassPanel
                    className={
                      plan.highlighted
                        ? "relative z-10 border-emerald-300/50 p-8 shadow-2xl shadow-emerald-500/20 lg:-translate-y-3 lg:scale-105"
                        : "p-8"
                    }
                    key={plan.name}
                  >
                    {plan.highlighted && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-300 px-3 py-1 text-xs font-medium text-emerald-950">
                        Most popular
                      </span>
                    )}

                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-emerald-50">{plan.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-emerald-50/60">
                        {plan.description}
                      </p>
                    </div>

                    <p className="mb-6 flex items-baseline gap-1">
                      <span className="text-4xl font-semibold text-emerald-50">{plan.price}</span>
                      {plan.price.startsWith("$") && (
                        <span className="text-sm text-emerald-50/50">/mo</span>
                      )}
                    </p>

                    <Button
                      className={
                        plan.highlighted
                          ? "mb-7 w-full bg-emerald-300 text-emerald-950 hover:bg-emerald-200"
                          : "mb-7 w-full border border-emerald-50/15 bg-transparent text-emerald-50 hover:bg-emerald-50/5"
                      }
                    >
                      Start with {plan.name}
                    </Button>

                    <div className="space-y-3 border-t border-emerald-50/10 pt-6">
                      {plan.features.map((feature) => (
                        <div
                          className="flex items-start gap-3 text-sm text-emerald-50/70"
                          key={feature}
                        >
                          <Leaf className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </GlassPanel>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
