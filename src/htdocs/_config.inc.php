<?php

$livesite = 'http://earthquake.usgs.gov';

$SITE_COMMONNAV =
    navItem($livesite . '/', 'Home') .
    navItem($livesite . '/aboutus/', 'About Us') .
    navItem($livesite . '/contactus/regional.php', 'Contact Us') .
    navItem($livesite . '/legal.php', 'Legal');

$THEME_CSS =
  '<link rel="stylesheet" href="/theme/site/earthquake/index.css"/>';

$SITE_URL = 'earthquake.usgs.gov';
$SITE_SITENAV =
  navItem($livesite . '/earthquakes/', 'Earthquakes') .
  navItem($livesite . '/hazards/', 'Hazards') .
  navItem($livesite . '/data/', 'Data') .
  navItem($livesite . '/learn/', 'Learn') .
  navItem($livesite . '/monitoring/', 'Monitoring') .
  navItem($livesite . '/research/', 'Research');

$HEAD = $THEME_CSS .
    // page head content
    ($HEAD ? $HEAD : '') .

    // description meta
    '<meta name="description" content="' .
        'USGS Earthquake Hazards Program, responsible for' .
        ' monitoring, reporting, and researching earthquakes and' .
        ' earthquake hazards' .
    '"/>' .

    // keywords meta
    '<meta name="keywords" content="' .
        'aftershock,earthquake,epicenter,fault,foreshock,geologist,' .
        'geophysics,hazard,hypocenter,intensity,intensity scale,magnitude,' .
        'magnitude scale,mercalli,plate,richter,seismic,seismicity,seismogram,' .
        'seismograph,seismologist,seismology,subduction,tectonics,tsunami,' .
        'quake,sismologico,sismologia' .
    '"/>';
