import { testRazorpayConnection } from "@repo/services/razorpay/service";
import { billingService } from "../../services";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { assertRateLimit } from "../../utils/rate-limit";
import {
  cancelSubscriptionInputModel,
  cancelSubscriptionOutputModel,
  createOrderInputModel,
  createOrderOutputModel,
  createSubscriptionInputModel,
  createSubscriptionOutputModel,
  getBillingStatusInputModel,
  getBillingStatusOutputModel,
  getCurrentPlanInputModel,
  getCurrentPlanOutputModel,
  getPlansInputModel,
  getPlansOutputModel,
  verifyPaymentInputModel,
  verifyPaymentOutputModel,
} from "./model";
import { serializePaymentPublic, serializePlanPublic, serializeSubscriptionPublic } from "@repo/services/billing/model";

const TAGS = ["Billing"];
const getPath = generatePath("/billing");

export const billingRouter = router({
  testRazorpay: protectedProcedure.query(async () => {
    return testRazorpayConnection();
  }),
//get plans
  getPlans: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/plans"),
        tags: TAGS,
      },
    })
    .input(getPlansInputModel)
    .output(getPlansOutputModel)
    .query(async () => {
      const { plans } = await billingService.getPlans();
      return { plans: plans.map(serializePlanPublic) };
    }),
//get current plan of user
  getCurrentPlan: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/current-plan"),
        tags: TAGS,
      },
    })
    .input(getCurrentPlanInputModel)
    .output(getCurrentPlanOutputModel)
    .query(async ({ ctx }) => {
      const result = await billingService.getCurrentPlan(ctx.user.id);
      return {
        plan: serializePlanPublic(result.plan),
        subscription: result.subscription
          ? serializeSubscriptionPublic(result.subscription)
          : null,
      };
    }),

//get billing status of user
  getBillingStatus: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/status"),
        tags: TAGS,
      },
    })
    .input(getBillingStatusInputModel)
    .output(getBillingStatusOutputModel)
    .query(async ({ ctx }) => {
      const status = await billingService.getBillingStatus(ctx.user.id);
      return {
        plan: serializePlanPublic(status.plan),
        subscription: status.subscription
          ? serializeSubscriptionPublic(status.subscription)
          : null,
        latestPayment: status.latestPayment
          ? serializePaymentPublic(status.latestPayment)
          : null,
        razorpayKeyId: status.razorpayKeyId,
      };
    }),

//create order
  createOrder: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/create-order"),
        tags: TAGS,
      },
    })
    .input(createOrderInputModel)
    .output(createOrderOutputModel)
    .mutation(async ({ input, ctx }) => {
      await assertRateLimit({
        key: `billing:create-order:${ctx.user.id}`,
        limit: 10,
        windowMs: 60 * 60 * 1000,
        message: "Too many checkout attempts. Please wait before trying again.",
      });

      const result = await billingService.createOrder(ctx.user.id, input);
      return {
        payment: serializePaymentPublic(result.payment),
        plan: serializePlanPublic(result.plan),
        checkout: result.checkout,
      };
    }),

//verify payment
  verifyPayment: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/verify-payment"),
        tags: TAGS,
      },
    })
    .input(verifyPaymentInputModel)
    .output(verifyPaymentOutputModel)
    .mutation(async ({ input, ctx }) => {
      await assertRateLimit({
        key: `billing:verify:${ctx.user.id}`,
        limit: 20,
        windowMs: 60 * 60 * 1000,
        message: "Too many verification attempts. Please wait before trying again.",
      });

      const result = await billingService.verifyPayment(ctx.user.id, input);
      return {
        payment: serializePaymentPublic(result.payment),
        alreadyVerified: result.alreadyVerified,
      };
    }),

//create subscription
  createSubscription: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/create-subscription"),
        tags: TAGS,
      },
    })
    .input(createSubscriptionInputModel)
    .output(createSubscriptionOutputModel)
    .mutation(async ({ input, ctx }) => {
      await assertRateLimit({
        key: `billing:create-subscription:${ctx.user.id}`,
        limit: 8,
        windowMs: 60 * 60 * 1000,
        message: "Too many subscription attempts. Please wait before trying again.",
      });

      const result = await billingService.createSubscription(ctx.user.id, input);
      return {
        subscription: serializeSubscriptionPublic(result.subscription),
        plan: serializePlanPublic(result.plan),
        checkout: result.checkout,
      };
    }),

    
  cancelSubscription: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/cancel-subscription"),
        tags: TAGS,
      },
    })
    .input(cancelSubscriptionInputModel)
    .output(cancelSubscriptionOutputModel)
    .mutation(async ({ input, ctx }) => {
      const result = await billingService.cancelSubscription(ctx.user.id, input);
      return {
        subscription: serializeSubscriptionPublic(result.subscription),
        alreadyCancelled: result.alreadyCancelled,
      };
    }),
});
