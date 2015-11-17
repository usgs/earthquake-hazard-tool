<?php

if (!isset($TEMPLATE)) {
  $TITLE = 'Location Example';
  $NAVIGATION = true;
  $HEAD = '
    <link rel="stylesheet" href="css/index.css"/>
  ';

  $FOOT = '
    <script src="js/bundle.js"></script>
    <script src="LocationExample.js"></script>
  ';
}

include '../_example.inc.php';

?>

<!-- <!doctype html>
<html>
<head>
  <title>Location Example Page</title>
  <link rel="stylesheet" href="css/index.css"/>
  <style>
    body {
      padding: 1em;
    }
  </style>
</head>
<body> -->

  <div id="example"></div>
  <!--<script src="js/bundle.js"></script>
  <script src="LocationExample.js"></script>
</body>
</html>-->
