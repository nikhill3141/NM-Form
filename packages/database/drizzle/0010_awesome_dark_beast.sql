ALTER TABLE "users" DROP COLUMN "email_verification_token_hash";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email_verification_expires_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password_reset_token_hash";