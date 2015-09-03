<?php

// This file should be included by the setup.php file. As such, it assumes it
// has access to various (imt, vs30, edition, region) factories as well as a
// database connection (db).

include_once 'DataLoader.class.php';
include_once 'connect.admin.db.php'; // Provides $db

//
// List of files to download and load into the application database. Each file
// must be named as follows:
//
// EDITION_REGION_IMT_VS30_Curves.tgz
//
$dataFiles = array(
  'E2008R2_COUS0P05_PGA_760_Curves.tar.gz',
  'E2008R2_COUS0P05_SA0P1_760_Curves.tar.gz',
  'E2008R2_COUS0P05_SA0P2_760_Curves.tar.gz',
  'E2008R2_COUS0P05_SA0P3_760_Curves.tar.gz',
  'E2008R2_COUS0P05_SA0P5_760_Curves.tar.gz',
  'E2008R2_COUS0P05_SA1P0_760_Curves.tar.gz',
  'E2008R2_COUS0P05_SA2P0_760_Curves.tar.gz',

  // 'E2008R2_WUS0P05_SA0P75_760_Curves.tar.gz',
  // 'E2008R2_WUS0P05_SA3P0_760_Curves.tar.gz',
  // 'E2008R2_WUS0P05_SA4P0_760_Curves.tar.gz',
  // 'E2008R2_WUS0P05_SA5P0_760_Curves.tar.gz',

  'E2008R3_CEUS0P10_PGA_2000_Curves.tar.gz',
  'E2008R3_CEUS0P10_SA0P1_2000_Curves.tar.gz',
  'E2008R3_CEUS0P10_SA0P2_2000_Curves.tar.gz',
  'E2008R3_CEUS0P10_SA0P3_2000_Curves.tar.gz',
  'E2008R3_CEUS0P10_SA0P5_2000_Curves.tar.gz',
  'E2008R3_CEUS0P10_SA1P0_2000_Curves.tar.gz',
  'E2008R3_CEUS0P10_SA2P0_2000_Curves.tar.gz',

  'E2008R3_COUS0P05_PGA_760_Curves.tar.gz',
  'E2008R3_COUS0P05_SA0P1_760_Curves.tar.gz',
  'E2008R3_COUS0P05_SA0P2_760_Curves.tar.gz',
  'E2008R3_COUS0P05_SA0P3_760_Curves.tar.gz',
  'E2008R3_COUS0P05_SA0P5_760_Curves.tar.gz',
  'E2008R3_COUS0P05_SA1P0_760_Curves.tar.gz',
  'E2008R3_COUS0P05_SA2P0_760_Curves.tar.gz',

  'E2008R3_WUS0P05_PGA_1150_Curves.tar.gz',
  'E2008R3_WUS0P05_PGA_180_Curves.tar.gz',
  'E2008R3_WUS0P05_PGA_259_Curves.tar.gz',
  'E2008R3_WUS0P05_PGA_360_Curves.tar.gz',
  'E2008R3_WUS0P05_PGA_537_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P1_1150_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P1_180_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P1_259_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P1_360_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P1_537_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P2_1150_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P2_180_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P2_259_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P2_360_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P2_537_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P3_1150_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P3_180_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P3_259_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P3_360_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P3_537_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P5_1150_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P5_180_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P5_259_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P5_360_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P5_537_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P75_1150_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P75_180_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P75_259_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P75_360_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P75_537_Curves.tar.gz',
  'E2008R3_WUS0P05_SA0P75_760_Curves.tar.gz',
  'E2008R3_WUS0P05_SA1P0_1150_Curves.tar.gz',
  'E2008R3_WUS0P05_SA1P0_180_Curves.tar.gz',
  'E2008R3_WUS0P05_SA1P0_259_Curves.tar.gz',
  'E2008R3_WUS0P05_SA1P0_360_Curves.tar.gz',
  'E2008R3_WUS0P05_SA1P0_537_Curves.tar.gz',
  'E2008R3_WUS0P05_SA2P0_1150_Curves.tar.gz',
  'E2008R3_WUS0P05_SA2P0_180_Curves.tar.gz',
  'E2008R3_WUS0P05_SA2P0_259_Curves.tar.gz',
  'E2008R3_WUS0P05_SA2P0_360_Curves.tar.gz',
  'E2008R3_WUS0P05_SA2P0_537_Curves.tar.gz',
  'E2008R3_WUS0P05_SA3P0_1150_Curves.tar.gz',
  'E2008R3_WUS0P05_SA3P0_180_Curves.tar.gz',
  'E2008R3_WUS0P05_SA3P0_259_Curves.tar.gz',
  'E2008R3_WUS0P05_SA3P0_360_Curves.tar.gz',
  'E2008R3_WUS0P05_SA3P0_537_Curves.tar.gz',
  'E2008R3_WUS0P05_SA3P0_760_Curves.tar.gz',
  'E2008R3_WUS0P05_SA4P0_1150_Curves.tar.gz',
  'E2008R3_WUS0P05_SA4P0_180_Curves.tar.gz',
  'E2008R3_WUS0P05_SA4P0_259_Curves.tar.gz',
  'E2008R3_WUS0P05_SA4P0_360_Curves.tar.gz',
  'E2008R3_WUS0P05_SA4P0_537_Curves.tar.gz',
  'E2008R3_WUS0P05_SA4P0_760_Curves.tar.gz',
  'E2008R3_WUS0P05_SA5P0_1150_Curves.tar.gz',
  'E2008R3_WUS0P05_SA5P0_180_Curves.tar.gz',
  'E2008R3_WUS0P05_SA5P0_259_Curves.tar.gz',
  'E2008R3_WUS0P05_SA5P0_360_Curves.tar.gz',
  'E2008R3_WUS0P05_SA5P0_537_Curves.tar.gz',
  'E2008R3_WUS0P05_SA5P0_760_Curves.tar.gz',

  'E2014R1_COUS0P05_PGA_760_Curves.tar.gz',
  'E2014R1_COUS0P05_SA0P2_760_Curves.tar.gz',
  'E2014R1_COUS0P05_SA1P0_760_Curves.tar.gz'
);

$ftpRoot = 'ftp://hazards.cr.usgs.gov/web/earthquake-hazard-tool';

$scratchDir = sys_get_temp_dir() . DIRECTORY_SEPARATOR .
    'earthquake-hazard-tool';
$downloadDir = $scratchDir . DIRECTORY_SEPARATOR . 'download';
$extractedDir = $scratchDir . DIRECTORY_SEPARATOR . 'extracted';

$dataLoader = new DataLoader($db);


if (!is_dir($downloadDir)) {
  mkdir($downloadDir, 0777, true);
}

if (!is_dir($extractedDir)) {
  mkdir($extractedDir, 0777, true);
}

$db->exec('ALTER TABLE curve DROP CONSTRAINT curve_pkey');
$db->exec('ALTER TABLE curve DROP CONSTRAINT curve_datasetid_fkey');
$db->exec('ALTER TABLE curve DROP CONSTRAINT curve_identifier');

$db->exec('SET CONSTRAINTS ALL DEFERRED');

foreach ($dataFiles as $dataFile) {
  // Get the file locally
  $downloadFile = $ftpRoot . '/' . $dataFile;
  $tgzFile = $downloadDir . DIRECTORY_SEPARATOR . $dataFile;
  $txtFile = $extractedDir . DIRECTORY_SEPARATOR .
      str_replace('.tar.gz', '.txt', $dataFile);

  try {

    if (!downloadUrl($downloadFile, $tgzFile)) {
      echo ' already downloaded.' . PHP_EOL;
    }
    extractTarGz($tgzFile, $extractedDir); // Should create $txtFile

    echo 'Parsing and loading data file into database...';
    $dataLoader->load($txtFile, null, true);
    echo '...done.' . PHP_EOL;

  } catch (Exception $e) {
    echo PHP_EOL . 'Failed loading data file [' . $dataFile . '].' . PHP_EOL .
        $e->getMessage() . PHP_EOL;
  } finally {
    if (file_exists($tgzFile)) {
      unlink($tgzFile);
    }
    if (file_exists($txtFile)) {
      unlink($txtFile);
    }
  }
}

$db->exec('ALTER TABLE curve ADD CONSTRAINT ' .
   'curve_identifier UNIQUE (datasetid, latitude, longitude)');
$db->exec('ALTER TABLE curve ADD CONSTRAINT ' .
   'curve_datasetid_fkey FOREIGN KEY (datasetid) REFERENCES dataset (id)');
$db->exec('ALTER TABLE curve ADD PRIMARY KEY (id)');

rmdir($extractedDir);
rmdir($downloadDir);
rmdir($scratchDir);
