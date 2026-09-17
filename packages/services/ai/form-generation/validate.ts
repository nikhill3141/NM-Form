import type { AIFormProposal } from "./schema";

const optionFieldTypes = new Set(["single_select", "multi_select"]);

const nonOptionFieldTypes = new Set([
  "short_text",
  "long_text",
  "email",
  "number",
  "phone",
  "date",
  "rating",
  "yes_no",
  "url",
  "time",
]);

export function validateAIFormProposal(proposal: AIFormProposal): AIFormProposal {
  if (!proposal.fields.length) {
    throw new Error("The AI generated a form without any fields.");
  }

  for (const field of proposal.fields) {
    const options = field.options ?? [];

    if (optionFieldTypes.has(field.type)) {
      const cleanedOptions = [...new Set(options.map((option) => option.trim()).filter(Boolean))];

      if (cleanedOptions.length < 2) {
        throw new Error(`Field "${field.label}" needs at least two options.`);
      }

      field.options = cleanedOptions;
    }

    if (field.type === "yes_no") {
      field.options = [];
    }

    if (nonOptionFieldTypes.has(field.type) && field.type !== "yes_no") {
      if (options.length > 0) {
        throw new Error(`Field "${field.label}" cannot contain options.`);
      }

      field.options = [];
    }

    field.label = field.label.trim();

    if (!field.label) {
      throw new Error("The AI generated a field without a valid label.");
    }

    if (typeof field.description === "string" && !field.description.trim()) {
      field.description = null;
    }

    if (typeof field.placeholder === "string" && !field.placeholder.trim()) {
      field.placeholder = null;
    }
  }

  return proposal;
}
