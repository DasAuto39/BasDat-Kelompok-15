-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 23, 2025 at 04:17 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `form`
--

-- --------------------------------------------------------

--
-- Table structure for table `assessment_scores`
--

CREATE TABLE `assessment_scores` (
  `id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `sub_assessment_id` int(11) DEFAULT NULL,
  `error_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assessment_scores`
--

INSERT INTO `assessment_scores` (`id`, `project_id`, `sub_assessment_id`, `error_count`) VALUES
(1073, 93, 1, 0),
(1074, 93, 2, 0),
(1075, 93, 3, 0),
(1076, 93, 4, 0),
(1077, 93, 5, 0),
(1078, 93, 6, 0),
(1080, 93, 8, 0),
(1081, 93, 10, 0);

-- --------------------------------------------------------

--
-- Table structure for table `grade_ranges`
--

CREATE TABLE `grade_ranges` (
  `id` int(11) NOT NULL,
  `lower_bound` int(11) DEFAULT NULL,
  `upper_bound` int(11) DEFAULT NULL,
  `predikat` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `main_assessments`
--

CREATE TABLE `main_assessments` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `main_assessments`
--

INSERT INTO `main_assessments` (`id`, `name`) VALUES
(1, 'Penguasaan Materi'),
(2, 'Celah Keamanan'),
(3, 'Fitur Utama');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`) VALUES
(93, 'dsafweaf');

-- --------------------------------------------------------

--
-- Table structure for table `project_results`
--

CREATE TABLE `project_results` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `total_errors` int(11) NOT NULL,
  `final_score` int(11) NOT NULL,
  `predikat` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_results`
--

INSERT INTO `project_results` (`id`, `project_id`, `total_errors`, `final_score`, `predikat`, `status`) VALUES
(93, 93, 3, 87, 'Tidak Diketahui', 'Lulus');

-- --------------------------------------------------------

--
-- Table structure for table `sub_assessments`
--

CREATE TABLE `sub_assessments` (
  `id` int(11) NOT NULL,
  `main_assessment_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sub_assessments`
--

INSERT INTO `sub_assessments` (`id`, `main_assessment_id`, `name`) VALUES
(1, 1, 'Materi Basis Data'),
(2, 1, 'Materi Struktur'),
(3, 1, 'Materi Matematika'),
(4, 1, 'Materi'),
(5, 2, 'Sanitasi'),
(6, 2, 'Authorization'),
(8, 3, 'Read'),
(10, 3, 'Delete');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assessment_scores`
--
ALTER TABLE `assessment_scores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `assessment_scores_ibfk_2` (`sub_assessment_id`);

--
-- Indexes for table `grade_ranges`
--
ALTER TABLE `grade_ranges`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `main_assessments`
--
ALTER TABLE `main_assessments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `project_results`
--
ALTER TABLE `project_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `sub_assessments`
--
ALTER TABLE `sub_assessments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `main_assessment_id` (`main_assessment_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assessment_scores`
--
ALTER TABLE `assessment_scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1083;

--
-- AUTO_INCREMENT for table `grade_ranges`
--
ALTER TABLE `grade_ranges`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `main_assessments`
--
ALTER TABLE `main_assessments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `project_results`
--
ALTER TABLE `project_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `sub_assessments`
--
ALTER TABLE `sub_assessments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assessment_scores`
--
ALTER TABLE `assessment_scores`
  ADD CONSTRAINT `assessment_scores_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `assessment_scores_ibfk_2` FOREIGN KEY (`sub_assessment_id`) REFERENCES `sub_assessments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_results`
--
ALTER TABLE `project_results`
  ADD CONSTRAINT `project_results_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sub_assessments`
--
ALTER TABLE `sub_assessments`
  ADD CONSTRAINT `sub_assessments_ibfk_1` FOREIGN KEY (`main_assessment_id`) REFERENCES `main_assessments` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
