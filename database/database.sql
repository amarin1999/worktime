CREATE DATABASE  IF NOT EXISTS `worktime` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `worktime`;
-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: worktime
-- ------------------------------------------------------
-- Server version	5.5.62

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
  `id_employee` int(11) NOT NULL AUTO_INCREMENT,
  `employee_no` varchar(45) NOT NULL,
  `firstname` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  PRIMARY KEY (`id_employee`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'t005','test','test');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_has_sidework_history`
--

DROP TABLE IF EXISTS `employee_has_sidework_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_has_sidework_history` (
  `employee_id` int(11) NOT NULL,
  `sidework_history_id` int(11) NOT NULL,
  `work_type` enum('1','2') NOT NULL COMMENT '1 = ไซด์งาน, 2 = OT',
  `work_project_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`employee_id`,`sidework_history_id`),
  KEY `fk_employee_has_sidework_history_sidework_history1_idx` (`sidework_history_id`),
  KEY `fk_employee_has_sidework_history_employee_idx` (`employee_id`),
  KEY `fk_employee_has_sidework_history_work_project1_idx` (`work_project_id`),
  CONSTRAINT `fk_employee_has_sidework_history_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id_employee`),
  CONSTRAINT `fk_employee_has_sidework_history_sidework_history1` FOREIGN KEY (`sidework_history_id`) REFERENCES `sidework_history` (`id_sidework_history`),
  CONSTRAINT `fk_employee_has_sidework_history_work_project1` FOREIGN KEY (`work_project_id`) REFERENCES `work_project` (`id_work_project`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_has_sidework_history`
--

LOCK TABLES `employee_has_sidework_history` WRITE;
/*!40000 ALTER TABLE `employee_has_sidework_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee_has_sidework_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sidework_history`
--

DROP TABLE IF EXISTS `sidework_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sidework_history` (
  `id_sidework_history` int(11) NOT NULL AUTO_INCREMENT,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `work_comment` varchar(45) NOT NULL,
  `last_update_time` datetime NOT NULL,
  PRIMARY KEY (`id_sidework_history`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sidework_history`
--

LOCK TABLES `sidework_history` WRITE;
/*!40000 ALTER TABLE `sidework_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `sidework_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `work_project`
--

DROP TABLE IF EXISTS `work_project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work_project` (
  `id_work_project` int(11) NOT NULL,
  `project_no` varchar(8) NOT NULL,
  PRIMARY KEY (`id_work_project`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `work_project`
--

LOCK TABLES `work_project` WRITE;
/*!40000 ALTER TABLE `work_project` DISABLE KEYS */;
/*!40000 ALTER TABLE `work_project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'worktime'
--

--
-- Dumping routines for database 'worktime'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-03-09 11:12:29
