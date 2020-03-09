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
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'t005','test','test');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `employee_has_sidework_history`
--

LOCK TABLES `employee_has_sidework_history` WRITE;
/*!40000 ALTER TABLE `employee_has_sidework_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee_has_sidework_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `sidework_history`
--

LOCK TABLES `sidework_history` WRITE;
/*!40000 ALTER TABLE `sidework_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `sidework_history` ENABLE KEYS */;
UNLOCK TABLES;

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

-- Dump completed on 2020-03-09  9:30:25
