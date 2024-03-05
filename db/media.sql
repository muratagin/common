CREATE TABLE `media` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `updated_by` bigint(20) unsigned NOT NULL DEFAULT '58',
  `created_by` bigint(20) unsigned NOT NULL DEFAULT '58',
  `updated_at` datetime NOT NULL DEFAULT '1900-01-01 00:00:00',
  `created_at` datetime NOT NULL DEFAULT '1900-01-01 00:00:00',
  `name` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `path` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  `media_type` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_media_created_by_personnel_id` (`created_by`),
  KEY `fk_media_updated_by_personnel_id` (`updated_by`),
  CONSTRAINT `fk_media_created_by_personnel_id` FOREIGN KEY (`created_by`) REFERENCES `authorization`.`personnel` (`id`),
  CONSTRAINT `fk_media_updated_by_personnel_id` FOREIGN KEY (`updated_by`) REFERENCES `authorization`.`personnel` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=223992 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;