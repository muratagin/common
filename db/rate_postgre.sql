CREATE TABLE rate (
  id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
  rate_date timestamp(0) DEFAULT NULL,
  currency_type smallint check (currency_type > 0) NOT NULL,
  unit int check (unit > 0) DEFAULT NULL,
  forex_buying decimal(10,6),
  forex_selling decimal(10,6),
  banknote_buying decimal(10,6),
  banknote_selling decimal(10,6),
  created_at timestamp(0) NOT NULL DEFAULT '1900-01-01 00:00:00',
  is_deleted smallint NOT NULL DEFAULT '0',
  PRIMARY KEY (id)
);