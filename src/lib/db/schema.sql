DROP VIEW IF EXISTS dataset_vw;
DROP VIEW IF EXISTS dataset_vals_vw;
DROP TABLE IF EXISTS curve;
DROP TABLE IF EXISTS dataset;
DROP TABLE IF EXISTS region;
DROP TABLE IF EXISTS edition;
DROP TABLE IF EXISTS vs30;
DROP TABLE IF EXISTS imt;


CREATE TABLE imt (
  id SERIAL NOT NULL PRIMARY KEY,
  value TEXT NOT NULL,
  display TEXT NOT NULL,
  displayorder INTEGER NOT NULL,

  CONSTRAINT imt_identifier UNIQUE (value)
);

CREATE TABLE vs30 (
  id SERIAL NOT NULL PRIMARY KEY,
  value TEXT NOT NULL,
  display TEXT NOT NULL,
  displayorder INTEGER NOT NULL,

  CONSTRAINT vs30_identifier UNIQUE (value)
);

CREATE TABLE edition (
  id SERIAL NOT NULL PRIMARY KEY,
  value TEXT NOT NULL,
  display TEXT NOT NULL,
  displayorder INTEGER NOT NULL,

  CONSTRAINT edition_identifier UNIQUE (value)
);

CREATE TABLE region (
  id SERIAL NOT NULL PRIMARY KEY,
  value TEXT NOT NULL,
  display TEXT NOT NULL,
  displayorder INTEGER NOT NULL,
  minlatitude DECIMAL(5, 2) NOT NULL,
  maxlatitude DECIMAL(5, 2) NOT NULL,
  minlongitude DECIMAL(5, 2) NOT NULL,
  maxlongitude DECIMAL(5, 2) NOT NULL,
  gridspacing DECIMAL(5, 2) NOT NULL,

  CONSTRAINT region_identifier UNIQUE (value),
  CONSTRAINT region_parameters UNIQUE (minlatitude, maxlatitude, minlongitude,
    maxlongitude, gridspacing)
);

CREATE TABLE dataset (
  id SERIAL NOT NULL PRIMARY KEY,
  imtid INTEGER NOT NULL REFERENCES imt (id),
  vs30id INTEGER NOT NULL REFERENCES vs30 (id),
  editionid INTEGER NOT NULL REFERENCES edition (id),
  regionid INTEGER NOT NULL REFERENCES region (id),
  iml DECIMAL ARRAY,

  CONSTRAINT dataset_identifier UNIQUE (imtid, vs30id, editionid, regionid)
);

CREATE TABLE curve (
  id SERIAL NOT NULL PRIMARY KEY,
  datasetid INTEGER NOT NULL REFERENCES dataset (id),
  latitude DECIMAL(5, 2) NOT NULL,
  longitude DECIMAL(5, 2) NOT NULL,
  afe DECIMAL ARRAY NOT NULL,

  CONSTRAINT curve_identifier UNIQUE (datasetid, latitude, longitude)
);

CREATE VIEW dataset_vw AS
  SELECT
    t.display AS imt,
    s.display AS vs30,
    e.display AS edition,
    r.display AS region,
    r.minlatitude AS minlatitude,
    r.maxlatitude AS maxlatitude,
    r.minlongitude AS minlongitude,
    r.maxlongitude AS maxlongitude,
    r.gridspacing AS gridspacing,
    d.iml AS iml
  FROM
    dataset AS d
  JOIN
    imt AS t ON (t.id = d.imtid)
  JOIN
    vs30 AS s ON (s.id = d.vs30id)
  JOIN
    edition AS e ON (e.id = d.editionid)
  JOIN
    region AS r ON (r.id = d.regionid)
  ORDER BY
    e.displayorder,
    r.displayorder,
    t.displayorder,
    s.displayorder
;

CREATE VIEW dataset_vals_vw AS
  SELECT
    t.value AS imt,
    s.value AS vs30,
    e.value AS edition,
    r.value AS region,
    r.minlatitude AS minlatitude,
    r.maxlatitude AS maxlatitude,
    r.minlongitude AS minlongitude,
    r.maxlongitude AS maxlongitude,
    r.gridspacing AS gridspacing,
    d.iml AS iml
  FROM
    dataset AS d
  JOIN
    imt AS t ON (t.id = d.imtid)
  JOIN
    vs30 AS s ON (s.id = d.vs30id)
  JOIN
    edition AS e ON (e.id = d.editionid)
  JOIN
    region AS r ON (r.id = d.regionid)
  ORDER BY
    e.displayorder,
    r.displayorder,
    t.displayorder,
    s.displayorder
;
