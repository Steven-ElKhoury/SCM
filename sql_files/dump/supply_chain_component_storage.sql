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
-- Table structure for table `component_storage`
--

DROP TABLE IF EXISTS `component_storage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `component_storage` (
  `component_storage_id` int NOT NULL AUTO_INCREMENT,
  `component_storage_capacity` int DEFAULT NULL,
  `component_storage_name` varchar(50) DEFAULT NULL,
  `component_storage_size` double DEFAULT NULL,
  `component_storage_current_stock` int DEFAULT NULL,
  `part_category_id` int DEFAULT NULL,
  PRIMARY KEY (`component_storage_id`),
  KEY `fk_part_category_id_idx` (`part_category_id`),
  CONSTRAINT `fk_part_category_id` FOREIGN KEY (`part_category_id`) REFERENCES `part_category` (`part_category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `component_storage`
--

LOCK TABLES `component_storage` WRITE;
/*!40000 ALTER TABLE `component_storage` DISABLE KEYS */;
INSERT INTO `component_storage` VALUES (9,2000,'Seatpost\'s Warehouse',600,1204,7),(10,2000,'Brake\'s warehouse',600,1808,10),(11,2000,'Pedal\'s Warehouse',600,1024,14),(12,2000,'Frame\'s Warehouse',600,2000,11),(13,2000,'Saddle\'s Warehouse',400,1345,5),(14,2000,'Tyre\'s Warehouse',200,1508,13),(15,2000,'Wheel\'s',250,768,3);
/*!40000 ALTER TABLE `component_storage` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-08  3:11:10
