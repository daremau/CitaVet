-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: citavet
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `citas`
--

DROP TABLE IF EXISTS `citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citas` (
  `IdCita` bigint unsigned NOT NULL AUTO_INCREMENT,
  `FechaHora` datetime NOT NULL,
  `IdCliente` bigint unsigned NOT NULL,
  `IdMascota` bigint unsigned NOT NULL,
  `IdServicio` bigint unsigned NOT NULL,
  `Estado` enum('Pendiente','Confirmada','Completado') NOT NULL DEFAULT 'Pendiente',
  `NotasCliente` text,
  PRIMARY KEY (`IdCita`),
  UNIQUE KEY `IdCita` (`IdCita`),
  KEY `IdCliente` (`IdCliente`),
  KEY `IdMascota` (`IdMascota`),
  KEY `FK_Citas_Servicios` (`IdServicio`),
  CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`IdCliente`) REFERENCES `clientes` (`IdCliente`),
  CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`IdMascota`) REFERENCES `mascotas` (`IdMascota`),
  CONSTRAINT `FK_Citas_Servicios` FOREIGN KEY (`IdServicio`) REFERENCES `servicios` (`IdServicio`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas`
--

LOCK TABLES `citas` WRITE;
/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
INSERT INTO `citas` VALUES (2,'2024-11-25 10:00:00',1,4,1,'Completado',NULL),(3,'2024-11-26 15:30:00',1,5,2,'Completado',NULL),(31,'2024-12-20 14:00:00',1,4,1,'Completado',NULL),(32,'2024-12-16 16:00:00',1,13,1,'Pendiente',NULL),(33,'2024-12-13 16:30:00',2,12,3,'Pendiente',NULL);
/*!40000 ALTER TABLE `citas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `IdCliente` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) DEFAULT NULL,
  `Direccion` varchar(100) DEFAULT NULL,
  `Telefono` varchar(15) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `IdUsuario` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`IdCliente`),
  UNIQUE KEY `IdCliente` (`IdCliente`),
  KEY `FK_Clientes_Usuarios` (`IdUsuario`),
  CONSTRAINT `FK_Clientes_Usuarios` FOREIGN KEY (`IdUsuario`) REFERENCES `usuarios` (`IdUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Cliente 1','Calle Ejemplo 123','555123456','cliente1@example.com',2),(2,'Cliente 2','Avenida Prueba 456','555654321','cliente2@example.com',6);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detallefactura`
--

DROP TABLE IF EXISTS `detallefactura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detallefactura` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_factura` int NOT NULL,
  `tipo_pago` enum('Efectivo','Tarjeta','Transferencia','Otros') NOT NULL,
  `id_producto` int DEFAULT NULL,
  `id_servicio` bigint unsigned DEFAULT NULL,
  `cantidad` int NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_factura` (`id_factura`),
  KEY `id_producto` (`id_producto`),
  KEY `id_servicio` (`id_servicio`),
  CONSTRAINT `detallefactura_ibfk_1` FOREIGN KEY (`id_factura`) REFERENCES `factura` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detallefactura_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`IdProducto`) ON DELETE SET NULL,
  CONSTRAINT `detallefactura_ibfk_3` FOREIGN KEY (`id_servicio`) REFERENCES `servicios` (`IdServicio`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallefactura`
--

LOCK TABLES `detallefactura` WRITE;
/*!40000 ALTER TABLE `detallefactura` DISABLE KEYS */;
/*!40000 ALTER TABLE `detallefactura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `factura`
--

DROP TABLE IF EXISTS `factura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `factura` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero` varchar(50) NOT NULL,
  `fecha` date NOT NULL,
  `razon_social` varchar(255) NOT NULL,
  `ruc` varchar(20) NOT NULL,
  `monto_total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `factura`
--

LOCK TABLES `factura` WRITE;
/*!40000 ALTER TABLE `factura` DISABLE KEYS */;
/*!40000 ALTER TABLE `factura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mascotas`
--

DROP TABLE IF EXISTS `mascotas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mascotas` (
  `IdMascota` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) DEFAULT NULL,
  `Tipo` enum('Perro','Gato') NOT NULL,
  `Raza` varchar(30) DEFAULT NULL,
  `IdCliente` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`IdMascota`),
  UNIQUE KEY `IdMascota` (`IdMascota`),
  KEY `IdCliente` (`IdCliente`),
  CONSTRAINT `mascotas_ibfk_1` FOREIGN KEY (`IdCliente`) REFERENCES `clientes` (`IdCliente`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mascotas`
--

LOCK TABLES `mascotas` WRITE;
/*!40000 ALTER TABLE `mascotas` DISABLE KEYS */;
INSERT INTO `mascotas` VALUES (4,'Firu','Perro','Pastor Alemán',1),(5,'Michi','Gato','Siames',1),(11,'Ramon','Perro','Beagle',2),(12,'Ramon Jr','Perro','Beagle',2),(13,'Michifus','Gato','Persa',1);
/*!40000 ALTER TABLE `mascotas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personaldelivery`
--

DROP TABLE IF EXISTS `personaldelivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personaldelivery` (
  `IdPersonalDelivery` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) DEFAULT NULL,
  `Telefono` varchar(15) DEFAULT NULL,
  `Direccion` varchar(100) DEFAULT NULL,
  `IdUsuario` bigint unsigned DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`IdPersonalDelivery`),
  UNIQUE KEY `IdPersonalDelivery` (`IdPersonalDelivery`),
  KEY `FK_PersonalDelivery_Usuarios` (`IdUsuario`),
  CONSTRAINT `FK_PersonalDelivery_Usuarios` FOREIGN KEY (`IdUsuario`) REFERENCES `usuarios` (`IdUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personaldelivery`
--

LOCK TABLES `personaldelivery` WRITE;
/*!40000 ALTER TABLE `personaldelivery` DISABLE KEYS */;
INSERT INTO `personaldelivery` VALUES (1,'Juan Pérez','5551234567','Av. Principal 123',10,NULL);
/*!40000 ALTER TABLE `personaldelivery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `IdProducto` int NOT NULL AUTO_INCREMENT,
  `NombreProducto` varchar(100) NOT NULL,
  `Tipo` enum('Alimento','Juguete','Accesorio','Higiene','Medicamento','Otro') NOT NULL,
  `Descripcion` text,
  `Existencia` int NOT NULL DEFAULT '0',
  `PrecioCompra` int NOT NULL,
  `PrecioVenta` int NOT NULL,
  `Descuento` decimal(5,2) DEFAULT '0.00',
  `Proveedor` varchar(100) NOT NULL,
  PRIMARY KEY (`IdProducto`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (8,'Alimento para perros','Alimento','Saco de 20 kg de alimento premium para perros',30,800,1200,0.00,'dochow'),(9,'Arena para gatos','Higiene','Bolsa de 5 kg de arena sanitaria para gatos',50,100,150,0.00,'Proveedor XYZ'),(10,'Juguete para perros','Juguete','Pelota de goma resistente para perros grandes',20,50,75,0.00,'Proveedor DEF'),(11,'Transportadora para gatos','Accesorio','Transportadora plástica para gatos pequeños',10,300,450,0.00,'Proveedor GHI'),(12,'Champú para mascotas','Higiene','Champú antipulgas para perros y gatos',25,60,90,0.00,'Proveedor JKL'),(13,'Antiparasitario oral','Medicamento','Tabletas para eliminar parásitos internos',15,150,200,0.00,'Proveedor ABC'),(14,'Antibiótico para perros','Medicamento','Solución antibiótica para infecciones cutáneas',10,250,350,0.00,'Proveedor XYZ');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `raza_gato`
--

DROP TABLE IF EXISTS `raza_gato`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `raza_gato` (
  `id_raza` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id_raza`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `raza_gato`
--

LOCK TABLES `raza_gato` WRITE;
/*!40000 ALTER TABLE `raza_gato` DISABLE KEYS */;
INSERT INTO `raza_gato` VALUES (1,'Persa'),(2,'Siamés'),(3,'Maine Coon'),(4,'Bengalí'),(5,'Esfinge'),(6,'British Shorthair'),(7,'Scottish Fold'),(8,'Ragdoll'),(9,'Abisinio'),(10,'Exótico de Pelo Corto'),(11,'Angora Turco'),(12,'Birmano'),(13,'Devon Rex'),(14,'Bombay'),(15,'Noruego del Bosque');
/*!40000 ALTER TABLE `raza_gato` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `raza_perro`
--

DROP TABLE IF EXISTS `raza_perro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `raza_perro` (
  `id_raza` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id_raza`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `raza_perro`
--

LOCK TABLES `raza_perro` WRITE;
/*!40000 ALTER TABLE `raza_perro` DISABLE KEYS */;
INSERT INTO `raza_perro` VALUES (1,'Labrador Retriever'),(2,'Pastor Alemán'),(3,'Golden Retriever'),(4,'Bulldog Francés'),(5,'Bulldog Inglés'),(6,'Beagle'),(7,'Poodle'),(8,'Rottweiler'),(9,'Yorkshire Terrier'),(10,'Dálmata'),(11,'Chihuahua'),(12,'Husky Siberiano'),(13,'Doberman'),(14,'Boxer'),(15,'Shih Tzu');
/*!40000 ALTER TABLE `raza_perro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recepcionistas`
--

DROP TABLE IF EXISTS `recepcionistas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recepcionistas` (
  `IdRecepcionista` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) DEFAULT NULL,
  `Telefono` varchar(15) DEFAULT NULL,
  `IdUsuario` bigint unsigned DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Direccion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`IdRecepcionista`),
  KEY `FK_Recepcionistas_Usuarios` (`IdUsuario`),
  CONSTRAINT `FK_Recepcionistas_Usuarios` FOREIGN KEY (`IdUsuario`) REFERENCES `usuarios` (`IdUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recepcionistas`
--

LOCK TABLES `recepcionistas` WRITE;
/*!40000 ALTER TABLE `recepcionistas` DISABLE KEYS */;
INSERT INTO `recepcionistas` VALUES (2,'Carlos López','555123789',11,'carlos@example.com','Av. Siempre Viva 742');
/*!40000 ALTER TABLE `recepcionistas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registromedico`
--

DROP TABLE IF EXISTS `registromedico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registromedico` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Fecha` date NOT NULL,
  `Diagnostico` text NOT NULL,
  `Tratamiento` text NOT NULL,
  `IdVeterinario` bigint unsigned NOT NULL,
  `IdMascota` bigint unsigned NOT NULL,
  `Vacunacion` tinyint(1) NOT NULL DEFAULT '0',
  `IdVacuna` int DEFAULT NULL,
  `IdProducto` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IdVeterinario` (`IdVeterinario`),
  KEY `FK_Vacunas` (`IdVacuna`),
  KEY `FK_Productos` (`IdProducto`),
  KEY `FK_Mascotas` (`IdMascota`),
  CONSTRAINT `FK_Mascotas` FOREIGN KEY (`IdMascota`) REFERENCES `mascotas` (`IdMascota`) ON DELETE CASCADE,
  CONSTRAINT `FK_Productos` FOREIGN KEY (`IdProducto`) REFERENCES `productos` (`IdProducto`),
  CONSTRAINT `FK_Vacunas` FOREIGN KEY (`IdVacuna`) REFERENCES `vacunas` (`IdVacuna`),
  CONSTRAINT `registromedico_ibfk_1` FOREIGN KEY (`IdVeterinario`) REFERENCES `veterinarios` (`IdVeterinario`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registromedico`
--

LOCK TABLES `registromedico` WRITE;
/*!40000 ALTER TABLE `registromedico` DISABLE KEYS */;
INSERT INTO `registromedico` VALUES (23,'2024-12-13','vacunacion','vacunacion',1,12,1,1,13);
/*!40000 ALTER TABLE `registromedico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicios`
--

DROP TABLE IF EXISTS `servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicios` (
  `IdServicio` bigint unsigned NOT NULL AUTO_INCREMENT,
  `NombreServicio` varchar(50) DEFAULT NULL,
  `Descripcion` text,
  `Precio` int DEFAULT NULL,
  PRIMARY KEY (`IdServicio`),
  UNIQUE KEY `IdServicio` (`IdServicio`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicios`
--

LOCK TABLES `servicios` WRITE;
/*!40000 ALTER TABLE `servicios` DISABLE KEYS */;
INSERT INTO `servicios` VALUES (1,'Consulta General','Revisión general de la mascota',300),(2,'Vacunación','Aplicación de vacunas para la mascota',500),(3,'Baño','Servicio de baño y limpieza de la mascota',200),(4,'Desparasitacion','Eliminación de parásitos internos y externos',400),(5,'Cirugía','Procedimientos quirúrgicos para la mascota',2500),(7,'Baño premium','test',100000);
/*!40000 ALTER TABLE `servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transportes`
--

DROP TABLE IF EXISTS `transportes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transportes` (
  `IdTransporte` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Fecha` date DEFAULT NULL,
  `DireccionRecogida` varchar(100) DEFAULT NULL,
  `DireccionEntrega` varchar(100) DEFAULT NULL,
  `Estado` varchar(50) DEFAULT NULL,
  `IdPersonalDelivery` bigint unsigned DEFAULT NULL,
  `Tipo` enum('Recogida','Entrega') NOT NULL DEFAULT 'Recogida',
  `IdCita` int DEFAULT NULL,
  PRIMARY KEY (`IdTransporte`),
  UNIQUE KEY `IdTransporte` (`IdTransporte`),
  KEY `IdPersonalDelivery` (`IdPersonalDelivery`),
  CONSTRAINT `transportes_ibfk_1` FOREIGN KEY (`IdPersonalDelivery`) REFERENCES `personaldelivery` (`IdPersonalDelivery`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transportes`
--

LOCK TABLES `transportes` WRITE;
/*!40000 ALTER TABLE `transportes` DISABLE KEYS */;
INSERT INTO `transportes` VALUES (30,'2024-12-13','Calle Ejemplo 123','Veterinaria','Pendiente',NULL,'Recogida',NULL),(31,'2024-12-13','Calle Ejemplo 123','Veterinaria','Pendiente',NULL,'Recogida',NULL);
/*!40000 ALTER TABLE `transportes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `IdUsuario` bigint unsigned NOT NULL AUTO_INCREMENT,
  `NombreUsuario` varchar(50) NOT NULL,
  `Contrasena` varchar(255) NOT NULL,
  `Tipo` enum('Recepcionista','Cliente','Veterinario','PersonalDelivery','Administrador') NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Direccion` varchar(255) DEFAULT NULL,
  `Telefono` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`IdUsuario`),
  UNIQUE KEY `IdUsuario` (`IdUsuario`),
  UNIQUE KEY `NombreUsuario` (`NombreUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'recepcionista1','1234','Recepcionista','Recepcionista 1','email@email.test','',''),(2,'cliente1','1234','Cliente','Cliente 1','','',''),(3,'veterinario1','1234','Veterinario','','',NULL,NULL),(5,'admin1','1234','Administrador','','',NULL,NULL),(6,'cliente2','1234','Cliente','','',NULL,NULL),(9,'mauri','1234','Administrador','mauri','emial@email.com','direccion','09710000'),(10,'delivery1','1234','PersonalDelivery','delivery 1','delivery@gmail.com','delivery','09811000000'),(11,'carlosl','1234','Recepcionista','Carlos López','carlos@example.com','Av. Siempre Viva 742','555123789');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacunas`
--

DROP TABLE IF EXISTS `vacunas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacunas` (
  `IdVacuna` int NOT NULL AUTO_INCREMENT,
  `NombreVacuna` varchar(100) NOT NULL,
  `Descripcion` text,
  `Fabricante` varchar(100) DEFAULT NULL,
  `FechaVencimiento` date NOT NULL,
  `Existencia` int NOT NULL DEFAULT '0',
  `Precio` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`IdVacuna`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacunas`
--

LOCK TABLES `vacunas` WRITE;
/*!40000 ALTER TABLE `vacunas` DISABLE KEYS */;
INSERT INTO `vacunas` VALUES (1,'Vacuna contra la rabia','Protección contra la rabia para animales domésticos','Laboratorios ABC','2025-12-31',50,500),(2,'Vacuna triple felina','Protección contra rinotraqueítis, calicivirus y panleucopenia','Laboratorios DEF','2024-11-15',40,600),(3,'Vacuna parvovirus','Protección contra el parvovirus canino','Laboratorios XYZ','2024-06-30',30,400),(4,'Vacuna leucemia felina','Protección contra la leucemia felina','Laboratorios GHI','2024-12-31',25,450),(5,'Vacuna Moquillo','Protección contra el moquillo canino','Laboratorios JKL','2025-01-15',59,550);
/*!40000 ALTER TABLE `vacunas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `veterinarios`
--

DROP TABLE IF EXISTS `veterinarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `veterinarios` (
  `IdVeterinario` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) DEFAULT NULL,
  `Especialidad` varchar(50) DEFAULT NULL,
  `Telefono` varchar(15) DEFAULT NULL,
  `Direccion` varchar(100) DEFAULT NULL,
  `IdUsuario` bigint unsigned DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`IdVeterinario`),
  UNIQUE KEY `IdVeterinario` (`IdVeterinario`),
  KEY `FK_Veterinarios_Usuarios` (`IdUsuario`),
  CONSTRAINT `FK_Veterinarios_Usuarios` FOREIGN KEY (`IdUsuario`) REFERENCES `usuarios` (`IdUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `veterinarios`
--

LOCK TABLES `veterinarios` WRITE;
/*!40000 ALTER TABLE `veterinarios` DISABLE KEYS */;
INSERT INTO `veterinarios` VALUES (1,'Dr. Juan Pérez','Medicina General','5551234567','Calle Principal 123',3,NULL);
/*!40000 ALTER TABLE `veterinarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-13  5:51:43
