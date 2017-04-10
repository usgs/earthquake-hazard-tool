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
  new Metadata(null, 'E2014R1', 'Conterminous U.S. 2014 (v4.0.x)', 10),
  new Metadata(null, 'E2008R3', 'Conterminous U.S. 2008 (v3.2.x)', 108),
  new Metadata(null, 'E2008R2', 'Conterminous U.S. 2008 (v3.1.x)', 109),
  new Metadata(null, 'E2008R1', 'Conterminous U.S. 2008 (v3.0.x)', 110),
  new Metadata(null, 'E2007R1', 'Alaska 2007 (v2.0.x)', 210),
  new Metadata(null, 'E1998R1', 'Hawaii 1998 (v1.0.x)', 310),
  new Metadata(null, 'E2003R1', 'Puerto Rico &amp; U.S. Virgin Islands ' +
      '(v1.0.x)', 410),
  new Metadata(null, 'E2012R1', 'Guam (v1.0.x)', 510),
  new Metadata(null, 'E2012R2', 'American Samoa (v1.0.x)', 610)
);

$regions = array(
  new Region(null, 'COUS0P05', 'Conterminous U.S. w/ 0.05 Grid', 1,
      24.6, 50.0, -125.0, -65.0,
      24.6, 50.0, -125.0, -65.0,
      0.05
    ),
  new Region(null, 'WUS0P05', 'Western U.S. w/ 0.05 Grid', 2,
      24.6, 50.0, -125.0, -100.0,
      24.6, 50.0, -125.0, -115.0,
      0.05
    ),
  new Region(null, 'CEUS0P10', 'Central and Eastern U.S. w/ 0.10 Grid', 3,
      24.6, 50.0, -115.0, -65.0,
      24.6, 50.0, -100.0, -65.0,
      0.10
    ),
  new Region(null, 'AK0P10', 'Alaska w/ 0.10 Grid', 4,
      48.0, 72.0, -200.0, -125.0,
      48.0, 72.0, -200.0, -125.0,
      0.10
    ),
  new Region(null, 'HI0P02', 'Hawaii w/ 0.02 Grid', 5,
      18.0, 23.0, -161.0, -154.0,
      18.0, 23.0, -161.0, -154.0,
      0.02
    ),
  new Region(null, 'PRVI0P01', 'Puerto Rico &amp; U.S. Virgin Islands ' +
      'w/ 0.01 Grid', 6,
      17.5, 19.0, -67.5, -64.5,
      17.5, 19.0, -67.5, -64.5,
      0.01
    ),
  new Region(null, 'GNMI0P10', 'Guam w/ 0.10 Grid', 7,
      9.0, 23.0, 139.0, 151.0,
      9.0, 23.0, 139.0, 151.0,
      0.10
    ),
  new Region(null, 'AMSAM0P05', 'American Samoa', 8,
      -33.0, -11.0, -195.0, -165.0,
      -33.0, -11.0, -195.0, -165.0,
      0.05
    )
);
