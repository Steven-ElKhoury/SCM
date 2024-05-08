-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: supply_chain
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `byproduct_storage`
--

DROP TABLE IF EXISTS `byproduct_storage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `byproduct_storage` (
  `byproduct_storage_id` int NOT NULL AUTO_INCREMENT,
  `byproduct_storage_name` varchar(50) DEFAULT NULL,
  `byproduct_storage_capacity` int DEFAULT NULL,
  `byproduct_storage_size` double DEFAULT NULL,
  `byproduct_storage_current_stock` int DEFAULT NULL,
  `bike_category_id` int DEFAULT NULL,
  PRIMARY KEY (`byproduct_storage_id`),
  KEY `bike_category_id_idx` (`bike_category_id`),
  CONSTRAINT `fk_bike_category_id` FOREIGN KEY (`bike_category_id`) REFERENCES `bike_category` (`bike_category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `byproduct_storage`
--

LOCK TABLES `byproduct_storage` WRITE;
/*!40000 ALTER TABLE `byproduct_storage` DISABLE KEYS */;
INSERT INTO `byproduct_storage` VALUES (8,'Kids Bike Storage',1000,1000,13,1),(9,'E-bike storage',800,1000,50,3),(10,'Road-bike storage',1000,1200,0,4),(11,'Mountain-bike storage',1000,1500,20,5),(12,'BMX storage A',150,200,0,6),(13,'BMX storage B',200,300,10,6),(14,'City-bike storage',500,600,18,7);
/*!40000 ALTER TABLE `byproduct_storage` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-08  3:11:11
