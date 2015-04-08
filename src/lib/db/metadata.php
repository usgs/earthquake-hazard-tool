<?php

// This file just defines the complete set of potential metadata that might
// be used. This is used by setup.php.

$imts = array(
  new Metadata(null, 'PGA',    'Peak Ground Acceleration',           1),
  new Metadata(null, 'PGV',    'Peak Ground Velocity',               2),
  new Metadata(null, 'SA0p1',  '0.10 Second Spectral Acceleration',  3),
  new Metadata(null, 'SA0p2',  '0.20 Second Spectral Acceleration',  4),
  new Metadata(null, 'SA0p3',  '0.30 Second Spectral Acceleration',  5),
  new Metadata(null, 'SA0p5',  '0.50 Second Spectral Acceleration',  6),
  new Metadata(null, 'SA0p75', '0.75 Second Spectral Acceleration',  7),
  new Metadata(null, 'SA1p0',  '1.00 Second Spectral Acceleration',  8),
  new Metadata(null, 'SA2p0',  '2.00 Second Spectral Acceleration',  9),
  new Metadata(null, 'SA3p0',  '3.00 Second Spectral Acceleration', 10),
  new Metadata(null, 'SA4p0',  '4.00 Second Spectral Acceleration', 11),
  new Metadata(null, 'SA5p0',  '5.00 Second Spectral Acceleration', 12)
);

$soils = array(
  new Metadata(null, '2000', '2000 m/s - Site Class A', 1),
  new Metadata(null, '1150', '1150 m/s - Site Class B', 2),
  new Metadata(null, '760',  '760 m/s - B/C Boundary',  3),
  new Metadata(null, '537',  '537 m/s - Site Class C',  4),
  new Metadata(null, '360',  '360 m/s - C/D Boundary',  5),
  new Metadata(null, '259',  '259 m/s - Site Class D',  6),
  new Metadata(null, '180',  '180 m/s - D/E Boundary',  7)
);

$editions = array(
  new Metadata(null, 'E2008RI',   'USGS NSHM 2008 Rev. I',   1),
  new Metadata(null, 'E2008RII',  'USGS NSHM 2008 Rev. II',  2),
  new Metadata(null, 'E2008RIII', 'USGS NSHM 2008 Rev. III', 3),
  new Metadata(null, 'E2014RI',   'USGS NSHM 2014 Rev. I',   4)
);

$regions = array(
  new Region(null, 'COUS0P05', 'Conterminous U.S. w/ 0.05 Grid', 1, 24.6,
      50.0, -118.0, -65.0, 0.05)
);
