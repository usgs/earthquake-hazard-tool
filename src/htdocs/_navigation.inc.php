<?php

include_once '../conf/config.inc.php';

print navGroup(
  navItem($MOUNT_PATH . '/index.php', 'Hazard Tool'),
  navItem($MOUNT_PATH . '/documentation.php', 'Documentation &amp; Help') .
  navItem('https://github.com/usgs/earthquake-hazard-tool/issues', 'Issue Tracker')
);
