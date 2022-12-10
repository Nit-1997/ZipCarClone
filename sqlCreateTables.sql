CREATE DATABASE  IF NOT EXISTS `zipcar` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `zipcar`;
-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: zipcar
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cars`
--

DROP TABLE IF EXISTS `cars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cars` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('GO','XL','Premium') NOT NULL,
  `name` varchar(255) NOT NULL,
  `make` int NOT NULL,
  `fuelType` enum('Diesel','Petrol','Electric','Hybrid') NOT NULL,
  `rentalRate` decimal(10,0) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `cars_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cars`
--

LOCK TABLES `cars` WRITE;
/*!40000 ALTER TABLE `cars` DISABLE KEYS */;
/*!40000 ALTER TABLE `cars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incidents`
--

DROP TABLE IF EXISTS `incidents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incidents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `severity` enum('P1','P2','P3') NOT NULL,
  `resolution` varchar(255) NOT NULL,
  `state` enum('RESOLVED','RAISED','ASSIGNED','NOT_ASSIGNED') NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `leaseOrderId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `leaseOrderId` (`leaseOrderId`),
  KEY `userId` (`userId`),
  CONSTRAINT `incidents_ibfk_1` FOREIGN KEY (`leaseOrderId`) REFERENCES `leaseorders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `incidents_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incidents`
--

LOCK TABLES `incidents` WRITE;
/*!40000 ALTER TABLE `incidents` DISABLE KEYS */;
/*!40000 ALTER TABLE `incidents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventories`
--

DROP TABLE IF EXISTS `inventories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `zipcode` int NOT NULL,
  `status` enum('AVAILABLE','BOOKED','UNDER_MAINTENANCE') NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `pickupStationId` int DEFAULT NULL,
  `carId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pickupStationId` (`pickupStationId`),
  KEY `carId` (`carId`),
  CONSTRAINT `inventories_ibfk_1` FOREIGN KEY (`pickupStationId`) REFERENCES `pickupstations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `inventories_ibfk_2` FOREIGN KEY (`carId`) REFERENCES `cars` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventories`
--

LOCK TABLES `inventories` WRITE;
/*!40000 ALTER TABLE `inventories` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leaseorders`
--

DROP TABLE IF EXISTS `leaseorders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leaseorders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` enum('completed','ongoing','failed') NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `inventoryId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inventoryId` (`inventoryId`),
  KEY `userId` (`userId`),
  CONSTRAINT `leaseorders_ibfk_1` FOREIGN KEY (`inventoryId`) REFERENCES `inventories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `leaseorders_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leaseorders`
--

LOCK TABLES `leaseorders` WRITE;
/*!40000 ALTER TABLE `leaseorders` DISABLE KEYS */;
/*!40000 ALTER TABLE `leaseorders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `state` enum('PROCESSING','SUCCESS','FAILED') NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `leaseOrderId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `leaseOrderId` (`leaseOrderId`),
  KEY `userId` (`userId`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`leaseOrderId`) REFERENCES `leaseorders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pickupstations`
--

DROP TABLE IF EXISTS `pickupstations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pickupstations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `zipcode` int NOT NULL,
  `address` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pickupstations`
--

LOCK TABLES `pickupstations` WRITE;
/*!40000 ALTER TABLE `pickupstations` DISABLE KEYS */;
/*!40000 ALTER TABLE `pickupstations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20221209211339_mega_migration.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('owner','client') NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-09 16:15:27
