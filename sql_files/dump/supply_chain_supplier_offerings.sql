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
-- Table structure for table `supplier_offerings`
--

DROP TABLE IF EXISTS `supplier_offerings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_offerings` (
  `offering_id` int NOT NULL AUTO_INCREMENT,
  `price` int NOT NULL,
  `lead_time` int NOT NULL,
  `supplier_id` int NOT NULL,
  `component_type_id` int NOT NULL,
  PRIMARY KEY (`offering_id`,`supplier_id`,`component_type_id`),
  KEY `supplier_id` (`supplier_id`),
  KEY `component_type_id` (`component_type_id`),
  CONSTRAINT `supplier_offerings_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`supplier_id`),
  CONSTRAINT `supplier_offerings_ibfk_2` FOREIGN KEY (`component_type_id`) REFERENCES `component_type` (`component_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_offerings`
--

LOCK TABLES `supplier_offerings` WRITE;
/*!40000 ALTER TABLE `supplier_offerings` DISABLE KEYS */;
INSERT INTO `supplier_offerings` VALUES (1,50,2,1,2),(2,60,5,1,1),(3,80,3,2,1),(4,20,5,3,1),(5,600,2,4,5),(6,30,2,5,3),(7,20,4,6,4),(8,15,3,7,5),(9,10,3,8,6),(10,30,6,9,7),(11,20,3,10,8),(12,30,2,11,9),(13,10,7,12,10),(14,13,5,13,11),(15,15,4,14,12),(16,40,4,15,13),(17,20,5,16,14),(18,20,5,17,15);
/*!40000 ALTER TABLE `supplier_offerings` ENABLE KEYS */;
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
