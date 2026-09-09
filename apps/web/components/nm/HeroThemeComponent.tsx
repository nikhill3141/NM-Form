"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Circle } from "lucide-react";

type Question2 = {
  label: string;
  options: [string, string, string];
  pick: number;
};

type Question3 = {
  label: string;
  pick: number;
};

type Theme = {
  id: string;
  name: string;
  dot: string;
  pip: string;
  underline: string;
  caret: string;
  radio: string;
  rating: string;
  button: string;
  glow: string;
  q1: { label: string; answer: string };
  q2: Question2;
  q3: Question3;
};

const THEMES: [Theme, Theme, Theme, Theme] = [
  {
    id: "canopy",
    name: "Canopy",
    dot: "bg-emerald-500 dark:bg-emerald-400",
    pip: "fill-emerald-500 text-emerald-500 dark:fill-emerald-400 dark:text-emerald-400",
    underline: "border-emerald-600 dark:border-emerald-400",
    caret: "bg-emerald-600 dark:bg-emerald-400",
    radio: "border-emerald-600 bg-emerald-600 dark:border-emerald-400 dark:bg-emerald-400",
    rating:
      "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-emerald-950",
    button:
      "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-400 dark:hover:bg-emerald-300 dark:text-emerald-950",
    glow: "shadow-[0_0_60px_-30px_rgba(16,185,129,0.25)] dark:shadow-[0_0_100px_-35px_rgba(16,185,129,0.4)]",
    q1: { label: "What's slowing your onboarding down?", answer: "Too many manual steps" },
    q2: {
      label: "Which feature matters most to you?",
      options: ["Custom themes", "Automation", "Team sharing"],
      pick: 0,
    },
    q3: { label: "How likely are you to recommend us?", pick: 3 },
  },
  {
    id: "dune",
    name: "Dune",
    dot: "bg-amber-500 dark:bg-amber-400",
    pip: "fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400",
    underline: "border-amber-600 dark:border-amber-400",
    caret: "bg-amber-600 dark:bg-amber-400",
    radio: "border-amber-600 bg-amber-600 dark:border-amber-400 dark:bg-amber-400",
    rating:
      "border-amber-600 bg-amber-600 text-white dark:border-amber-400 dark:bg-amber-400 dark:text-amber-950",
    button:
      "bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-amber-950",
    glow: "shadow-[0_0_60px_-30px_rgba(245,158,11,0.25)] dark:shadow-[0_0_100px_-35px_rgba(245,158,11,0.4)]",
    q1: {
      label: "What's the biggest bottleneck before launch?",
      answer: "Waiting on manual approvals",
    },
    q2: {
      label: "Which stage needs the most polish?",
      options: ["Approvals", "Templates", "Handoffs"],
      pick: 1,
    },
    q3: { label: "How satisfied are you with turnaround time?", pick: 2 },
  },
  {
    id: "tide",
    name: "Tide",
    dot: "bg-sky-500 dark:bg-sky-400",
    pip: "fill-sky-500 text-sky-500 dark:fill-sky-400 dark:text-sky-400",
    underline: "border-sky-600 dark:border-sky-400",
    caret: "bg-sky-600 dark:bg-sky-400",
    radio: "border-sky-600 bg-sky-600 dark:border-sky-400 dark:bg-sky-400",
    rating:
      "border-sky-600 bg-sky-600 text-white dark:border-sky-400 dark:bg-sky-400 dark:text-sky-950",
    button:
      "bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-400 dark:hover:bg-sky-300 dark:text-sky-950",
    glow: "shadow-[0_0_60px_-30px_rgba(14,165,233,0.25)] dark:shadow-[0_0_100px_-35px_rgba(14,165,233,0.4)]",
    q1: { label: "Where do people usually drop off?", answer: "Right after question three" },
    q2: {
      label: "What would keep them going?",
      options: ["Shorter forms", "Progress bar", "Save & resume"],
      pick: 2,
    },
    q3: { label: "How important is mobile support?", pick: 4 },
  },
  {
    id: "bloom",
    name: "Bloom",
    dot: "bg-rose-500 dark:bg-rose-400",
    pip: "fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400",
    underline: "border-rose-600 dark:border-rose-400",
    caret: "bg-rose-600 dark:bg-rose-400",
    radio: "border-rose-600 bg-rose-600 dark:border-rose-400 dark:bg-rose-400",
    rating:
      "border-rose-600 bg-rose-600 text-white dark:border-rose-400 dark:bg-rose-400 dark:text-rose-950",
    button:
      "bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-400 dark:hover:bg-rose-300 dark:text-rose-950",
    glow: "shadow-[0_0_60px_-30px_rgba(244,63,94,0.25)] dark:shadow-[0_0_100px_-35px_rgba(244,63,94,0.4)]",
    q1: { label: "What made this feel different?", answer: "The colors and the motion" },
    q2: {
      label: "Which detail stood out most?",
      options: ["Color palette", "Micro-interactions", "Typography"],
      pick: 0,
    },
    q3: { label: "How likely are you to remember this brand?", pick: 3 },
  },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function GhostSheet({
  name,
  style,
  blurAmount,
}: {
  name: string;
  style: React.CSSProperties;
  blurAmount: string;
}) {
  return (
    <div
      aria-hidden
      className={`absolute right-0 top-0 h-full w-full rounded-2xl border border-black/10 bg-white/50 shadow-lg shadow-black/10 backdrop-blur-md transition-all duration-700 ease-out dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/40 ${blurAmount}`}
      style={style}
    >
      <div className="p-4">
        <p className="text-xs font-medium text-neutral-500 dark:text-white/35">{name}</p>
        <div className="mt-6 space-y-2">
          <div className="h-1.5 w-4/5 rounded-full bg-black/5 dark:bg-white/[0.06]" />
          <div className="h-1.5 w-3/5 rounded-full bg-black/5 dark:bg-white/[0.06]" />
          <div className="h-1.5 w-2/3 rounded-full bg-black/5 dark:bg-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}

export function FormPreviewCard() {
  const reducedMotion = useReducedMotion();
  const [themeIndex, setThemeIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [typed, setTyped] = useState("");
  const [q2Picked, setQ2Picked] = useState<number | null>(null);
  const [q3Picked, setQ3Picked] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const theme = THEMES[themeIndex % THEMES.length] ?? THEMES[0];
  const ghostThemes: [Theme, Theme] = [
    THEMES[(themeIndex + 1) % THEMES.length] ?? THEMES[0],
    THEMES[(themeIndex + 2) % THEMES.length] ?? THEMES[0],
  ];

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setTyped("");
    setQ2Picked(null);
    setQ3Picked(null);
    setProgress(0);

    if (reducedMotion) {
      setTyped(theme.q1.answer);
      setQ2Picked(theme.q2.pick);
      setQ3Picked(theme.q3.pick);
      setProgress(100);
      return undefined;
    }

    const text = theme.q1.answer;
    let i = 0;
    const typeNext = () => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i < text.length) {
        timers.current.push(setTimeout(typeNext, 26));
      } else {
        timers.current.push(
          setTimeout(() => {
            setQ2Picked(theme.q2.pick);
            setProgress(34);
          }, 300),
        );
        timers.current.push(
          setTimeout(() => {
            setQ3Picked(theme.q3.pick);
            setProgress(67);
          }, 850),
        );
        timers.current.push(setTimeout(() => setProgress(100), 1350));
      }
    };
    timers.current.push(setTimeout(typeNext, 500));

    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeIndex, reducedMotion]);

  return (
    <div className="relative mx-auto h-[24rem] w-[22rem] sm:h-[27rem] sm:w-[25rem]">
      <GhostSheet
        name={ghostThemes[1].name}
        blurAmount="backdrop-blur-lg"
        style={{
          transform: mounted
            ? "translate(-46px, 20px) rotate(-9deg)"
            : "translate(-10px, 6px) rotate(-3deg)",
          opacity: mounted ? 0.7 : 0,
        }}
      />
      <GhostSheet
        name={ghostThemes[0].name}
        blurAmount="backdrop-blur-md"
        style={{
          transform: mounted
            ? "translate(-24px, 10px) rotate(-5deg)"
            : "translate(-6px, 4px) rotate(-2deg)",
          opacity: mounted ? 0.85 : 0,
          transitionDelay: "75ms",
        }}
      />

      {/* Front glass sheet */}
      <div
        className={`absolute right-0 top-0 h-full w-full overflow-hidden rounded-2xl border border-black/10 bg-white/60 backdrop-blur-xl transition-shadow duration-700 dark:border-white/10 dark:bg-white/[0.06] ${theme.glow}`}
        style={{
          transform: mounted ? "translate(0, 0) rotate(0deg)" : "translate(6px, 14px) rotate(1deg)",
          opacity: mounted ? 1 : 0,
          transition: "transform 0.6s ease-out, opacity 0.6s ease-out, box-shadow 0.7s ease-out",
        }}
      >
        {/* top glass highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/25" />

        <div className="flex h-full flex-col p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                {!reducedMotion && (
                  <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${theme.dot}`}
                  />
                )}
                <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${theme.dot}`} />
              </span>
              <p className="text-xs text-neutral-500 dark:text-white/40">{theme.name} theme</p>
            </div>
            <span className="text-xs font-medium tabular-nums text-neutral-500 dark:text-white/40">
              {progress}%
            </span>
          </div>

          {/* Q1 — short answer */}
          <div className="mb-4">
            <p className="text-[13px] font-medium text-neutral-800 dark:text-white/90">
              {theme.q1.label}
            </p>
            <div
              className={`mt-2 flex min-h-[1.6rem] items-end border-b pb-1 text-[13px] text-neutral-700 dark:text-white/80 ${theme.underline}`}
            >
              {typed}
              <span
                className={`ml-0.5 mb-0.5 inline-block h-3 w-[1.5px] ${theme.caret} ${
                  reducedMotion ? "" : "animate-pulse"
                }`}
              />
            </div>
          </div>

          {/* Q2 — multiple choice */}
          <div className="mb-4">
            <p className="text-[13px] font-medium text-neutral-800 dark:text-white/90">
              {theme.q2.label}
            </p>
            <div className="mt-2 space-y-1.5">
              {theme.q2.options.map((option, i) => (
                <div key={option} className="flex items-center gap-2 rounded px-1 py-0.5">
                  <span
                    className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                      q2Picked === i ? theme.radio : "border-neutral-300 dark:border-white/20"
                    }`}
                  >
                    {q2Picked === i && <Check className="h-2 w-2 text-white" strokeWidth={3} />}
                  </span>
                  <span className="text-[13px] text-neutral-600 dark:text-white/60">{option}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Q3 — rating scale */}
          <div>
            <p className="text-[13px] font-medium text-neutral-800 dark:text-white/90">
              {theme.q3.label}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-medium transition-all duration-300 ${
                    q3Picked === i
                      ? `${theme.rating} scale-110`
                      : "border-neutral-300 text-neutral-400 dark:border-white/20 dark:text-white/40"
                  }`}
                >
                  {i + 1}
                </span>
              ))}
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-neutral-400 dark:text-white/30">
              <span>Not likely</span>
              <span>Very likely</span>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between pt-4">
            <div className="flex items-center gap-1.5">
              {THEMES.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  aria-label={`Preview ${t.name} theme`}
                  onClick={() => setThemeIndex(i)}
                  className="p-0.5"
                >
                  <Circle
                    className={`h-2 w-2 transition-transform duration-200 ${
                      i === themeIndex
                        ? `${t.pip} scale-110`
                        : "fill-neutral-300 text-neutral-300 dark:fill-white/20 dark:text-white/20"
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-300 ${theme.button}`}
            >
              {progress === 100 ? "Submit" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormPreviewCard;
