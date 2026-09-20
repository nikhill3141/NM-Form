

import { z } from "zod";

export const aiFieldTypeSchema = z.enum([
  "short_text",
  "long_text",
  "email",
  "number",
  "single_select",
  "multi_select",
  "phone",
  "date",
  "rating",
  "yes_no",
  "url",
  "time",
]);

export type AIFieldType = z.infer<typeof aiFieldTypeSchema>;

export const aiFormFieldSchema = z.object({
  label: z.string().min(1).max(255),

  description: z.string().max(500).nullable(),

  type: aiFieldTypeSchema,

  placeholder: z.string().max(255).nullable(),

  required: z.boolean(),

  options: z.array(z.string().min(1).max(255)),
});

export type AIFormField = z.infer<typeof aiFormFieldSchema>;

export const aiFormProposalSchema = z.object({
  title: z.string().min(1).max(255),

  description: z.string().max(1000),

  fields: z.array(aiFormFieldSchema).min(1).max(30),
});

export type AIFormProposal = z.infer<typeof aiFormProposalSchema>;

export const generateFormInputModel = z.object({
  prompt: z.string().trim().min(3, "Please describe the form you want to create.").max(4000),
  mode: z.enum(["create", "add"]).default("create"),
  existingFields: z.array(aiFormFieldSchema).max(30).default([]),
});