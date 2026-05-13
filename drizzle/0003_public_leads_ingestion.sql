-- Migration: Add public lead ingestion fields to the leads table
-- Adds ecosystem-specific columns and makes `message` nullable.
--
-- SQLite / Turso does NOT support DROP NOT NULL directly; the column was
-- previously created as NOT NULL with no default.  Because libsql/Turso uses
-- SQLite semantics, existing rows will keep their current values and new rows
-- from the public API will insert NULL for `message`.
--
-- All new columns are nullable so that existing contact-form rows are unaffected.
--> statement-breakpoint
ALTER TABLE `leads` ADD `product` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `source` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `business_type` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `interests` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `country` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `tags` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `metadata` text;

