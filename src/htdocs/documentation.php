<?php
if (!isset($TEMPLATE)) {
  include_once '../conf/config.inc.php';

  $TITLE = 'Documentation &amp; Help';

  // If you want to include section navigation.
  // The nearest _navigation.inc.php file will be used by default
  $NAVIGATION = true;

  // Stuff that goes at the top of the page (in the <head>) (i.e. <link> tags)
  $HEAD = '
    <link rel="stylesheet" href="css/index.css"/>
  ';

  include 'template.inc.php';
}
?>

<div class="documentation">

  <p>
    These instructions will help you compute calculations using the
    Unified Hazard Tool
  </p>

  <h3>Earthquake Hazard and Probability Maps</h3>
  <p>
    This section allows you to view all of the hazard and fault overlays
    on a map. Click on the layer chooser (upper right-hand of map) to view
    your overlay options.
  </p>

  <h3>Hazard Curve</h3>
  <p>To compute a hazard curve, the following inputs are required:</p>
  <ul>
    <li>Edition</li>
    <li>Location (Latitude/ Longitude)</li>
    <li>Site Class</li>
  </ul>
  </ul>
  <p>
    Once you have entered all of the requisite inputs, scroll down
    to the &ldquo;Hazard Curve&rdquo; section and click the button
    labeled &ldquo;Compute Hazard Curve&rdquo; to perform the calculation.
  </p>
  <p class="disclaimer">
    NOTE: Calculations may take upwards of 30 seconds to complete.
  </p>


  <h3>Deaggregation</h3>
  <p>To compute a deaggregation, the following inputs are required:</p>
  <ul>
    <li>Edition</li>
    <li>Location (Latitude/ Longitude)</li>
    <li>Site Class</li>
    <li>Spectral Period</li>
    <li>Time Horizon</li>
  </ul>
  <p>
    Once you have entered all of the requisite inputs, scroll down
    to the &ldquo;Deaggregation&rdquo; section and click the button
    labeled &ldquo;Compute Deaggregation&rdquo; to perform the calculation.
  </p>
  <p class="disclaimer">
    NOTE: Calculations may take upwards of 30 seconds to complete.
  </p>


  <h3>History</h3>
  <p>
    This section allows you to keep a history of hazard curve and
    deaggregation calculations for multiple sets of inputs.
  </p>

  <h4>Tracking Multiple Calculations</h4>
  <p>
    Your first calculation is automatically stored in the history section.
    To store a second set of calculations, click the &ldquo;new&rdquo;
    button (located on the right side of the list). A new record will be
    created and all of your previously selected inputs will be cleared.
  </p>
  <p class="disclaimer">
    NOTE: Your calculations will be identifiable based on the data that
    you input for each calculation.
  </p>

  <h4>Deleting a Calculation</h4>
  <p>
    If a calculation is no longer needed you can delete it. Click the
    &ldquo;delete&rdquo; link to remove the calculation, and a new
    calculation will be selected.
  </p>
  <p class="disclaimer">
    NOTE: Deleting the currently selected calculation will select a previously
    created calculation. However, if no previously created calculation
    exists then a new record is created.
  </p>

</div>
