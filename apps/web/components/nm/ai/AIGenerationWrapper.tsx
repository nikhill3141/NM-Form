"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles, X } from "lucide-react";

import { AIPromptView } from "./AIPromptView";
import { AIGeneratingView } from "./AIGeneratingView";
import { AIReviewView } from "./AIReviewView";
import { trpc } from "~/trpc/client";

export type AIGenerationState = "prompt" | "generating" | "review";

export type AIFieldType =
  | "short_text"
  | "long_text"
  | "email"
  | "number"
  | "single_select"
  | "multi_select"
  | "phone"
  | "date"
  | "rating"
  | "yes_no"
  | "url"
  | "time";
  


export interface AIFormField {
  label: string;
  description: string | null;
  type: AIFieldType;
  placeholder: string | null;
  required: boolean;
  options: string[] ;
}

export interface AIFormProposal {
  title: string;
  description: string | null;
  fields: AIFormField[];
}

interface AIGenerationWrapperProps {
  open: boolean;
  onClose: () => void;
  onApply: (proposal: AIFormProposal, mode: "create" | "add") => void;
  existingFields?: AIFormField[];
  defaultMode?: "create" | "add";
}

export function AIGenerationWrapper({
  open,
  onClose,
  onApply,
  existingFields = [],
  defaultMode = "create",
}: AIGenerationWrapperProps) {
  const [state, setState] = useState<AIGenerationState>("prompt");
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"create" | "add">(defaultMode);
  const [proposal, setProposal] = useState<AIFormProposal | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateForm = trpc.form.generateWithAI.useMutation({
    onSuccess: (result) => {
      setProposal(result);
      setError(null);
      setState("review");
    },

    onError: (mutationError) => {
      setError(mutationError.message);
      setState("prompt");
    },
  });

  useEffect(() => {
    if (!open) return;

    setState("prompt");
    setProposal(null);
    setError(null);
    setPrompt("");
    setMode(defaultMode);
  }, [open, defaultMode]);

  const handleClose = () => {
    if (generateForm.isPending) return;

    onClose();
  };

  const handleGenerate = () => {
    const trimmedPrompt = prompt.trim();

    if (trimmedPrompt.length < 3) {
      setError("Tell us a little more about the form you want.");
      return;
    }

    setError(null);
    setState("generating");

    generateForm.mutate({
      prompt: trimmedPrompt,
      mode,
      existingFields,
    });
  };

  const handleBack = () => {
    if (generateForm.isPending) return;

    setState("prompt");
    setProposal(null);
    setError(null);
  };

  const handleApply = () => {
    if (!proposal) return;

    onApply(proposal, mode);

    onClose();

    setState("prompt");
    setProposal(null);
    setPrompt("");
    setError(null);
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-3 backdrop-blur-sm sm:p-6">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close AI generator"
        onClick={handleClose}
        disabled={generateForm.isPending}
        className="absolute inset-0 cursor-default bg-black/[0.04] dark:bg-black/30"
      />

      {/* Main window */}
      <div className="relative flex h-[min(760px,calc(100dvh-24px))] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-black/10 dark:shadow-black/40 sm:h-[min(760px,calc(100dvh-48px))] sm:rounded-3xl">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/70 px-3 sm:h-15 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            {state !== "prompt" && (
              <button
                type="button"
                onClick={handleBack}
                disabled={generateForm.isPending}
                aria-label="Go back"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}

            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                <Sparkles className="h-3.5 w-3.5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {state === "review" ? "Review draft" : "Create with AI"}
                </p>

                <p className="hidden text-[11px] text-muted-foreground sm:block">
                  {state === "review" ? "Make sure everything looks right" : "Start with an idea"}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={generateForm.isPending}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40 sm:w-auto sm:px-2.5"
          >
            <X className="h-4 w-4 sm:hidden" />
            <span className="hidden text-xs sm:block">Close</span>
          </button>
        </header>

        {/* Content */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          {state === "prompt" && (
            <AIPromptView
              prompt={prompt}
              setPrompt={setPrompt}
              mode={mode}
              setMode={setMode}
              onGenerate={handleGenerate}
              error={error}
              hasExistingFields={existingFields.length > 0}
            />
          )}

          {state === "generating" && <AIGeneratingView />}

          {state === "review" && proposal && (
            <AIReviewView
              proposal={proposal}
              mode={mode}
              onApply={handleApply}
              onBack={handleBack}
            />
          )}
        </main>
      </div>
    </div>
  );
}
