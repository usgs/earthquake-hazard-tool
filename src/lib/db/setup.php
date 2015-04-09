<?php

$oldDir = getcwd();
chdir(dirname(__FILE__));

include_once '../install-funcs.inc.php';

include_once '../classes/Metadata.class.php';
include_once '../classes/MetadataFactory.class.php';
include_once '../classes/RegionFactory.class.php';

$configFile = '../../conf/config.ini';

if (!file_exists($configFile)) {
  echo 'Configuration file does not exist. Exiting.' . PHP_EOL;
  exit (-1);
}

// provides DB_DSN
$CONFIG = parse_ini_file($configFile);

$adminDsn = configure('adminDsn', $CONFIG['DB_DSN'],
    'Database DSN for administration');
$adminUser = configure('adminUser', 'root', 'Database admin user ' .
    'to use when creating database');
$adminPass = configure('adminPass', '',
    'Password for database admin user', true);

$db = new PDO($adminDsn, $adminUser, $adminPass);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
if (strpos($adminDsn, 'pgsql') === 0) {
  $db->exec('SET SEARCH_PATH = ' . $CONFIG['DB_SCHEMA']);
}

$imtFactory = new MetadataFactory($db, 'imt');
$vs30Factory = new MetadataFactory($db, 'vs30');
$editionFactory = new MetadataFactory($db, 'edition');
$regionFactory = new RegionFactory($db);

include_once './metadata.php';

try {

  if (!promptYesNo('Do you want to create tables/views?', true)) {
    return;
  }

  $db->beginTransaction();
  $db->exec(file_get_contents('./schema.sql'));
  $db->commit();
  echo 'Finished creating tables/views.' . PHP_EOL;

  if (!promptYesNo('Do you want to load metadata?', true)) {
    return;
  }

  $db->beginTransaction();

  foreach ($imts as $imt) {
    $imtFactory->set($imt);
  }

  foreach ($vs30s as $vs30) {
    $vs30Factory->set($vs30);
  }

  foreach ($editions as $edition) {
    $editionFactory->set($edition);
  }

  foreach ($regions as $region) {
    $regionFactory->set($region);
  }

  $db->commit();
  echo 'Finished loading metadata.' . PHP_EOL;

  if (!promptYesNo('Do you want to load static curve data?', true)) {
    return;
  }

  include_once './load.php';

} catch (Exception $e) {

  if ($db->inTransaction()) {
    $db->rollBack();
  }

  print $e->getMessage();
}

chdir($oldDir);
