DROP TABLE IF EXISTS `backupCars`;

CREATE TABLE `backupCars` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('GO','XL','Premium') NOT NULL,
  `name` varchar(255) NOT NULL,
  `make` int NOT NULL,
  `fuelType` enum('Diesel','Petrol','Electric','Hybrid') NOT NULL,
  `rentalRate` decimal(10,0) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
);


CREATE TRIGGER `backupCars` AFTER DELETE ON `cars` for each
ROW INSERT INTO `backupCars` VALUES(old.id,old.type,old.name,old.make,
old.fuelType,old.rentalRate,old.createdAt,old.userId);