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
  `employee_has_sidework_history_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `work_type` int(11) DEFAULT NULL COMMENT '1 = ไซด์งาน, 2 = OT',
  PRIMARY KEY (`employee_has_sidework_history_id`,`employee_id`),
  KEY `fk_employee_has_sidework_history_employee_idx` (`employee_id`),
  KEY `fk_employee_has_sidework_history_work_project1_idx` (`work_type`),
  CONSTRAINT `fk_employee_has_sidework_history_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id_employee`),
  CONSTRAINT `fk_worktype` FOREIGN KEY (`work_type`) REFERENCES `worktype` (`id_work_type`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_has_sidework_history`
--

LOCK TABLES `employee_has_sidework_history` WRITE;
/*!40000 ALTER TABLE `employee_has_sidework_history` DISABLE KEYS */;
INSERT INTO `employee_has_sidework_history` VALUES (103,1,1),(105,1,1),(107,1,1),(108,1,1),(114,1,1),(115,1,1),(116,1,1),(117,1,1),(118,1,1),(119,1,1),(104,1,2),(106,1,2),(109,1,2),(110,1,2),(111,1,2),(112,1,2),(113,1,2),(120,1,2);
/*!40000 ALTER TABLE `employee_has_sidework_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ot_history`
--

DROP TABLE IF EXISTS `ot_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ot_history` (
  `id_ot_history` int(11) NOT NULL AUTO_INCREMENT,
  `employee_has_sidework_history_id` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `remark` varchar(45) DEFAULT NULL,
  `last_update_time` datetime NOT NULL,
  `id_project` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_ot_history`),
  KEY `fk_employee_has_sidework_history_employee_idx` (`employee_has_sidework_history_id`),
  CONSTRAINT `fk side_employeehas0` FOREIGN KEY (`employee_has_sidework_history_id`) REFERENCES `employee_has_sidework_history` (`employee_has_sidework_history_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ot_history`
--

LOCK TABLES `ot_history` WRITE;
/*!40000 ALTER TABLE `ot_history` DISABLE KEYS */;
INSERT INTO `ot_history` VALUES (73,104,'3106-03-24 15:26:00','3106-03-25 15:27:00','abc','2563-04-02 14:21:31','kp'),(74,104,'2563-03-24 15:26:52','2563-03-25 15:27:07','uf','2563-03-18 15:27:13','kp'),(75,106,'2563-03-19 13:51:16','2563-03-19 13:51:17',NULL,'2563-03-19 13:51:20','asd'),(85,120,'2563-04-02 12:25:07','2563-04-02 12:25:10',NULL,'2563-04-02 12:25:13','abc'),(86,120,'2563-04-02 12:25:07','2563-04-02 12:25:10',NULL,'2563-04-02 12:25:13','abc');
/*!40000 ALTER TABLE `ot_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sidework_history`
--

DROP TABLE IF EXISTS `sidework_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sidework_history` (
  `id_sidework_history` int(11) NOT NULL AUTO_INCREMENT,
  `employee_has_sidework_history_id` int(11) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time DEFAULT NULL,
  `work_comment` varchar(45) DEFAULT NULL,
  `last_update_time` datetime NOT NULL,
  `work_anywhere` tinyint(4) DEFAULT NULL,
  `day` date DEFAULT NULL,
  PRIMARY KEY (`id_sidework_history`),
  KEY `fk_employee_has_sidework_history_employee_idx` (`employee_has_sidework_history_id`),
  CONSTRAINT `fk side_employeehas` FOREIGN KEY (`employee_has_sidework_history_id`) REFERENCES `employee_has_sidework_history` (`employee_has_sidework_history_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sidework_history`
--

LOCK TABLES `sidework_history` WRITE;
/*!40000 ALTER TABLE `sidework_history` DISABLE KEYS */;
INSERT INTO `sidework_history` VALUES (53,118,'10:00:00','15:00:00','a','2563-03-31 14:36:59',1,'2563-03-31');
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
INSERT INTO `work_project` VALUES (1,'t001');
/*!40000 ALTER TABLE `work_project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `worktype`
--

DROP TABLE IF EXISTS `worktype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `worktype` (
  `id_work_type` int(11) NOT NULL,
  `work_type_name` varchar(45) NOT NULL,
  PRIMARY KEY (`id_work_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `worktype`
--

LOCK TABLES `worktype` WRITE;
/*!40000 ALTER TABLE `worktype` DISABLE KEYS */;
INSERT INTO `worktype` VALUES (1,'SideWork'),(2,'OT');
/*!40000 ALTER TABLE `worktype` ENABLE KEYS */;
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

-- Dump completed on 2020-04-21 14:04:49
