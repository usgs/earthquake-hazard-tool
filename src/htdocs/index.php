<?php
if (!isset($TEMPLATE)) {
  include_once '../conf/config.inc.php';

  $TITLE = 'Beta - Unified Hazard Tool';

  $CONTACT = 'pmpowers@usgs.gov';
  $CONTACT_URL = 'mailto:{CONTACT}?subject=' .
      rawurlencode(html_entity_decode($TITLE));

  // If you want to include section navigation.
  // The nearest _navigation.inc.php file will be used by default
  $NAVIGATION = true;

  // Stuff that goes at the top of the page (in the <head>) (i.e. <link> tags)
  $HEAD = '
    <link rel="stylesheet" href="lib/leaflet/leaflet.css"/>
    <link rel="stylesheet" href="css/index.css"/>
  ';

  $curves = array();
  $deaggs = array();

  foreach (explode(',', $CONFIG['CURVE_SERVICES']) as $service) {
    $parts = explode('|', $service);
    $curves[] = '\'' . $parts[0] . '\': {
      metaUrl: \'' . $parts[1] . '\',
      constructor: \'' . $parts[2] . '\'
    }';
  }

  foreach (explode(',', $CONFIG['DEAGG_SERVICES']) as $service) {
    $parts = explode('|', $service);
    $deaggs[] = '\'' . $parts[0] . '\': {
      metaUrl: \'' . $parts[1] . '\',
      constructor: \'' . $parts[2] . '\'
    }';
  }

  // Stuff that goes at the bottom of the page (i.e. <script> tags)
  $FOOT = '
    <script>
      var CURVE_SERVICES = {
        ' . implode(',', $curves) . '
      };
      var DEAGG_SERVICES = {
        ' . implode(',', $deaggs) . '
      };
    </script>
    <script src="lib/leaflet/leaflet.js"></script>
    <script src="js/index.js"></script>
  ';

  include 'template.inc.php';
}
?>

<p class="alert warning">
  Please do not use this tool to obtain ground motion parameter values for the
  design code reference documents covered by the <a href="/hazards/designmaps/"
  >U.S. Seismic Design Maps web tools</a> (e.g., the International
  Building Code and the ASCE 7 or 41 Standard). The values returned by the two
  applications are not identical.
</p>

<div class="application">
  <noscript>
    Javascript is required to use this application.
  </noscript>
</div>
