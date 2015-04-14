<?php

//
// This file provides a command line wrapper around the DataLoader to allow
// a user to load individual data files from the local file system without
// needing to re-install the entire application.
//

$oldDir = getcwd();
chdir(dirname(__FILE__));

if (count($argv) < 2) {
  echo 'Usage: php ' . $argv[0] . ' <datafile>[ <datafile>...]' . PHP_EOL;
  exit(-1);
}

include_once 'connect.admin.db.php';
include_once 'DataLoader.class.php';

$errors = 0;
$dataLoader = new DataLoader($db);

foreach (array_slice($argv, 1) as $dataFile) {
  try {
    echo $dataFile . PHP_EOL;
    $dataLoader->load($dataFile, null, true);
  } catch (Exception $ex) {
    $errors += 1;
    echo $ex->getMessage() . PHP_EOL;
  }
}

echo 'Completed with ' . $errors . ' errors.' . PHP_EOL;
chdir($oldDir);
exit(0);
