-- --------------------------------------------------------------------
-- MySQL/MariaDB
-- --------------------------------------------------------------------
-- 
-- use `database-name`;
;

-- Create table success_events_p0 for requests w/o mandatory parameters
CREATE TABLE `success_events_p0` (
  `id` INT NOT NULL AUTO_INCREMENT, 
  `server_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(), 
  `country_code` CHAR(2) NOT NULL,
  `ip_address` VARCHAR(45) NOT NULL, 
  `browser` VARCHAR(255) NOT NULL, 
  `event_code` INT(4) NOT NULL,
  `endpoint` VARCHAR(255) NOT NULL,
  `request_uri` VARCHAR(255) NOT NULL, 
  `params` VARCHAR(255) NOT NULL, 
  PRIMARY KEY (`id`)
) CHARACTER SET = utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create table success_events_p1 for requests w/ mandatory parameters
-- TODO


-- Create table test_events for tests
-- TODO


-- Create table e404
CREATE TABLE `e404` (
  `id` INT NOT NULL AUTO_INCREMENT, 
  `server_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
  `country_code` CHAR(2) NOT NULL,
  `ip_address` VARCHAR(45) NOT NULL, 
  `browser` VARCHAR(255) NOT NULL, 
  `error_code` INT(4) NOT NULL, 
  `request_secure` BOOLEAN NOT NULL DEFAULT TRUE, 
  `request_host` VARCHAR(30) NOT NULL,
  `request_uri` VARCHAR(255) NOT NULL, 
  PRIMARY KEY (`id`)
) CHARACTER SET = utf8mb4 COLLATE utf8mb4_unicode_ci;


-- Create procedure to save success_events_p0 log
DELIMITER $$
CREATE OR REPLACE PROCEDURE `asze_success_events_p0_add`(
  IN `country_code` CHAR(2), 
  IN `ip_address` VARCHAR(45), 
  IN `browser` VARCHAR(255), 
  IN `event_code` INT(4),
  IN `endpoint` VARCHAR(255), 
  IN `request_uri` VARCHAR(255), 
  IN `params` VARCHAR(255)
) MODIFIES SQL DATA
BEGIN
SET time_zone = '+02:00';
INSERT INTO success_events_p0(server_time, country_code, ip_address, browser, event_code, endpoint, request_uri, params) 
VALUES(CURRENT_TIMESTAMP, country_code, ip_address, browser, event_code, endpoint, request_uri, params);
END $$
DELIMITER ;


-- Create procedure to save success_events_p1 log // recheck & test b4 use
-- TODO


-- Create procedure to save 404 errors
DELIMITER $$
CREATE OR REPLACE PROCEDURE `asze_e404_add`(
  IN `country_code` CHAR(2), 
  IN `ip_address` VARCHAR(45), 
  IN `browser` VARCHAR(255),
  IN `error_code` INT(4),  
  IN `request_secure` BOOLEAN, 
  IN `request_host` VARCHAR(30), 
  IN `request_uri` VARCHAR(255)
) MODIFIES SQL DATA
BEGIN
SET time_zone = '+02:00';
INSERT INTO e404(server_time, country_code, ip_address, browser, error_code, request_secure, request_host, request_uri) 
VALUES(CURRENT_TIMESTAMP, country_code, ip_address, browser, error_code, request_secure, request_host, request_uri);
END $$
DELIMITER ;

-- --------------------------------------------------------------------
