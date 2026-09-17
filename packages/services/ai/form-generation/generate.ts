import { generateText, Output } from "ai";

import { aiFormProposalSchema, type AIFormProposal, type AIFormField } from "./schema";

import { buildFormGenerationPrompt } from "./prompt";

import { validateAIFormProposal } from "./validate";

import { getAIProvider } from "../providers";

import type { AIProviderName } from "../providers/model";

export interface GenerateFormInput {
  prompt: string;
  existingFields?: AIFormField[];
  mode: "add" | "create";
  provider: AIProviderName;
  model: string;
}

export async function generateFormProposal(input: GenerateFormInput): Promise<AIFormProposal> {
  const { prompt, existingFields = [], mode, provider, model } = input;

  const trimmedPrompt = prompt.trim();

  if (!trimmedPrompt) {
    throw new Error("Form generation prompt is required.");
  }

  const aiProvider = getAIProvider(provider);

  const languageModel = aiProvider.getModel({
    provider,
    model,
  });

  const modeInstruction =
    mode === "add"
      ? `
The user is editing an existing form.

Only suggest additional fields.

Do NOT replace existing fields.

Do NOT recreate existing fields.

Do NOT duplicate information already captured
by the existing fields.

The fields array must contain ONLY new questions.
`
      : `
The user is creating a new form.

Create the complete initial form structure.
`;

  const { output } = await generateText({
    model: languageModel,

    system: `
You are the Forest Forms AI Form Architect.

Transform the user's natural-language idea into a useful,
minimal, production-ready form proposal.

${modeInstruction}

IMPORTANT RULES:

- Generate only form content.
- Never generate database IDs.
- Never generate user IDs.
- Never generate authentication settings.
- Never generate password settings.
- Never generate publishing settings.
- Never generate visibility settings.
- Never generate expiry settings.
- Never generate response limits.
- Never modify or persist a database record.
- Avoid unnecessary questions.
- Avoid duplicate fields.
- Prefer clear and concise labels.
- The user remains in control of the final form.

OPTIONS RULES:

- Every field MUST contain an options array.
- Never return null for options.
- Never omit options.
- single_select MUST have at least 2 options.
- multi_select MUST have at least 2 options.
- yes_no MUST have options: [].
- All other field types MUST have options: [].

For example:

"Legally Authorized to Work"

must be:

{
  "type": "single_select",
  "options": ["Yes", "No"]
}

NOT:

{
  "type": "single_select",
  "options": []
}

Return only the structured form proposal.
`,

    prompt: buildFormGenerationPrompt(trimmedPrompt, existingFields),

    providerOptions: {
      google: {
        structuredOutputs: false,
      },
    },

    output: Output.object({
      name: "ForestFormProposal",
      description: "A Forest Forms proposal containing a title, description, and form fields.",
      schema: aiFormProposalSchema,
    }),
  });

  if (!output) {
    throw new Error("The AI could not generate a valid form proposal.");
  }

  return validateAIFormProposal(output);
}
