"use client";

import { ArrowRight, FilePlus2, ListPlus, Sparkles, WandSparkles } from "lucide-react";

interface AIPromptViewProps {
  prompt: string;
  setPrompt: (value: string) => void;
  mode: "create" | "add";
  setMode: (mode: "create" | "add") => void;
  onGenerate: () => void;
  error: string | null;
  hasExistingFields: boolean;
}

const suggestions = [
  "Gym membership",
  "Customer feedback",
  "Event registration",
  "Job application",
];

export function AIPromptView({
  prompt,
  setPrompt,
  mode,
  setMode,
  onGenerate,
  error,
  hasExistingFields,
}: AIPromptViewProps) {
  const canGenerate = prompt.trim().length >= 3;

  const useSuggestion = (suggestion: string) => {
    const prompts: Record<string, string> = {
      "Gym membership": "Create a gym membership registration form",
      "Customer feedback": "Create a customer feedback form",
      "Event registration": "Create an event registration form",
      "Job application": "Create a job application form",
    };

    setPrompt(prompts[suggestion] ?? suggestion);
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-4 py-7 sm:px-8 sm:py-10">
      {/* Intro */}
      <div className="mb-6">
        <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-muted/40">
          <Sparkles className="h-4 w-4 text-foreground" />
        </div>

        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">What are you building?</h1>

        <p className="mt-1.5 max-w-xl text-sm leading-5 text-muted-foreground">
          Describe the form in your own words. We&apos;ll turn the idea into questions you can
          review.
        </p>
      </div>

      {/* Mode */}
      {hasExistingFields && (
        <div className="mb-4 flex w-fit rounded-lg border border-border bg-muted/30 p-1">
          <button
            type="button"
            onClick={() => setMode("create")}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
              mode === "create"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FilePlus2 className="h-3.5 w-3.5" />
            New form
          </button>

          <button
            type="button"
            onClick={() => setMode("add")}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
              mode === "add"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ListPlus className="h-3.5 w-3.5" />
            Add questions
          </button>
        </div>
      )}

      {/* Prompt */}
      <div
        className={`overflow-hidden rounded-xl border bg-background transition focus-within:border-foreground/30 focus-within:ring-2 focus-within:ring-foreground/5 ${
          error ? "border-destructive/40" : "border-border"
        }`}
      >
        <textarea
          value={prompt}
          onChange={(event) => {
            setPrompt(event.target.value);
            if (error) {
              // Clear stale validation errors while typing.
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();

              if (canGenerate) {
                onGenerate();
              }
            }
          }}
          placeholder={
            mode === "add"
              ? "e.g. Add questions about fitness goals and preferred workout times..."
              : "e.g. Create a gym membership registration form..."
          }
          maxLength={4000}
          rows={5}
          className="w-full resize-none border-0 bg-transparent px-4 py-4 text-sm leading-6 outline-none placeholder:text-muted-foreground/50 focus:ring-0 sm:py-4.5"
          autoFocus
        />

        <div className="flex items-center justify-between border-t border-border/60 px-3 py-2.5">
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {prompt.length}/4000
          </span>

          <button
            type="button"
            disabled={!canGenerate}
            onClick={onGenerate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-xs font-medium text-background transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-35"
          >
            <WandSparkles className="h-3.5 w-3.5" />
            Generate
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <p className="mt-2.5 text-xs text-destructive">{error}</p>}

      {/* Suggestions */}
      <div className="mt-6">
        <p className="mb-2.5 text-[11px] font-medium text-muted-foreground">Start with an idea</p>

        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => useSuggestion(suggestion)}
              className="group inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-background px-2.5 py-2 text-xs text-muted-foreground transition hover:border-border hover:bg-muted/40 hover:text-foreground"
            >
              {suggestion}

              <ArrowRight className="h-3 w-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-60" />
            </button>
          ))}
        </div>
      </div>

      {/* Small trust note */}
      <div className="mt-6 flex items-center gap-2 text-[11px] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
        <span>Nothing is saved until you choose to apply the draft.</span>
      </div>
    </div>
  );
}
