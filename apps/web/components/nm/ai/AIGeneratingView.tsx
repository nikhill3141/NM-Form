"use client";

import { useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";

const stages = ["Understanding your idea", "Structuring the questions", "Refining the form"];

export function AIGeneratingView() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStage((current) => Math.min(current + 1, stages.length - 1));
    }, 1800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-full items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        {/* Minimal AI indicator */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
            <Sparkles className="h-4 w-4" />

            <span className="absolute inset-0 animate-ping rounded-xl bg-foreground/10" />
          </div>

          <div>
            <p className="text-sm font-medium">Growing your form</p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              A moment while we shape the idea.
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="overflow-hidden rounded-xl border border-border bg-muted/10">
          {stages.map((stage, index) => {
            const completed = index < activeStage;
            const active = index === activeStage;

            return (
              <div
                key={stage}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  index !== stages.length - 1 ? "border-b border-border/60" : ""
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                    completed
                      ? "border-foreground bg-foreground text-background"
                      : active
                        ? "border-foreground/40 bg-background"
                        : "border-border bg-background"
                  }`}
                >
                  {completed ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        active ? "animate-pulse bg-foreground" : "bg-muted-foreground/25"
                      }`}
                    />
                  )}
                </div>

                <span
                  className={`text-xs transition-colors ${
                    active || completed ? "text-foreground" : "text-muted-foreground/45"
                  }`}
                >
                  {stage}
                </span>

                {active && (
                  <span className="ml-auto text-[10px] text-muted-foreground">Working</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
