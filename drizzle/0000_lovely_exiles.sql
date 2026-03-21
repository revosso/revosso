CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`company` text,
	`message` text NOT NULL,
	`lead_type` text,
	`product_interest` text,
	`source_page` text,
	`business_stage` text,
	`email_status` text DEFAULT 'pending' NOT NULL,
	`lead_status` text DEFAULT 'new' NOT NULL,
	`notes` text,
	`ip_address` text,
	`user_agent` text,
	`user_language` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `visitors` (
	`id` text PRIMARY KEY NOT NULL,
	`visitor_id` text NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`page_path` text NOT NULL,
	`language` text,
	`referrer` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `control_debts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`debtor_name` text NOT NULL,
	`contact` text,
	`description` text,
	`amount` real NOT NULL,
	`paid_amount` real DEFAULT 0,
	`currency` text DEFAULT 'USD',
	`due_date` integer,
	`status` text DEFAULT 'open' NOT NULL,
	`notes` text,
	`last_contacted_at` integer,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `control_expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer,
	`description` text NOT NULL,
	`amount` real NOT NULL,
	`paid_to` text NOT NULL,
	`date` integer NOT NULL,
	`note` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`project_id`) REFERENCES `control_projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `control_incomes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer,
	`description` text NOT NULL,
	`amount` real NOT NULL,
	`received_from` text NOT NULL,
	`date` integer NOT NULL,
	`note` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`project_id`) REFERENCES `control_projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `control_project_updates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`note` text NOT NULL,
	`created_by` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`project_id`) REFERENCES `control_projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `control_projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`budget` real,
	`status` text DEFAULT 'in_progress' NOT NULL,
	`start_date` integer NOT NULL,
	`expected_end_date` integer,
	`actual_end_date` integer,
	`progress_percent` integer DEFAULT 0,
	`priority` text DEFAULT 'medium',
	`owner` text,
	`last_update_at` integer,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `control_services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`vendor` text,
	`category` text,
	`description` text,
	`cost` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`billing_cycle` text NOT NULL,
	`billing_day` integer,
	`renewal_date` integer,
	`start_date` integer,
	`end_date` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`notes` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `control_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `control_settings_key_unique` ON `control_settings` (`key`);