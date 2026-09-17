"use client";

import {
  AlignLeft,
  ArrowLeft,
  Calendar,
  Check,
  CircleCheck,
  CircleDot,
  Clock,
  Hash,
  Link as LinkIcon,
  ListChecks,
  Mail,
  Phone,
  Sparkles,
  Star,
  Type,
} from "lucide-react";

import type { AIFormField, AIFormProposal } from "./AIGenerationWrapper";

interface AIReviewViewProps {
  proposal: AIFormProposal;
  mode: "create" | "add";
  onApply: () => void;
  onBack: () => void;
}

function FieldIcon({ type }: { type: AIFormField["type"] }) {
  const className = "h-3.5 w-3.5";

  switch (type) {
    case "email":
      return <Mail className={className} />;

    case "phone":
      return <Phone className={className} />;

    case "number":
      return <Hash className={className} />;

    case "date":
      return <Calendar className={className} />;

    case "time":
      return <Clock className={className} />;

    case "url":
      return <LinkIcon className={className} />;

    case "single_select":
      return <CircleDot className={className} />;

    case "multi_select":
      return <ListChecks className={className} />;

    case "rating":
      return <Star className={className} />;

    case "yes_no":
      return <CircleCheck className={className} />;

    case "long_text":
      return <AlignLeft className={className} />;

    default:
      return <Type className={className} />;
  }
}

function FieldPreview({ field }: { field: AIFormField }) {
  const simpleInputTypes = ["short_text", "email", "phone", "number", "url", "date", "time"];

  return (
    <div className="group rounded-xl border border-border bg-background transition hover:border-border/80">
      {/* Question header */}
      <div className="flex items-start gap-3 px-3.5 py-3.5 sm:px-4">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/70 text-muted-foreground">
          <FieldIcon type={field.type} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium leading-5">
              {field.label}

              {field.required && <span className="ml-1 text-muted-foreground">*</span>}
            </p>

            <span className="hidden shrink-0 text-[10px] text-muted-foreground sm:block">
              {field.type.replaceAll("_", " ")}
            </span>
          </div>

          {field.description && (
            <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
              {field.description}
            </p>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="border-t border-border/60 px-3.5 py-3 sm:px-4">
        {simpleInputTypes.includes(field.type) && (
          <div className="rounded-lg border border-border/70 bg-muted/15 px-3 py-2.5 text-xs text-muted-foreground">
            {field.placeholder || "Your answer"}
          </div>
        )}

        {field.type === "long_text" && (
          <div className="min-h-16 rounded-lg border border-border/70 bg-muted/15 px-3 py-2.5 text-xs text-muted-foreground">
            {field.placeholder || "Your answer"}
          </div>
        )}

        {field.type === "single_select" && (
          <div className="flex flex-wrap gap-1.5">
            {(field.options ?? []).map((option) => (
              <div
                key={option}
                className="inline-flex items-center gap-2 rounded-lg border border-border/70 px-3 py-2 text-xs"
              >
                <span className="h-3 w-3 rounded-full border border-border" />
                {option}
              </div>
            ))}
          </div>
        )}

        {field.type === "multi_select" && (
          <div className="flex flex-wrap gap-1.5">
            {(field.options ?? []).map((option) => (
              <div
                key={option}
                className="inline-flex items-center gap-2 rounded-lg border border-border/70 px-3 py-2 text-xs"
              >
                <span className="h-3 w-3 rounded border border-border" />
                {option}
              </div>
            ))}
          </div>
        )}

        {field.type === "yes_no" && (
          <div className="grid grid-cols-2 gap-1.5">
            {["Yes", "No"].map((option) => (
              <div
                key={option}
                className="rounded-lg border border-border/70 px-3 py-2 text-center text-xs"
              >
                {option}
              </div>
            ))}
          </div>
        )}

        {field.type === "rating" && (
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border/70 text-[11px]"
              >
                {index + 1}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AIReviewView({ proposal, mode, onApply, onBack }: AIReviewViewProps) {
  const questionLabel = proposal.fields.length === 1 ? "question" : "questions";

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 pb-24 sm:px-8 sm:py-8 sm:pb-24">
      {/* Intro */}
      <div className="mb-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          <span className="text-xs font-medium text-muted-foreground">AI draft</span>
        </div>

        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {mode === "add" ? "Here are the new questions" : "Here&apos;s your form"}
        </h1>

        <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
          Review the draft below. You can edit everything after applying it.
        </p>
      </div>

      {/* Form summary */}
      <section className="mb-5 rounded-xl border border-border bg-muted/15 px-4 py-4 sm:px-5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {mode === "add" ? "Suggested addition" : "Form"}
        </p>

        <h2 className="mt-1.5 text-base font-semibold tracking-tight sm:text-lg">
          {proposal.title}
        </h2>

        {proposal.description && (
          <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
            {proposal.description}
          </p>
        )}

        <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="h-1 w-1 rounded-full bg-foreground/30" />
          {proposal.fields.length} {questionLabel}
        </div>
      </section>

      {/* Questions */}
      <section>
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-xs font-medium">Questions</p>

          <span className="text-[11px] text-muted-foreground">Ready to review</span>
        </div>

        <div className="space-y-2.5">
          {proposal.fields.map((field, index) => (
            <div key={`${field.label}-${index}`} className="relative">
              <span className="absolute -left-6 top-4 hidden w-4 text-right text-[10px] tabular-nums text-muted-foreground/50 sm:block">
                {String(index + 1).padStart(2, "0")}
              </span>

              <FieldPreview field={field} />
            </div>
          ))}
        </div>
      </section>

      {/* Bottom actions */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 px-3 py-2.5 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Change idea
          </button>

          <button
            type="button"
            onClick={onApply}
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2.5 text-xs font-medium text-background transition hover:opacity-90"
          >
            <Check className="h-3.5 w-3.5" />
            Apply to builder
          </button>
        </div>
      </div>
    </div>
  );
}
