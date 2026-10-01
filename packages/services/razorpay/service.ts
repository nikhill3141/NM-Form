

import { razorpay } from "./client";
import { RazorpayServiceError } from "./errors";

export async function testRazorpayConnection() {
  try {
    const payments = await razorpay.payments.all({
      count: 1,
    });

    return {
      success: true,
      count: payments.count,
    };
  } catch (error) {
    console.error("Razorpay connection failed", error);

    throw new RazorpayServiceError("Unable to connect to Razorpay", error);
  }
}

