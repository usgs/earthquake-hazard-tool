<?php
if (!isset($TEMPLATE)) {
  include_once '../conf/config.inc.php';

  $TITLE = 'Hazard Tool';

  // If you want to include section navigation.
  // The nearest _navigation.inc.php file will be used by default
  $NAVIGATION = true;

  // Stuff that goes at the top of the page (in the <head>) (i.e. <link> tags)
  $HEAD = '
    <link rel="stylesheet" href="css/index.css"/>
  ';

  $services = array();
  foreach (explode(',', $CONFIG['WEB_SERVICES']) as $service) {
    $parts = explode('|', $service);
    $services[] = '\'' . $parts[0] . '\': {
      metaUrl: \'' . $parts[1] . '\',
      constructor: \'' . $parts[2] . '\'
    }';
  }

  // Stuff that goes at the bottom of the page (i.e. <script> tags)
  $FOOT = '
    <script>
      var WEB_SERVICES = {
        ' . implode(',', $services) . '
      };
    </script>
    <script src="lib/leaflet/leaflet.js"></script>
    <script src="js/index.js"></script>
  ';

  include 'template.inc.php';
}
?>

<div class="application">
  <noscript>
    Javascript is required to use this application.
  </noscript>
</div>
