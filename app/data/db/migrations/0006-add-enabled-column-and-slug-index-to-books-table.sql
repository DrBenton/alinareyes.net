ALTER TABLE `books`
ADD COLUMN `enabled` TINYINT(1) UNSIGNED NOT NULL DEFAULT 1 AFTER `slug`,
ADD INDEX `books_slug_idx` (`slug` ASC);