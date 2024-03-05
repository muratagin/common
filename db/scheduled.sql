CREATE TABLE `request` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(100) NOT NULL DEFAULT '',
  `url` varchar(4000) NOT NULL DEFAULT '',
  `cron` varchar(20) NOT NULL DEFAULT '',
  `method_type` tinyint(3) unsigned NOT NULL,
  `headers` varchar(10000) DEFAULT NULL,
  `emails` varchar(4000) DEFAULT NULL,
  `is_new` bit(1) NOT NULL DEFAULT b'1',
  `is_deleted` bit(1) NOT NULL DEFAULT b'0',
  `is_applicable` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=355 DEFAULT CHARSET=utf8;

CREATE TABLE `result` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `request_id` bigint(20) unsigned NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `status_code` int(3) unsigned DEFAULT NULL,
  `response` longtext,
  `status` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `email_result` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_request_result` (`request_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=413 DEFAULT CHARSET=utf8;