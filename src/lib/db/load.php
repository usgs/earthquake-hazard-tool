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
// EDITION_REGION_IMT_VS30_GRIDSPACING_Curves.tgz
//
$dataFiles = array(
  'E2008R3_COUS0P05_PGA_760_Curves.tar.gz',
  'E2008R3_COUS0P05_SA0p2_760_Curves.tar.gz',
  'E2008R3_COUS0P05_SA1p0_760_Curves.tar.gz',

  'E2014R1_COUS0P05_PGA_760_Curves.tar.gz',
  'E2014R1_COUS0P05_SA0p2_760_Curves.tar.gz',
  'E2014R1_COUS0P05_SA1p0_760_Curves.tar.gz'
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
    $dataLoader->load($txtFile);
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

rmdir($extractedDir);
rmdir($downloadDir);
rmdir($scratchDir);
