ALTER TABLE `books`
ADD COLUMN `highlight` TINYINT(1) UNSIGNED NOT NULL AFTER `price`;