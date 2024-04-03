CREATE TABLE address_pool (
  id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
  address_type int NOT NULL,
  city_id bigint NOT NULL,
  county varchar(200),
  details1 varchar(200),
  details2 varchar(200),
  details3 varchar(200),
  zip_code varchar(20),
  reference_schema_id uuid,
  reference_table_id uuid,
  reference_id uuid,
  created_at timestamp(0) NOT NULL,
  created_by bigint NOT NULL,
  updated_at timestamp(0) NOT NULL,
  updated_by bigint NOT NULL,
  is_deleted smallint NOT NULL DEFAULT '0',
  PRIMARY KEY (id)
);

CREATE TABLE city (
  id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
  state_id bigint,
  country_id bigint NOT NULL,
  code varchar(3) NOT NULL,
  name varchar(100) NOT NULL,
  created_at timestamp(0) NOT NULL,
  created_by bigint NOT NULL,
  updated_at timestamp(0) NOT NULL,
  updated_by bigint NOT NULL,
  is_deleted smallint NOT NULL DEFAULT '0',
  PRIMARY KEY (id),
  CONSTRAINT fk_city_state FOREIGN KEY (state_id) REFERENCES state (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_city_country FOREIGN KEY (country_id) REFERENCES country (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE state (
  id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
  country_id bigint NOT NULL,
  code varchar(3) NOT NULL,
  name varchar(100) NOT NULL,
  created_at timestamp(0) NOT NULL,
  created_by bigint NOT NULL,
  updated_at timestamp(0) NOT NULL,
  updated_by bigint NOT NULL,
  is_deleted smallint NOT NULL DEFAULT '0',
  PRIMARY KEY (id),
  CONSTRAINT fk_state_country FOREIGN KEY (country_id) REFERENCES country (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE country (
  id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
  a2_code varchar(3) NOT NULL,
  a3_code varchar(3) DEFAULT NULL,
  num_code varchar(4) NOT NULL,
  name varchar(100) NOT NULL,
  created_at timestamp(0) NOT NULL,
  created_by bigint NOT NULL,
  updated_at timestamp(0) NOT NULL,
  updated_by bigint NOT NULL,
  is_deleted smallint NOT NULL DEFAULT '0',
  PRIMARY KEY (id)
);