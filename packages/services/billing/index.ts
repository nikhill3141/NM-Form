import { randomUUID } from "node:crypto";

import db, { and, desc, eq, inArray } from "@repo/database";
import {
  paymentsTable,
  plansTable,
  subscriptionsTable,
  type SelectPlan,
  type SelectSubscription,
} from "@repo/database/schema";

import { createRazorpayOrder } from "../razorpay/orders";
import {
  cancelRazorpaySubscription,
  createRazorpaySubscription,
} from "../razorpay/subscriptions";
import { verifyPaymentSignature } from "../razorpay/signature";
import {
  cancelSubscriptionInputModel,
  createOrderInputModel,
  createSubscriptionInputModel,
  verifyPaymentInputModel,
  type CancelSubscriptionInputModelType,
  type CreateOrderInputModelType,
  type CreateSubscriptionInputModelType,
  type VerifyPaymentInputModelType,
} from "./model";
import { parsePlanFeatures } from "./plan-features";

const ACTIVE_SUBSCRIPTION_STATUSES = ["pending", "active", "past_due"] as const;

class BillingService {
  private get razorpayKeyId() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!keyId) throw new Error("RAZORPAY_KEY_ID is not configured");
    return keyId;
  }

  private get razorpayKeySecret() {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new Error("RAZORPAY_KEY_SECRET is not configured");
    return keySecret;
  }

  private async getPlanBySlug(slug: string): Promise<SelectPlan> {
    const [plan] = await db
      .select()
      .from(plansTable)
      .where(and(eq(plansTable.slug, slug), eq(plansTable.isActive, true)))
      .limit(1);

    if (!plan) throw new Error("Plan not found");
    return plan;
  }

  private async getFreePlan(): Promise<SelectPlan> {
    const [plan] = await db
      .select()
      .from(plansTable)
      .where(and(eq(plansTable.interval, "free"), eq(plansTable.isActive, true)))
      .limit(1);

    if (!plan) throw new Error("Free plan is not configured");
    return plan;
  }

  private async getLatestSubscriptionForUser(userId: string) {
    const [subscription] = await db
      .select()
      .from(subscriptionsTable)
      .where(
        and(
          eq(subscriptionsTable.userId, userId),
          inArray(subscriptionsTable.status, [...ACTIVE_SUBSCRIPTION_STATUSES]),
        ),
      )
      .orderBy(desc(subscriptionsTable.createdAt))
      .limit(1);

    return subscription ?? null;
  }

  public async getPlans() {
    const plans = await db
      .select()
      .from(plansTable)
      .where(eq(plansTable.isActive, true))
      .orderBy(plansTable.amountPaise);

    return { plans };
  }

  public async getCurrentPlan(userId: string) {
    const subscription = await this.getLatestSubscriptionForUser(userId);

    if (!subscription) {
      const plan = await this.getFreePlan();
      return { plan, subscription: null as SelectSubscription | null };
    }

    const [plan] = await db
      .select()
      .from(plansTable)
      .where(eq(plansTable.id, subscription.planId))
      .limit(1);

    if (!plan) throw new Error("Subscription plan not found");

    return { plan, subscription };
  }

  public async getBillingStatus(userId: string) {
    const { plan, subscription } = await this.getCurrentPlan(userId);

    const [latestPayment] = await db
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.userId, userId))
      .orderBy(desc(paymentsTable.createdAt))
      .limit(1);

    return {
      plan,
      subscription,
      latestPayment: latestPayment ?? null,
      razorpayKeyId: this.razorpayKeyId,
    };
  }

  public async createOrder(userId: string, payload: CreateOrderInputModelType) {
    const { planSlug } = await createOrderInputModel.parseAsync(payload);
    const plan = await this.getPlanBySlug(planSlug);

    if (plan.interval === "free" || plan.amountPaise <= 0) {
      throw new Error("This plan does not require a one-time payment");
    }

    const receipt = `ff_${plan.slug}_${randomUUID().replace(/-/g, "").slice(0, 24)}`;

    const order = await createRazorpayOrder({
      amountPaise: plan.amountPaise,
      currency: "INR",
      receipt,
      notes: {
        userId,
        planSlug: plan.slug,
        planId: plan.id,
      },
    });

    const [payment] = await db
      .insert(paymentsTable)
      .values({
        userId,
        amountPaise: plan.amountPaise,
        currency: "INR",
        status: "created",
        providerOrderId: order.id,
      })
      .returning();

    if (!payment) throw new Error("Failed to create payment record");

    return {
      payment,
      plan,
      checkout: {
        keyId: this.razorpayKeyId,
        orderId: order.id,
        amountPaise: plan.amountPaise,
        currency: plan.currency as "INR",
      },
    };
  }

  public async verifyPayment(userId: string, payload: VerifyPaymentInputModelType) {
    const input = await verifyPaymentInputModel.parseAsync(payload);

    const [payment] = await db
      .select()
      .from(paymentsTable)
      .where(
        and(
          eq(paymentsTable.userId, userId),
          eq(paymentsTable.providerOrderId, input.razorpayOrderId),
        ),
      )
      .limit(1);

    if (!payment) throw new Error("Payment not found");

    if (payment.status === "captured") {
      return { payment, alreadyVerified: true as const };
    }

    verifyPaymentSignature({
      orderId: input.razorpayOrderId,
      paymentId: input.razorpayPaymentId,
      signature: input.razorpaySignature,
      keySecret: this.razorpayKeySecret,
    });

    const [updated] = await db
      .update(paymentsTable)
      .set({
        status: "captured",
        providerPaymentId: input.razorpayPaymentId,
        paidAt: new Date(),
      })
      .where(eq(paymentsTable.id, payment.id))
      .returning();

    if (!updated) throw new Error("Failed to update payment");

    return { payment: updated, alreadyVerified: false as const };
  }

  public async createSubscription(userId: string, payload: CreateSubscriptionInputModelType) {
    const { planSlug } = await createSubscriptionInputModel.parseAsync(payload);
    const plan = await this.getPlanBySlug(planSlug);

    if (plan.interval === "free") {
      throw new Error("Free plan does not use subscriptions");
    }

    if (!["month", "year"].includes(plan.interval)) {
      throw new Error("Plan is not subscription-eligible");
    }

    const features = parsePlanFeatures(plan.features);
    if (!features.razorpayPlanId) {
      throw new Error("Plan is missing Razorpay configuration");
    }

    const existing = await this.getLatestSubscriptionForUser(userId);
    if (existing && ["pending", "active"].includes(existing.status)) {
      throw new Error("An active subscription already exists");
    }

    const totalCount = plan.interval === "year" ? 10 : 120;

    const providerSubscription = await createRazorpaySubscription({
      planId: features.razorpayPlanId,
      totalCount,
      notes: {
        userId,
        planSlug: plan.slug,
        planId: plan.id,
      },
    });

    const [subscription] = await db
      .insert(subscriptionsTable)
      .values({
        userId,
        planId: plan.id,
        status: "pending",
        providerSubscriptionId: providerSubscription.id,
      })
      .returning();

    if (!subscription) throw new Error("Failed to create subscription record");

    return {
      subscription,
      plan,
      checkout: {
        keyId: this.razorpayKeyId,
        subscriptionId: providerSubscription.id,
      },
    };
  }

  public async cancelSubscription(userId: string, payload: CancelSubscriptionInputModelType) {
    const { cancelAtPeriodEnd } = await cancelSubscriptionInputModel.parseAsync(payload);

    const subscription = await this.getLatestSubscriptionForUser(userId);
    if (!subscription) throw new Error("No subscription to cancel");

    if (!subscription.providerSubscriptionId) {
      throw new Error("Subscription is missing provider reference");
    }

    if (subscription.status === "cancelled" || subscription.status === "expired") {
      return { subscription, alreadyCancelled: true as const };
    }

    await cancelRazorpaySubscription(
      subscription.providerSubscriptionId,
      cancelAtPeriodEnd,
    );

    const [updated] = await db
      .update(subscriptionsTable)
      .set({
        cancelAtPeriodEnd,
        canceledAt: cancelAtPeriodEnd ? null : new Date(),
        status: cancelAtPeriodEnd ? subscription.status : "cancelled",
      })
      .where(eq(subscriptionsTable.id, subscription.id))
      .returning();

    if (!updated) throw new Error("Failed to update subscription");

    return { subscription: updated, alreadyCancelled: false as const };
  }
}

export default BillingService;
