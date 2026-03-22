CREATE TABLE `control_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `control_categories_name_unique` ON `control_categories` (`name`);--> statement-breakpoint
CREATE TABLE `control_clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`notes` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `control_suppliers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`notes` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
ALTER TABLE `control_expenses` ADD `supplier_id` integer REFERENCES control_suppliers(id);--> statement-breakpoint
ALTER TABLE `control_expenses` ADD `category_id` integer REFERENCES control_categories(id);--> statement-breakpoint
ALTER TABLE `control_incomes` ADD `client_id` integer REFERENCES control_clients(id);--> statement-breakpoint
ALTER TABLE `control_incomes` ADD `category_id` integer REFERENCES control_categories(id);--> statement-breakpoint
ALTER TABLE `control_services` ADD `supplier_id` integer REFERENCES control_suppliers(id);--> statement-breakpoint
ALTER TABLE `control_services` ADD `category_id` integer REFERENCES control_categories(id);