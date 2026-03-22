CREATE TABLE `control_platforms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`category` text,
	`notes` text,
	`sort_order` integer DEFAULT 0,
	`created_at` integer,
	`updated_at` integer
);
