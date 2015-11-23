<?php
if (!isset($TEMPLATE)) {

  // embed in the template
  $useTemplate = !isset($_GET['template']) || $_GET['template'] !== 'false';

  $pageUrl = str_replace(
      strstr($_SERVER['REQUEST_URI'], '?'), '',
      $_SERVER['REQUEST_URI']);

  if ($useTemplate) {
    include 'template.inc.php';
  } else {
    include 'minimal.inc.php';
  }
}

// this is only output during the "content" phase of the template
$nav = array();
if ($pageUrl !== '/example.php') {
  $nav[] = navItem('/example.php?template=' . $useTemplate, 'Examples Index');
}

if ($useTemplate) {
  $nav[] = navItem($pageUrl . '?template=false', 'View without template');
} else {
  $nav[] = navItem($pageUrl . '?template=true', 'View with template');
};

echo '<nav>', implode(' ', $nav), '</nav>';

if (!$useTemplate) {
  echo '<h1>' . $TITLE . '</h1>';
}
