import { protectedProcedure, router } from "../../trpc";
import {testRazorpayConnection} from "@repo/services/razorpay/service";

export const billingRouter = router({
  testRazorpay: protectedProcedure.query(async () => {
    return testRazorpayConnection();
  }),
});
