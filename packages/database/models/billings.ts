import { relations, sql } from "drizzle-orm";

import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";

import { usersTable } from "./user";


// Enums
export const planIntervalEnum = pgEnum("plan_interval", ["free", "month", "year"]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "pending",
  "active",
  "past_due",
  "cancelled",
  "expired",
  "halted",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "created",
  "authorized",
  "captured",
  "failed",
  "refunded",
]);

export const paymentProviderEnum = pgEnum("payment_provider", ["razorpay"]);

export const webhookEventStatusEnum = pgEnum("webhook_event_status", [
  "received",
  "processing",
  "processed",
  "failed",
]);

// Plans
export const plansTable = pgTable(
  "plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    slug: varchar("slug", { length: 50 }).notNull().unique(),

    name: varchar("name", { length: 100 }).notNull(),

    description: text("description"),

    interval: planIntervalEnum("interval").notNull().default("free"),

    // INR amount in paise. Example: ₹499 = 49900.
    amountPaise: integer("amount_paise").notNull().default(0),

    currency: varchar("currency", { length: 3 }).notNull().default("INR"),

    // Feature flags and quotas, such as form limits and AI quotas.
    features: jsonb("features").$type<Record<string, unknown>>().notNull().default({}),

    isActive: boolean("is_active").notNull().default(true),

    createdAt: timestamp("created_at").notNull().defaultNow(),

    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check("plans_amount_non_negative", sql`${table.amountPaise} >= 0`),
    check("plans_currency_inr", sql`${table.currency} = 'INR'`),
    index("plans_active_idx").on(table.isActive),
  ],
);

// Subscriptions
export const subscriptionsTable = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),

    planId: uuid("plan_id")
      .notNull()
      .references(() => plansTable.id, { onDelete: "restrict" }),

    status: subscriptionStatusEnum("status").notNull().default("pending"),

    provider: paymentProviderEnum("provider").notNull().default("razorpay"),

    // Razorpay subscription ID.
    providerSubscriptionId: varchar("provider_subscription_id", {
      length: 255,
    }),

    currentPeriodStart: timestamp("current_period_start"),
    currentPeriodEnd: timestamp("current_period_end"),

    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),

    canceledAt: timestamp("canceled_at"),
    endedAt: timestamp("ended_at"),

    createdAt: timestamp("created_at").notNull().defaultNow(),

    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("subscriptions_provider_subscription_id_uidx").on(table.providerSubscriptionId),

    index("subscriptions_user_id_idx").on(table.userId),
    index("subscriptions_plan_id_idx").on(table.planId),
    index("subscriptions_status_idx").on(table.status),

    index("subscriptions_user_status_idx").on(table.userId, table.status),

    index("subscriptions_period_end_idx").on(table.currentPeriodEnd),
  ],
);

// Payments
export const paymentsTable = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),

    subscriptionId: uuid("subscription_id").references(() => subscriptionsTable.id, {
      onDelete: "set null",
    }),

    provider: paymentProviderEnum("provider").notNull().default("razorpay"),

    status: paymentStatusEnum("status").notNull().default("created"),

    amountPaise: integer("amount_paise").notNull(),

    currency: varchar("currency", { length: 3 }).notNull().default("INR"),

    // Razorpay order, payment, and invoice references.
    providerOrderId: varchar("provider_order_id", {
      length: 255,
    }),

    providerPaymentId: varchar("provider_payment_id", {
      length: 255,
    }),

    providerInvoiceId: varchar("provider_invoice_id", {
      length: 255,
    }),

    failureCode: varchar("failure_code", { length: 100 }),
    failureReason: text("failure_reason"),

    paidAt: timestamp("paid_at"),

    createdAt: timestamp("created_at").notNull().defaultNow(),

    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check("payments_amount_non_negative", sql`${table.amountPaise} >= 0`),
    check("payments_currency_inr", sql`${table.currency} = 'INR'`),

    uniqueIndex("payments_provider_order_id_uidx").on(table.providerOrderId),

    uniqueIndex("payments_provider_payment_id_uidx").on(table.providerPaymentId),

    uniqueIndex("payments_provider_invoice_id_uidx").on(table.providerInvoiceId),

    index("payments_user_id_idx").on(table.userId),
    index("payments_subscription_id_idx").on(table.subscriptionId),
    index("payments_status_idx").on(table.status),
    index("payments_created_at_idx").on(table.createdAt),
  ],
);

// Webhook Events 
export const webhookEventsTable = pgTable(
  "webhook_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    provider: paymentProviderEnum("provider").notNull().default("razorpay"),

    // Razorpay event ID, used for idempotency.
    providerEventId: varchar("provider_event_id", {
      length: 255,
    }).notNull(),

    eventType: varchar("event_type", { length: 150 }).notNull(),

    status: webhookEventStatusEnum("status").notNull().default("received"),

    // Store the verified webhook payload for processing/auditing.
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),

    processedAt: timestamp("processed_at"),
    errorMessage: text("error_message"),

    createdAt: timestamp("created_at").notNull().defaultNow(),

    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("webhook_events_provider_event_uidx").on(table.provider, table.providerEventId),

    index("webhook_events_status_idx").on(table.status),
    index("webhook_events_event_type_idx").on(table.eventType),
    index("webhook_events_created_at_idx").on(table.createdAt),
  ],
);

// Relations
export const plansRelations = relations(plansTable, ({ many }) => ({
  subscriptions: many(subscriptionsTable),
}));

export const subscriptionsRelations = relations(subscriptionsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [subscriptionsTable.userId],
    references: [usersTable.id],
  }),

  plan: one(plansTable, {
    fields: [subscriptionsTable.planId],
    references: [plansTable.id],
  }),

  payments: many(paymentsTable),
}));

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [paymentsTable.userId],
    references: [usersTable.id],
  }),

  subscription: one(subscriptionsTable, {
    fields: [paymentsTable.subscriptionId],
    references: [subscriptionsTable.id],
  }),
}));

// Types
export type SelectPlan = typeof plansTable.$inferSelect;
export type InsertPlan = typeof plansTable.$inferInsert;

export type SelectSubscription = typeof subscriptionsTable.$inferSelect;
export type InsertSubscription = typeof subscriptionsTable.$inferInsert;

export type SelectPayment = typeof paymentsTable.$inferSelect;
export type InsertPayment = typeof paymentsTable.$inferInsert;

export type SelectWebhookEvent = typeof webhookEventsTable.$inferSelect;
export type InsertWebhookEvent = typeof webhookEventsTable.$inferInsert;
