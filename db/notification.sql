CREATE TABLE `email_item` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Language:Id,Id',
  `receiver` varchar(4000) NOT NULL DEFAULT '' COMMENT 'Language:Alıcı,Receiver',
  `subject` varchar(4000) NOT NULL DEFAULT '' COMMENT 'Language:Konu,Subject',
  `body` varchar(4000) NOT NULL DEFAULT '' COMMENT 'Language:İçerik,Body',
  `correlation_id` bigint(20) DEFAULT NULL COMMENT 'Language:Geçici,Guid',
  `issue_date` datetime NOT NULL,
  `email_settings_id` bigint(20) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_email_item_email_settings` (`email_settings_id`),
  CONSTRAINT `fk_email_item_email_settings` FOREIGN KEY (`email_settings_id`) REFERENCES `email_settings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2062936 DEFAULT CHARSET=utf8;

CREATE TABLE `email_settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Language:Id,Id',
  `host` varchar(100) NOT NULL DEFAULT '' COMMENT 'Language:Host,Host',
  `port` varchar(100) NOT NULL DEFAULT '' COMMENT 'Language:Port,Port',
  `username` varchar(100) NOT NULL DEFAULT '' COMMENT 'Language:Kullanıcı Adı,Username',
  `password` varchar(100) NOT NULL DEFAULT '' COMMENT 'Language:Şifre,Password',
  `tls_enabled` tinyint(1) NOT NULL COMMENT 'Language:Tls, Tls',
  `status` int(4) NOT NULL DEFAULT '0' COMMENT 'Language:Durum,Status#EnumNames:Status=ACTIVE,Aktif;DELETED,Silinmiş;PASSIVE,Pasif',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;