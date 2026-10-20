import { z } from "zod";
import {
  cancelSubscriptionInputModel,
  createOrderInputModel,
  createSubscriptionInputModel,
  verifyPaymentInputModel,
} from "@repo/services/billing/model";

const planIntervalSchema = z.enum(["free", "month", "year"]);
const subscriptionStatusSchema = z.enum([
  "pending",
  "active",
  "past_due",
  "cancelled",
  "expired",
  "halted",
]);
const paymentStatusSchema = z.enum([
  "created",
  "authorized",
  "captured",
  "failed",
  "refunded",
]);

export const planPublicSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  interval: planIntervalSchema,
  amountPaise: z.number().int().nonnegative(),
  currency: z.literal("INR"),
  features: z.record(z.string(), z.unknown()),
});

export const subscriptionPublicSchema = z.object({
  id: z.uuid(),
  planId: z.uuid(),
  status: subscriptionStatusSchema,
  providerSubscriptionId: z.string().nullable(),
  currentPeriodStart: z.string().nullable(),
  currentPeriodEnd: z.string().nullable(),
  cancelAtPeriodEnd: z.boolean(),
  canceledAt: z.string().nullable(),
  endedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const paymentPublicSchema = z.object({
  id: z.uuid(),
  status: paymentStatusSchema,
  amountPaise: z.number().int().nonnegative(),
  currency: z.literal("INR"),
  providerOrderId: z.string().nullable(),
  providerPaymentId: z.string().nullable(),
  paidAt: z.string().nullable(),
  createdAt: z.string(),
});



export const getPlansInputModel = z.object({});
export const getPlansOutputModel = z.object({
  plans: z.array(planPublicSchema),
});

export const getCurrentPlanInputModel = z.object({});
export const getCurrentPlanOutputModel = z.object({
  plan: planPublicSchema,
  subscription: subscriptionPublicSchema.nullable(),
});

export const getBillingStatusInputModel = z.object({});
export const getBillingStatusOutputModel = z.object({
  plan: planPublicSchema,
  subscription: subscriptionPublicSchema.nullable(),
  latestPayment: paymentPublicSchema.nullable(),
  razorpayKeyId: z.string(),
});

export {
  createOrderInputModel,
  verifyPaymentInputModel,
  createSubscriptionInputModel,
  cancelSubscriptionInputModel,
};

export const createOrderOutputModel = z.object({
  payment: paymentPublicSchema,
  plan: planPublicSchema,
  checkout: z.object({
    keyId: z.string(),
    orderId: z.string(),
    amountPaise: z.number().int().positive(),
    currency: z.literal("INR"),
  }),
});

export const verifyPaymentOutputModel = z.object({
  payment: paymentPublicSchema,
  alreadyVerified: z.boolean(),
});

export const createSubscriptionOutputModel = z.object({
  subscription: subscriptionPublicSchema,
  plan: planPublicSchema,
  checkout: z.object({
    keyId: z.string(),
    subscriptionId: z.string(),
  }),
});

export const cancelSubscriptionOutputModel = z.object({
  subscription: subscriptionPublicSchema,
  alreadyCancelled: z.boolean(),
});
