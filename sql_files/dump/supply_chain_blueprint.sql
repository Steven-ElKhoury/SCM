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
-- Table structure for table `blueprint`
--

DROP TABLE IF EXISTS `blueprint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blueprint` (
  `blueprint_id` int NOT NULL AUTO_INCREMENT,
  `model_id` int NOT NULL,
  `component_type_id` int NOT NULL,
  PRIMARY KEY (`blueprint_id`,`model_id`,`component_type_id`),
  KEY `model_id` (`model_id`),
  KEY `component_type_id` (`component_type_id`),
  CONSTRAINT `blueprint_ibfk_1` FOREIGN KEY (`model_id`) REFERENCES `model` (`model_id`),
  CONSTRAINT `blueprint_ibfk_2` FOREIGN KEY (`component_type_id`) REFERENCES `component_type` (`component_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blueprint`
--

LOCK TABLES `blueprint` WRITE;
/*!40000 ALTER TABLE `blueprint` DISABLE KEYS */;
INSERT INTO `blueprint` VALUES (16,2,2),(46,2,2),(47,2,13),(48,2,6),(49,2,8),(50,2,3),(51,2,10),(52,2,10),(53,2,5),(54,2,5),(36,3,11),(37,3,11),(38,3,14),(39,3,6),(40,3,1),(41,3,15),(42,3,9),(43,3,9),(44,3,4),(45,3,4),(19,17,2),(20,17,2),(28,17,13),(29,17,7),(30,17,7),(31,17,3),(32,17,10),(33,17,10),(34,17,5),(35,17,5),(55,18,11),(56,18,11),(57,18,12),(58,18,7),(59,18,8),(60,18,3),(61,18,10),(62,18,10),(63,18,5),(64,18,5);
/*!40000 ALTER TABLE `blueprint` ENABLE KEYS */;
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
