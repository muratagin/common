CREATE TABLE `personnel` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL DEFAULT '',
  `password` varchar(100) NOT NULL DEFAULT '',
  `company_id` bigint(20) DEFAULT NULL,
  `provider_id` bigint(20) unsigned DEFAULT NULL,
  `provider_group_id` bigint(20) unsigned DEFAULT NULL,
  `schema_id` bigint(20) DEFAULT NULL,
  `table_id` bigint(20) DEFAULT NULL,
  `row_id` varchar(50) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `department` varchar(45) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `number_of_incorrect_entries` tinyint(3) NOT NULL DEFAULT '0',
  `password_change_date` datetime DEFAULT NULL,
  `settings` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5856 DEFAULT CHARSET=utf8;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE personnel (
  id bigint check (id > 0) NOT NULL GENERATED ALWAYS AS IDENTITY,
  username varchar(100) NOT NULL DEFAULT '',
  password varchar(100) NOT NULL DEFAULT '',
  company_id bigint DEFAULT NULL,
  provider_id bigint check (provider_id > 0) DEFAULT NULL,
  provider_group_id bigint check (provider_group_id > 0) DEFAULT NULL,
  schema_id bigint DEFAULT NULL,
  table_id bigint DEFAULT NULL,
  row_id varchar(50) DEFAULT NULL,
  status int NOT NULL,
  department varchar(45) DEFAULT NULL,
  first_name varchar(100) DEFAULT NULL,
  last_name varchar(100) DEFAULT NULL,
  email varchar(100) DEFAULT NULL,
  number_of_incorrect_entries smallint NOT NULL DEFAULT '0',
  password_change_date timestamp(0) DEFAULT NULL,
  settings text,
  PRIMARY KEY (id)
)  ;

ALTER SEQUENCE personnel_seq RESTART WITH 5856;

-- -- -- -- --

CREATE TABLE `personnel_role` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `personnel_id` bigint(20) unsigned NOT NULL,
  `role_id` bigint(20) unsigned NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `personnel_cadre_personnelfk` (`personnel_id`),
  KEY `personnel_cadre_cadrefk` (`role_id`),
  CONSTRAINT `personnel_cadre_cadrefk` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `personnel_cadre_personnelfk` FOREIGN KEY (`personnel_id`) REFERENCES `personnel` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10177 DEFAULT CHARSET=utf8;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE personnel_role (
  id bigint check (id > 0) NOT NULL GENERATED ALWAYS AS IDENTITY,
  personnel_id bigint check (personnel_id > 0) NOT NULL,
  role_id bigint check (role_id > 0) NOT NULL,
  status int NOT NULL,
  PRIMARY KEY (id)
,
  CONSTRAINT personnel_cadre_cadrefk FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT personnel_cadre_personnelfk FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE ON UPDATE CASCADE
)  ;

ALTER SEQUENCE personnel_role_seq RESTART WITH 10177;

CREATE INDEX personnel_cadre_personnelfk ON personnel_role (personnel_id);
CREATE INDEX personnel_cadre_cadrefk ON personnel_role (role_id);

-- -- -- -- --

CREATE TABLE `privilege` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  `type` tinyint(3) unsigned NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE privilege (
  id bigint check (id > 0) NOT NULL GENERATED ALWAYS AS IDENTITY,
  name varchar(100) NOT NULL DEFAULT '',
  type smallint check (type > 0) NOT NULL,
  status int NOT NULL DEFAULT '1',
  PRIMARY KEY (id)
)  ;

ALTER SEQUENCE privilege_seq RESTART WITH 122;

-- -- -- -- --

CREATE TABLE `role` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE role (
  id bigint check (id > 0) NOT NULL GENERATED ALWAYS AS IDENTITY,
  name varchar(50) NOT NULL DEFAULT '',
  status int NOT NULL,
  PRIMARY KEY (id)
)  ;

ALTER SEQUENCE role_seq RESTART WITH 122;

-- -- -- -- --

CREATE TABLE `role_privilege` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint(20) unsigned NOT NULL,
  `privilege_id` bigint(20) unsigned NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cadre_prilivege_cadre_idfk` (`role_id`),
  KEY `fk_privilege_cadre_privilege` (`privilege_id`),
  CONSTRAINT `cadre_prilivege_cadre_idfk` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_privilege_cadre_privilege` FOREIGN KEY (`privilege_id`) REFERENCES `privilege` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1026 DEFAULT CHARSET=utf8;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE role_privilege (
  id bigint check (id > 0) NOT NULL GENERATED ALWAYS AS IDENTITY,
  role_id bigint check (role_id > 0) NOT NULL,
  privilege_id bigint check (privilege_id > 0) NOT NULL,
  status int NOT NULL,
  PRIMARY KEY (id)
,
  CONSTRAINT cadre_prilivege_cadre_idfk FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_privilege_cadre_privilege FOREIGN KEY (privilege_id) REFERENCES privilege (id) ON DELETE CASCADE ON UPDATE CASCADE
)  ;

ALTER SEQUENCE role_privilege_seq RESTART WITH 1026;

CREATE INDEX cadre_prilivege_cadre_idfk ON role_privilege (role_id);
CREATE INDEX fk_privilege_cadre_privilege ON role_privilege (privilege_id);

-- -- -- -- --

CREATE TABLE `session` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `personnel_id` bigint(20) unsigned NOT NULL,
  `token` text NOT NULL,
  `valid_to` datetime DEFAULT NULL,
  `type` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `role_id` bigint(20) unsigned DEFAULT NULL,
  `refresh_token` text,
  `refresh_token_enddate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_session_personnel` (`personnel_id`),
  KEY `fk_session_role` (`role_id`),
  CONSTRAINT `fk_session_personnel` FOREIGN KEY (`personnel_id`) REFERENCES `personnel` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_session_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3081539 DEFAULT CHARSET=utf8;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE session (
  id bigint check (id > 0) NOT NULL GENERATED ALWAYS AS IDENTITY,
  personnel_id bigint check (personnel_id > 0) NOT NULL,
  token text NOT NULL,
  valid_to timestamp(0) DEFAULT NULL,
  type int NOT NULL,
  status int NOT NULL,
  role_id bigint check (role_id > 0) DEFAULT NULL,
  refresh_token text,
  refresh_token_enddate timestamp(0) DEFAULT NULL,
  PRIMARY KEY (id)
,
  CONSTRAINT fk_session_personnel FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_session_role FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE ON UPDATE CASCADE
)  ;

ALTER SEQUENCE session_seq RESTART WITH 3081539;

CREATE INDEX fk_session_personnel ON session (personnel_id);
CREATE INDEX fk_session_role ON session (role_id);