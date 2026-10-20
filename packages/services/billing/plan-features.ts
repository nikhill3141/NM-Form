import { z } from "zod";

export const planFeaturesSchema = z
  .object({
    razorpayPlanId: z.string().min(1).optional(),
    formLimit: z.number().int().positive().optional(),
    aiQuotaPerMonth: z.number().int().nonnegative().optional(),
  })
  .catchall(z.unknown());

export type PlanFeatures = z.infer<typeof planFeaturesSchema>;

export function parsePlanFeatures(value: unknown): PlanFeatures {
  return planFeaturesSchema.parse(value ?? {});
}
