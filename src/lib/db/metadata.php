<?php

// This file just defines the complete set of potential metadata that might
// be used. This is used by setup.php.

$imts = array(
  new Metadata(null, 'PGA',    'Peak Ground Acceleration',           1),
  new Metadata(null, 'PGV',    'Peak Ground Velocity',               2),
  new Metadata(null, 'SA0P1',  '0.10 Second Spectral Acceleration',  3),
  new Metadata(null, 'SA0P2',  '0.20 Second Spectral Acceleration',  4),
  new Metadata(null, 'SA0P3',  '0.30 Second Spectral Acceleration',  5),
  new Metadata(null, 'SA0P5',  '0.50 Second Spectral Acceleration',  6),
  new Metadata(null, 'SA0P75', '0.75 Second Spectral Acceleration',  7),
  new Metadata(null, 'SA1P0',  '1.00 Second Spectral Acceleration',  8),
  new Metadata(null, 'SA2P0',  '2.00 Second Spectral Acceleration',  9),
  new Metadata(null, 'SA3P0',  '3.00 Second Spectral Acceleration', 10),
  new Metadata(null, 'SA4P0',  '4.00 Second Spectral Acceleration', 11),
  new Metadata(null, 'SA5P0',  '5.00 Second Spectral Acceleration', 12)
);

$vs30s = array(
  new Metadata(null, '2000', '2000 m/s - Site Class A', 1),
  new Metadata(null, '1150', '1150 m/s - Site Class B', 2),
  new Metadata(null, '760',  '760 m/s - B/C Boundary',  3),
  new Metadata(null, '537',  '537 m/s - Site Class C',  4),
  new Metadata(null, '360',  '360 m/s - C/D Boundary',  5),
  new Metadata(null, '259',  '259 m/s - Site Class D',  6),
  new Metadata(null, '180',  '180 m/s - D/E Boundary',  7)
);

$editions = array(
  new Metadata(null, 'E2008R1', 'USGS NSHM 2008 Rev. 1', 1),
  new Metadata(null, 'E2008R2', 'USGS NSHM 2008 Rev. 2', 2),
  new Metadata(null, 'E2008R3', 'USGS NSHM 2008 Rev. 3', 3),
  new Metadata(null, 'E2014R1', 'USGS NSHM 2014 Rev. 1', 4)
);

$regions = array(
  new Region(null, 'COUS0P05', 'Conterminous U.S. w/ 0.05 Grid', 1, 24.6,
      50.0, -118.0, -65.0, 0.05)
);
