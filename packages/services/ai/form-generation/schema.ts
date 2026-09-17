// import {z} from "zod"

// export const aiFieldTypeSchema = z.enum([
//   "short_text",
//   "long_text",
//   "email",
//   "number",
//   "single_select",
//   "multi_select",
//   "phone",
//   "date",
//   "rating",
//   "yes_no",
//   "url",
//   "time",
// ]);

// export const aiFormFieldSchema = z.object({
//   label: z
//   .string()
//   .min(1)
//   .max(225),

//   description: z.
//   string()
//   .max(500)
//   .optional(),

//   type: aiFieldTypeSchema,

//   placeholder: z
//   .string()
//   .max(255)
//   .optional(),

//   required: z.boolean(),

//   options: z
//   .array(z.string().min(1).max(255))
//   .optional(),

// })

// export const aiFormProposalSchema = z.object({
//   title: z
//   .string()
//   .min(1)
//   .max(255),

//   description: z
//   .string()
//   .max(1000),

//   fields: z
//   .array(aiFormFieldSchema)
//   .min(1)
//   .max(30),
// })

// export const generateFormInputModel = z.object({
//   /**
//    * User's natural-language request.
//    *
//    * Example:
//    * "Create a gym membership form"
//    */
//   prompt: z.string().trim().min(3, "Please describe the form you want to create.").max(4000),

//   /**
//    * How the AI proposal should be used.
//    *
//    * create -> generate a complete form
//    * add -> generate questions to add to an existing form
//    */
//   mode: z.enum(["create", "add"]).default("create"),

//   /**
//    * Existing fields are provided only when the user
//    * wants AI to add questions to an existing form.
//    */
//   existingFields: z.array(aiFormFieldSchema).max(30).default([]),
// });

// export type AIFormField = z.infer<typeof aiFormFieldSchema>;
// export type AIFormProposal = z.infer<typeof aiFormProposalSchema>

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