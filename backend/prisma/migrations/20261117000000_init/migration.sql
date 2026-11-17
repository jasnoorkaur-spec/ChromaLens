CREATE TABLE `users` (
  `id` VARCHAR(30) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(254) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `users_email_key` (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `cvd_preferences` (
  `id` VARCHAR(30) NOT NULL,
  `user_id` VARCHAR(30) NOT NULL,
  `cvd_type` VARCHAR(40) NOT NULL,
  `preferred_palette` VARCHAR(80) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `cvd_preferences_user_id_idx` (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `scan_history` (
  `id` VARCHAR(30) NOT NULL,
  `user_id` VARCHAR(30) NOT NULL,
  `original_image_url` VARCHAR(2048) NULL,
  `transformed_image_url` VARCHAR(2048) NULL,
  `cvd_type` VARCHAR(40) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `scan_history_user_id_created_at_idx` (`user_id`, `created_at`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `transformations` (
  `id` VARCHAR(30) NOT NULL,
  `scan_id` VARCHAR(30) NOT NULL,
  `transformation_type` VARCHAR(80) NOT NULL,
  `transformed_image_url` VARCHAR(2048) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `transformations_scan_id_idx` (`scan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `sessions` (
  `id` VARCHAR(30) NOT NULL,
  `user_id` VARCHAR(30) NOT NULL,
  `token_hash` CHAR(64) NOT NULL,
  `expires_at` DATETIME(3) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `sessions_token_hash_key` (`token_hash`),
  INDEX `sessions_user_id_idx` (`user_id`),
  INDEX `sessions_expires_at_idx` (`expires_at`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `cvd_preferences`
  ADD CONSTRAINT `cvd_preferences_user_id_fkey`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `scan_history`
  ADD CONSTRAINT `scan_history_user_id_fkey`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `transformations`
  ADD CONSTRAINT `transformations_scan_id_fkey`
  FOREIGN KEY (`scan_id`) REFERENCES `scan_history` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_user_id_fkey`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
