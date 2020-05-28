<?php

$oldDir = getcwd();
chdir(dirname(__FILE__));

include_once 'connect.admin.db.php';
include_once '../install-funcs.inc.php';

include_once '../classes/Metadata.class.php';
include_once '../classes/MetadataFactory.class.php';
include_once '../classes/RegionFactory.class.php';


$imtFactory = new MetadataFactory($db, 'imt');
$vs30Factory = new MetadataFactory($db, 'vs30');
$editionFactory = new MetadataFactory($db, 'edition');
$regionFactory = new RegionFactory($db);

include_once './metadata.php';

try {
  if (SKIP_PROMPTS || promptYesNo('Do you want to create tables/views?', true)) {
    $db->beginTransaction();
    $db->exec(file_get_contents('./schema.sql'));
    $db->exec('GRANT SELECT ON ALL TABLES IN SCHEMA ' . $CONFIG['DB_SCHEMA'] .
        ' TO ' . $CONFIG['DB_USER']);
    $db->commit();
    echo 'Finished creating tables/views.' . PHP_EOL;
  }


  if (SKIP_PROMPTS || promptYesNo('Do you want to load metadata?', true)) {
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
  }


  if (SKIP_PROMPTS || promptYesNo('Do you want to load static curve data?', true)) {
    include_once './load.php';
  }

} catch (Exception $e) {

  if ($db->inTransaction()) {
    $db->rollBack();
  }

  print $e->getMessage();
}

chdir($oldDir);
