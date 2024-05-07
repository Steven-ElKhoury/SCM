-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: supply_chain
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `produced_byproduct`
--

DROP TABLE IF EXISTS `produced_byproduct`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produced_byproduct` (
  `byproduct_id` int NOT NULL AUTO_INCREMENT,
  `model_id` int NOT NULL,
  `cus_orderID` int DEFAULT NULL,
  `sold` int DEFAULT '0',
  `byproduct_storage_id` int DEFAULT NULL,
  PRIMARY KEY (`byproduct_id`),
  KEY `model_id` (`model_id`),
  KEY `fk_cus_orderID` (`cus_orderID`),
  KEY `byproduct_storage_id_idx` (`byproduct_storage_id`),
  CONSTRAINT `byproduct_storage_id` FOREIGN KEY (`byproduct_storage_id`) REFERENCES `byproduct_storage` (`byproduct_storage_id`),
  CONSTRAINT `fk_cus_orderID` FOREIGN KEY (`cus_orderID`) REFERENCES `customer_order` (`cust_order_id`),
  CONSTRAINT `produced_byproduct_ibfk_1` FOREIGN KEY (`model_id`) REFERENCES `model` (`model_id`)
) ENGINE=InnoDB AUTO_INCREMENT=231 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produced_byproduct`
--

LOCK TABLES `produced_byproduct` WRITE;
/*!40000 ALTER TABLE `produced_byproduct` DISABLE KEYS */;
/*!40000 ALTER TABLE `produced_byproduct` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-07 20:38:22
