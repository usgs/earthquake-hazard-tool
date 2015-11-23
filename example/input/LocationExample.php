<?php

if (!isset($TEMPLATE)) {
  $TITLE = 'Location Example';
  $NAVIGATION = true;
  $HEAD = '
    <link rel="stylesheet" href="/lib/leaflet/leaflet.css"/>
    <link rel="stylesheet" href="/css/index.css"/>
    <style>
      pre {
        padding: 0;
        min-height: 1em;
        max-height: 20em;
        overflow-y: auto;
      }
      code > p {
        margin: 0;
        padding: .5em;
      }
      code > :nth-child(even) {
        background-color: #f0f0f0;
      }
    </style>
  ';

  $FOOT = '
    <script src="/lib/leaflet/leaflet.js"></script>
    <script src="/js/bundle.js"></script>
    <script src="LocationExample.js"></script>
  ';
}

include '../_example.inc.php';

?>


<div id="example"></div>

<h2>Debug Output</h2>
<pre><code class="log-output"></code></pre>
