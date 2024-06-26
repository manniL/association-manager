CREATE TABLE `members_2` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`company` text,
	`gender` text,
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
	`payment_role` integer NOT NULL,
	`payment_schedule` text NOT NULL,
	`payment_type` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `members_2_email_unique` ON `members_2` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `members_2_membership_id_unique` ON `members_2` (`membership_id`);