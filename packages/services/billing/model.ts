import { z } from "zod";
import type {
  SelectPayment,
  SelectPlan,
  SelectSubscription,
} from "@repo/database/schema";
import { parsePlanFeatures } from "./plan-features";

export const planSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(50)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid plan slug");

export const createOrderInputModel = z.object({
  planSlug: planSlugSchema.describe("Catalog plan slug; amount is resolved server-side"),
});

export const verifyPaymentInputModel = z.object({
  razorpayOrderId: z.string().min(1).describe("Razorpay order_id from Checkout"),
  razorpayPaymentId: z.string().min(1).describe("Razorpay payment_id from Checkout"),
  razorpaySignature: z.string().min(1).describe("Razorpay signature from Checkout"),
});

export const createSubscriptionInputModel = z.object({
  planSlug: planSlugSchema.describe("Recurring plan slug"),
});

export const cancelSubscriptionInputModel = z.object({
  cancelAtPeriodEnd: z
    .boolean()
    .default(true)
    .describe("When true, access continues until current_period_end"),
});

export type CreateOrderInputModelType = z.infer<typeof createOrderInputModel>;
export type VerifyPaymentInputModelType = z.infer<typeof verifyPaymentInputModel>;
export type CreateSubscriptionInputModelType = z.infer<typeof createSubscriptionInputModel>;
export type CancelSubscriptionInputModelType = z.infer<typeof cancelSubscriptionInputModel>;


export const serializePlanPublic = (plan: SelectPlan) => ({
  id: plan.id,
  slug: plan.slug,
  name: plan.name,
  description: plan.description,
  interval: plan.interval,
  amountPaise: plan.amountPaise,
  currency: plan.currency as "INR",
  features: parsePlanFeatures(plan.features) as Record<string, unknown>,
});

export const serializeSubscriptionPublic = (subscription: SelectSubscription) => ({
  id: subscription.id,
  planId: subscription.planId,
  status: subscription.status,
  providerSubscriptionId: subscription.providerSubscriptionId,
  currentPeriodStart: subscription.currentPeriodStart?.toISOString() ?? null,
  currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
  cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
  canceledAt: subscription.canceledAt?.toISOString() ?? null,
  endedAt: subscription.endedAt?.toISOString() ?? null,
  createdAt: subscription.createdAt.toISOString(),
  updatedAt: subscription.updatedAt.toISOString(),
});

export const serializePaymentPublic = (payment: SelectPayment) => ({
  id: payment.id,
  status: payment.status,
  amountPaise: payment.amountPaise,
  currency: payment.currency as "INR",
  providerOrderId: payment.providerOrderId,
  providerPaymentId: payment.providerPaymentId,
  paidAt: payment.paidAt?.toISOString() ?? null,
  createdAt: payment.createdAt.toISOString(),
});