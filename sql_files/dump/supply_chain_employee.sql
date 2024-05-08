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
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `pending` tinyint(1) NOT NULL DEFAULT '0',
  `manager_id` int DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`employee_id`),
  KEY `constraint_name` (`manager_id`),
  CONSTRAINT `constraint_name` FOREIGN KEY (`manager_id`) REFERENCES `manager` (`manager_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `manager` (`manager_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'brazilwinners@gmail.com','$2b$10$hkWaKRtqQ78nWiVQyu9.Cu7OXDxV5a/rv6ou3pqmKYqpM/FWQIJaW',0,1,'messi'),(3,'zakhiazakhia@gmail.com','$2b$10$SBjbYe9W6OQhIpe.cTTXQupIJW4PKgAHqXlUvahZhszVrdQu1ycXu',0,1,'zakhia'),(4,'zakhiasteven@gmail.com','$2b$10$aS51DStN06bKz5Sp7sEyrekWHgjTVIWhCbxbvb4yzStY0tXWFZaIG',0,1,'steven'),(6,'joseph@gmail.com','$2b$10$QkIYrU02OwZzuy5XH49ke.1ki71TQUqd3Qp.FqGJaMD4EYJTDKZcW',0,1,'joseph'),(7,'jack65425@gmail.com','$2b$10$67FpeTT8KWefGofAxHD2r.UtkcZrhHUjX5tjHIas/4Za.P5TXrK12',0,1,'jack'),(8,'ttracy123@gma','$2b$10$6sM7qK6GrkKcpJ9QdgDfq.OiftBUfohVUQ3ww12t04F0herdtSyHy',0,1,'tracy'),(15,'sara525462@gmail.com','$2b$10$UZHoHzRhcHkE.oE/Zwcc5OgAGo42CQ92EMBFOrqPvzMHPlCOXzOsW',0,1,'1'),(20,'zakhia.tayeh@lau.edu','$2b$10$Ef2IOBJyLcRPus8bhxfcSebBBLjeW4mfigyk/L49kM2MOMH361dPy',0,1,'zakhia tayeh'),(21,'steven.elkhoury@lau.edu','$2b$10$cr1GFpdBv9MzQM.fRf0GueSyHlyUll/bb1Oo6NJ6KZ/Sc66CCyjwa',0,1,'steven khoury'),(22,'steven.elkhoury01@lau.edu','$2b$10$Lf7RLPCx3EMPOZSLzTx0KOetclY2ezVPf8nyvMLIaB/QsJLm.KyKe',0,1,'steven khoury');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
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
