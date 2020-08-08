CREATE EXTENSION "uuid-ossp";
CREATE EXTENSION plv8;

CREATE DATABASE postgres_api_test;

ALTER DATABASE postgres_api SET timezone='UTC';
ALTER DATABASE postgres_api_test SET timezone='UTC';
