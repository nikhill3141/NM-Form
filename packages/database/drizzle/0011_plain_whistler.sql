ALTER TABLE "users" ADD COLUMN "email_verification_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_reset_token_hash" varchar(255);