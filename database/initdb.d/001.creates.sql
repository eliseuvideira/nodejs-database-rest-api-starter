CREATE EXTENSION "uuid-ossp";
CREATE EXTENSION plv8;

CREATE SCHEMA customers;

ALTER DATABASE postgres_api SET search_path="$user", public, customers;
ALTER DATABASE postgres_api SET timezone='UTC';

CREATE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
  if (TG_OP == "UPDATE") {
    NEW[TG_ARGV[0] ? TG_ARGV[0] : 'updated_at'] = new Date();
  }
  return NEW;
$$ LANGUAGE "plv8";

CREATE TABLE customers (
  customer_id SERIAL,
  name VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_customers_customer_id PRIMARY KEY (customer_id)
);

CREATE TRIGGER customers_set_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at('updated_at');
