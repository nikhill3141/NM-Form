import { razorpay } from "./client";
import { RazorpayServiceError } from "./errors";

export async function createRazorpaySubscription(input: {
  planId: string;
  totalCount: number;
  customerNotify?: 0 | 1;
  notes?: Record<string, string>;
}) {
  try {
    return await razorpay.subscriptions.create({
      plan_id: input.planId,
      total_count: input.totalCount,
      customer_notify: input.customerNotify ?? 1,
      notes: input.notes,
    });
  } catch (error) {
    throw new RazorpayServiceError("Failed to create Razorpay subscription", error);
  }
}

export async function cancelRazorpaySubscription(
  providerSubscriptionId: string,
  cancelAtCycleEnd: boolean,
) {
  try {
    return await razorpay.subscriptions.cancel(providerSubscriptionId, cancelAtCycleEnd);
  } catch (error) {
    throw new RazorpayServiceError("Failed to cancel Razorpay subscription", error);
  }
}
