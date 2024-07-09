CREATE TABLE `members_2` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`company` text,
	`gender` text NOT NULL,
	`birth_date` integer,
	`phone` text,
	`email` text,
	`street` text NOT NULL,
	`city` text NOT NULL,
	`zip` text NOT NULL,
	`state` text,
	`country` text,
	`membership_id` text NOT NULL,
	`join_date` integer,
	`leave_date` integer,
	`notes` text,
	`sepa_account_holder` text,
	`sepa_iban` text,
	`sepa_bic` text,
	`sepa_mandate_id` text,
	`sepa_mandate_date` integer,
	`payment_role` integer NOT NULL,
	`payment_schedule` text NOT NULL,
	`payment_type` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`payment_role`) REFERENCES `payment_roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `payment_payees` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`payment_id` integer NOT NULL,
	`member_id` integer NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`join_date` integer,
	`leave_date` integer,
	`payment_schedule` text NOT NULL,
	`payment_amount` integer NOT NULL,
	`payment_role` integer NOT NULL,
	`payment_role_amount` integer NOT NULL,
	`payment_role_name` text NOT NULL,
	`has_paid` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `payment_roles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`amount` integer NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`collection_date` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `members_2_email_unique` ON `members_2` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `members_2_membership_id_unique` ON `members_2` (`membership_id`);