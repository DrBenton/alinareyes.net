ALTER TABLE `books`
CHANGE COLUMN `slug` `slug` VARCHAR(255) NOT NULL AFTER `id`,
CHANGE COLUMN `desc_fr` `desc_fr` TEXT NOT NULL ,
CHANGE COLUMN `updated_at` `updated_at` DATETIME NOT NULL ,
ADD COLUMN `desc_short_fr` VARCHAR(255) NOT NULL AFTER `desc_fr`,
ADD COLUMN `weight` TINYINT(3) UNSIGNED NOT NULL AFTER `highlight`,
ADD COLUMN `is_new` TINYINT(1) UNSIGNED NOT NULL AFTER `weight`,
ADD COLUMN `nb_pages` SMALLINT(5) UNSIGNED NOT NULL AFTER `is_new`,
ADD COLUMN `nb_pages_preview` TINYINT(3) UNSIGNED NOT NULL AFTER `nb_pages`,
ADD COLUMN `isbn` VARCHAR(45) NOT NULL AFTER `nb_pages_preview`,
ADD COLUMN `paper` TINYINT(1) UNSIGNED NOT NULL AFTER `isbn`;