CREATE TABLE IF NOT EXISTS `books_payments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `payment_id` VARCHAR(255) NOT NULL,
  `book_id` INT UNSIGNED NOT NULL,
  `customer_email` VARCHAR(255) NOT NULL,
  `nb_downloads` MEDIUMINT UNSIGNED NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `books_payments_payment_id` (`payment_id` ASC))
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci
ENGINE = InnoDB;