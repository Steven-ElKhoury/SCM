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
-- Table structure for table `model`
--

DROP TABLE IF EXISTS `model`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model` (
  `model_id` int NOT NULL AUTO_INCREMENT,
  `price` double NOT NULL,
  `description` varchar(1000) NOT NULL,
  `quantity` int DEFAULT NULL,
  `name` varchar(500) NOT NULL,
  `model_number` varchar(50) NOT NULL,
  `image_url` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `bike_category_id` int DEFAULT NULL,
  PRIMARY KEY (`model_id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `bike_category_id_idx` (`bike_category_id`),
  CONSTRAINT `bike_category_id` FOREIGN KEY (`bike_category_id`) REFERENCES `bike_category` (`bike_category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model`
--

LOCK TABLES `model` WRITE;
/*!40000 ALTER TABLE `model` DISABLE KEYS */;
INSERT INTO `model` VALUES (2,250,'Kids Bicycle',13,'Kids Bicycle 20 inch SY 5-8 Years Old','96','https://thetoystorelb.com/files/base/portal/width/600/height/600/crop/600x600x1/images/products/655425c.jpg',1),(3,2300,'Bike produced by Pure Cycles made for everyday use in the city',18,'Pure Cycles City Bike','9','https://th.bing.com/th/id/R.e9fb7773ed9a74985ea007a381f3a293?rik=RHvzRr8CK3G9Iw&pid=ImgRaw&r=0',7),(17,350,'BMX bike used for freestyling and skateparks',60,'BMX TREK','1','https://th.bing.com/th/id/OIP.XzoEkBG1iRz5p7PM6FBM3QHaEN?rs=1&pid=ImgDetMain',6),(18,1720,'Mountain Bike equipped for rough terrain',20,'Supercaliber SLR 9.9 XTR Gen 2','572359','https://media.trekbikes.com/image/upload/f_auto,fl_progressive:semi,q_auto,w_1920,h_1440,c_pad/SupercaliberSLR99XTR-24-41722-B-Portrait',5);
/*!40000 ALTER TABLE `model` ENABLE KEYS */;
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
