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
-- Table structure for table `component_type`
--

DROP TABLE IF EXISTS `component_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `component_type` (
  `component_type_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(1000) NOT NULL,
  `quantity` int DEFAULT '0',
  `description` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `model_number` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `image_url` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `part_category_id` int DEFAULT NULL,
  PRIMARY KEY (`component_type_id`),
  KEY `part_category_id_idx` (`part_category_id`),
  CONSTRAINT `part_category_id` FOREIGN KEY (`part_category_id`) REFERENCES `part_category` (`part_category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `component_type`
--

LOCK TABLES `component_type` WRITE;
/*!40000 ALTER TABLE `component_type` DISABLE KEYS */;
INSERT INTO `component_type` VALUES (1,'Bontrager Verse Short Trail Elite Saddle',871,'Verse Short Elite Trail Saddle takes comfort to the trail with a lightweight yet durable design that offers targeted support for all riders, all genders, and any off-road discipline. The short profile with a full cutout provides lasting comfort and Wing Flex allows the saddle’s edges to flex and adapt to riders’ inner leg movement and pelvic rotation.','5265080','https://media.trekbikes.com/image/upload/f_auto,fl_progressive:semi,q_auto,w_1200,h_900,c_pad/BontragerVerseShortTrailEliteSaddle_35554_A_Primary',5),(2,'Sinter Performance Compound Disc Brake Pads',458,'Sinter organic disc brake pads give friction coefficient performance improvements of up to 44% compared to other brands. The advanced compounds are the result of over 50 years of experience making friction materials in the heart of Europe.\n\nPerformance compound has long pad life even in wet and muddy conditions.','5311056','https://media.trekbikes.com/image/upload/f_auto,fl_progressive:semi,q_auto,w_1200,h_900,c_pad/SinterDiscBrakePadsPerformanceCompound-44543-J-Primary',10),(3,'Bontrager Line Elite 34.9 Dropper Seatpost',214,'A performance dropper post with an larger 34.9mm diameter and updated design with MaxFlow technology for faster, smoother operation. The Line Elite 34.9 Dropper is easy to set up and easier to drop, with 20% less saddle force required. Avid Matchmaker and Shimano I-Spec II compatibility ensures simple, integrated setup and the included lever provides a great feel with an easy push. Length options from 100mm to 200mm travel ensure there is a size for your ride. Designed for bikes with 34.9mm seatpost compatibility.','599394','https://media.trekbikes.com/image/upload/f_auto,fl_progressive:semi,q_auto,w_1200,h_900,c_pad/BontragerLineElite349Dropper_32843_D_Primary',7),(4,'Bontrager Kovee RSL 30 TLR Boost 29 MTB Wheel',640,'Premium-level OCLV Carbon rim with 29mm internal width, 35mm external width, and 22mm depth\nShallow profile and wider inner rim width optimizes compliance and tire support for unmatched ride feel\nWider bead hooks add durability and help protect against pinch flats\nUltra-light DT Swiss 240s hubs with ratchet EXP XD Freehub roll smooth and fast\nBead lock rim design and pre-installed TLR tape and valve makes tubeless setup easy\n','5280108','https://media.trekbikes.com/image/upload/f_auto,fl_progressive:semi,q_auto,w_1440,h_1080,c_pad/BontragerKoveeRSLTLRBoost29MTBWheel_37181_A_Primary',3),(5,'Bontrager Wampa 27.5\" Boost TLR 6-Bolt Disc MTB Wheel',88,'Lightweight Carbon rim (83mm outer, 77mm internal width)\n150X15 front / 197x12 rear\nRear wheel is equipped with SRAM XD driver\nRapid Drive 108 hub instantly transfers effort into forward momentum\nDoes not include skewer, reflector, rim strip, valve, or owner\'s manual\nWheels shipped as photographed','574453','https://media.trekbikes.com/image/upload/f_auto,fl_progressive:semi,q_auto,w_1200,h_900,c_pad/Wampa275_14075_C_Primary',3),(6,'Trek Line Elite Flat Pedal Set',629,'Pedal with shoe gripper','853642','https://media.trekbikes.com/image/upload/w_800,h_600,c_pad,f_auto,fl_progressive:semi,q_auto/TrekLineEliteFlatPedal-41409-G-Primary',14),(7,'Bontrager Road Clipless 6 Degree Pedal Clean Set',355,'Clipless Pedal that makes mounting the bike easier','854662','https://media.trekbikes.com/image/upload/w_800,h_600,c_pad,f_auto,fl_progressive:semi,q_auto/BontragerRoadCliplessPedalCleats_27132_B_Primary',14),(8,'Bontrager Boulevard Fluid Bike Saddle',474,'Fluid Saddle for extra comfort','855634','https://media.trekbikes.com/image/upload/w_800,h_600,c_pad,f_auto,fl_progressive:semi,q_auto/BontragerBoulevardFluid_23594_A_Primary',5),(9,'Bontrager AW3 Hard-Case Lite Reflective Road Tyre',1140,'Elite Speed Tyre','854721','https://media.trekbikes.com/image/upload/f_auto,fl_progressive:semi,q_auto,w_1920,h_1440,c_pad/BontragerAW3HardCaseLiteReflective_36071_A_Primary',13),(10,'Bontrager Connection Comp Hard-Case MTB Tyre',1288,'All Terrain Tyre','853279','https://media.trekbikes.com/image/upload/f_auto,fl_progressive:semi,q_auto,w_1920,h_1440,c_pad/BontragerConnectionCompHardCase-44485-A-Primary',13),(11,'Sinter Race Compound Disc Brake Pads',2470,'Sinter Shimano Brake','863279','https://media.trekbikes.com/image/upload/f_auto,fl_progressive:semi,q_auto,w_1920,h_1440,c_pad/SinterDiscBrakePadsRaceCompound-44544-L-Primary',10),(12,'Rocky Mountain Frame',2215,'Frame for mountain bike setup','915732','https://upload.wikimedia.org/wikipedia/commons/0/0e/Bicycle_frame_mtb_hardtail.jpg',11),(13,'BMX X42 Frame',1781,'Frame for BMX Setup','261579','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrZ8K44X5cI-npiRytaEFGVhC0d9VVTkCxaOvz_uq9qA&s',11),(14,'Twitter Road Frame',2770,'Frame for Road Bike Setup','472935','https://m.media-amazon.com/images/I/51iJO8NsRJL._AC_UF894,1000_QL80_DpWeblab_.jpg',11),(15,'Trek Colour-Matched Matte Carbon Seat Mast Cap & 7 mm Round Ears',970,'Seat Post for road bike setup','726284','https://media.trekbikes.com/image/upload/f_auto,fl_progressive:semi,q_auto,w_1920,h_1440,c_pad/TrekColorMatchedMatteCarbonSeatMastCap7mmRoundEars_34015_C_Primary',7);
/*!40000 ALTER TABLE `component_type` ENABLE KEYS */;
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
