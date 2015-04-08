DROP VIEW IF EXISTS dataset_vw;
DROP TABLE IF EXISTS curve;
DROP TABLE IF EXISTS dataset;
DROP TABLE IF EXISTS region;
DROP TABLE IF EXISTS edition;
DROP TABLE IF EXISTS soil;
DROP TABLE IF EXISTS imt;


CREATE TABLE imt (
  id SERIAL NOT NULL PRIMARY KEY,
  value TEXT NOT NULL,
  display TEXT NOT NULL,
  displayorder INTEGER NOT NULL,

  CONSTRAINT imt_identifier UNIQUE (value)
);

CREATE TABLE soil (
  id SERIAL NOT NULL PRIMARY KEY,
  value TEXT NOT NULL,
  display TEXT NOT NULL,
  displayorder INTEGER NOT NULL,

  CONSTRAINT soil_identifier UNIQUE (value)
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
  soilid INTEGER NOT NULL REFERENCES soil (id),
  editionid INTEGER NOT NULL REFERENCES edition (id),
  regionid INTEGER NOT NULL REFERENCES region (id),
  iml DECIMAL ARRAY,

  CONSTRAINT dataset_identifier UNIQUE (imtid, soilid, editionid, regionid)
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
    s.display AS soil,
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
  LEFT JOIN
    imt AS t ON (t.id = d.imtid)
  LEFT JOIN
    soil AS s ON (s.id = d.soilid)
  LEFT JOIN
    edition AS e ON (e.id = d.editionid)
  LEFT JOIN
    region AS r ON (r.id = d.regionid)
  WHERE
    d.id IS NOT NULL AND
    d.imtid IS NOT NULL AND
    d.soilid IS NOT NULL AND
    d.editionid IS NOT NULL AND
    d.regionid IS NOT NULL
  ORDER BY
    e.displayorder,
    r.displayorder,
    t.displayorder,
    s.displayorder
;
