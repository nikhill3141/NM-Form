import { razorpay } from "./client";
import { RazorpayServiceError } from "./errors";

export async function createRazorpayOrder(input: {
  amountPaise: number;
  currency: "INR";
  receipt: string;
  notes?: Record<string, string>;
}) {
  try {
    return await razorpay.orders.create({
      amount: input.amountPaise,
      currency: input.currency,
      receipt: input.receipt,
      notes: input.notes,
    });
  } catch (error) {
    throw new RazorpayServiceError("Failed to create Razorpay order", error);
  }
}
