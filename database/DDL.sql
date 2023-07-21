-- Team members: Tongxin Sun, Tran Tran
-- Project Title: Travelnet

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- -----------------------------------------------------
-- Table `Locations`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Locations` (
  `location_id` INT NOT NULL AUTO_INCREMENT,
  `address` VARCHAR(255) NOT NULL,
  `city` VARCHAR(255) NOT NULL,
  `state` VARCHAR(255) NOT NULL,
  `zip_code` VARCHAR(45) NOT NULL,
  `country` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`location_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Users`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB;



-- -----------------------------------------------------
-- Table `Posts`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Posts` (
  `post_id` INT NOT NULL AUTO_INCREMENT,
  `content` MEDIUMTEXT NULL,
  `access` ENUM('Public', 'Public to friends', 'Private') NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`post_id`),
  UNIQUE INDEX `post_id_UNIQUE` (`post_id` ASC) VISIBLE,
  INDEX `fk_Posts_Users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_Posts_Users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `Users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Friendships`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Friendships` (
  `friendship_id` INT NOT NULL AUTO_INCREMENT,
  `start_date` DATE NOT NULL,
  `mutual_friend_ct` INT UNSIGNED NOT NULL,
  `user_id` INT NOT NULL,
  `friend_user_id` INT NOT NULL,
  PRIMARY KEY (`friendship_id`),
  INDEX `fk_Friendships_Users1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_Friendships_Users2_idx` (`friend_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_Friendships_Users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `Users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Friendships_Users2`
    FOREIGN KEY (`friend_user_id`)
    REFERENCES `Users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Posts_has_Locations`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Posts_has_Locations` (
  `location_id` INT NOT NULL,
  `post_id` INT NOT NULL,
  PRIMARY KEY (`location_id`, `post_id`),
  INDEX `fk_Locations_has_Posts_Posts1_idx` (`post_id` ASC) VISIBLE,
  INDEX `fk_Locations_has_Posts_Locations1_idx` (`location_id` ASC) VISIBLE,
  CONSTRAINT `fk_Locations_has_Posts_Locations1`
    FOREIGN KEY (`location_id`)
    REFERENCES `Locations` (`location_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Locations_has_Posts_Posts1`
    FOREIGN KEY (`post_id`)
    REFERENCES `Posts` (`post_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Posts_has_Friendships`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Posts_has_Friendships` (
  `post_id` INT NOT NULL,
  `friendship_id` INT NOT NULL,
  PRIMARY KEY (`post_id`, `friendship_id`),
  INDEX `fk_Posts_has_Friendship_Friendship1_idx` (`friendship_id` ASC) VISIBLE,
  INDEX `fk_Posts_has_Friendship_Posts1_idx` (`post_id` ASC) VISIBLE,
  CONSTRAINT `fk_Posts_has_Friendship_Posts1`
    FOREIGN KEY (`post_id`)
    REFERENCES `Posts` (`post_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Posts_has_Friendship_Friendship1`
    FOREIGN KEY (`friendship_id`)
    REFERENCES `Friendships` (`friendship_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Users_has_Locations`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Users_has_Locations` (
  `user_id` INT NOT NULL,
  `location_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `location_id`),
  INDEX `fk_Users_has_Locations_Locations1_idx` (`location_id` ASC) VISIBLE,
  INDEX `fk_Users_has_Locations_Users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_Users_has_Locations_Users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `Users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Users_has_Locations_Locations1`
    FOREIGN KEY (`location_id`)
    REFERENCES `Locations` (`location_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

INSERT INTO `Users` (`user_name`, `email`, `password`) VALUES ('mary563', 'mary563@gmailcom', '1937@#fadf');
INSERT INTO `Users` (`user_name`, `email`, `password`) VALUES ('toub8294', 'toub8294@gmailcom', 'hfkd0)jf!');
INSERT INTO `Users` (`user_name`, `email`, `password`) VALUES ('pwune0921', 'pwune0921@gmailcom', '9384**&fafd');
INSERT INTO `Users` (`user_name`, `email`, `password`) VALUES ('jimmyt801', 'jimmyt801@outlookcom', '8394*fhfkd');

INSERT INTO `Friendships` (`start_date`, `mutual_friend_ct`, `user_id`, `friend_user_id`) VALUES ('2019-01-09', '0', '1', '2');
INSERT INTO `Friendships` (`start_date`, `mutual_friend_ct`, `user_id`, `friend_user_id`) VALUES ('2009-11-19', '0', '1', '3');
INSERT INTO `Friendships` (`start_date`, `mutual_friend_ct`, `user_id`, `friend_user_id`) VALUES ('2023-08-29', '1', '2', '3');

INSERT INTO `Locations` (`address`, `city`, `state`, `zip_code`, `country`) VALUES ('57434 Paucek Meadow, Suite 978', 'Efrainchester', 'Missouri', '99566-5220', 'United States');
INSERT INTO `Locations` (`address`, `city`, `state`, `zip_code`, `country`) VALUES ('9088 Shanahan Groves, Suite 697', 'Pfannerstillhaven', 'Wisconsin', '97929', 'United States');
INSERT INTO `Locations` (`address`, `city`, `state`, `zip_code`, `country`) VALUES ('Kpg Connor no 96, Apt 119', 'Batu', 'DKI Jakarta', '11840', 'Indonesia');
INSERT INTO `Locations` (`address`, `city`, `state`, `zip_code`, `country`) VALUES ('Strada Caterina 779, Appartamento 61', 'Santarelli veneto', 'Lucca', '43917', 'Italy');
INSERT INTO `Locations` (`address`, `city`, `state`, `zip_code`, `country`) VALUES ('76941 Vũ Inlet, Suite 164', 'Cao Bằng', 'Missouri', '86668', 'Vietnam');

INSERT INTO `Posts` (`content`, `access`, `user_id`) VALUES ('I love the city!', 'Public', '1');
INSERT INTO `Posts` (`content`, `access`, `user_id`) VALUES ('I like the place! Look at it!!!', 'Public to friends', '1');
INSERT INTO `Posts` (`content`, `access`, `user_id`) VALUES ("Don't come! It's not worth the time!", 'Private', '4');
INSERT INTO `Posts` (`content`, `access`, `user_id`) VALUES ('Great park!', 'Public', '2');
INSERT INTO `Posts` (`content`, `access`, `user_id`) VALUES ('Wow!!!!!', 'Public to friends', '4');

INSERT INTO `Posts_has_Friendships` (`post_id`, `friendship_id`) VALUES ('1', '1');
INSERT INTO `Posts_has_Friendships` (`post_id`, `friendship_id`) VALUES ('1', '2');
INSERT INTO `Posts_has_Friendships` (`post_id`, `friendship_id`) VALUES ('2', '2');

INSERT INTO `Posts_has_Locations` (`location_id`, `post_id`) VALUES ('1', '1');
INSERT INTO `Posts_has_Locations` (`location_id`, `post_id`) VALUES ('1', '2');
INSERT INTO `Posts_has_Locations` (`location_id`, `post_id`) VALUES ('2', '2');
INSERT INTO `Posts_has_Locations` (`location_id`, `post_id`) VALUES ('3', '2');

INSERT INTO `Users_has_Locations` (`user_id`, `location_id`) VALUES ('1', '1');
INSERT INTO `Users_has_Locations` (`user_id`, `location_id`) VALUES ('1', '2');
INSERT INTO `Users_has_Locations` (`user_id`, `location_id`) VALUES ('2', '1');
INSERT INTO `Users_has_Locations` (`user_id`, `location_id`) VALUES ('3', '3');

/*
SELECT * FROM Posts;
SELECT * FROM Friendships;
SELECT * FROM Users;
SELECT * FROM Locations;
SELECT * FROM Posts_has_Friendships;
SELECT * FROM Posts_has_Locations;
SELECT * FROM Users_has_Locations;
*/

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
