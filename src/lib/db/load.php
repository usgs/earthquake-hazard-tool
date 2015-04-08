<?php

// This file should be included by the setup.php file. As such, it assumes it
// has access to various (imt, soil, edition, region) factories as well as a
// database connection (db).

include_once '../classes/DatasetFactory.class.php';
include_once '../classes/CurveFactory.class.php';

$datasetFactory = new DatasetFactory($db);
$curveFactory = new CurveFactory($db);

//
// List of files to download and load into the application database. Each file
// must be named as follows:
//
// EDITION_REGION_IMT_VS30_GRIDSPACING_Curves.tgz
//
$dataFiles = array(
  'E2008RIII_COUS0P05_PGA_760_0.05_Curves.tar.gz',
  'E2008RIII_COUS0P05_SA0p2_760_0.05_Curves.tar.gz',
  'E2008RIII_COUS0P05_SA1p0_760_0.05_Curves.tar.gz',

  'E2014RI_COUS0P05_PGA_760_0.05_Curves.tar.gz',
  'E2014RI_COUS0P05_SA0p2_760_0.05_Curves.tar.gz',
  'E2014RI_COUS0P05_SA1p0_760_0.05_Curves.tar.gz'
);

function loadFile ($dataFile) {
  global $editionFactory;
  global $regionFactory;
  global $imtFactory;
  global $soilFactory;

  global $datasetFactory;
  global $curveFactory;

  global $ftpRoot;
  global $downloadDir;
  global $extractedDir;

  // Get the file locally
  $downloadFile = $ftpRoot . '/' . $dataFile;
  $tgzFile = $downloadDir . DIRECTORY_SEPARATOR . $dataFile;
  $txtFile = $extractedDir . DIRECTORY_SEPARATOR .
      str_replace('.tar.gz', '.txt', $dataFile);

  if (!downloadUrl($downloadFile, $tgzFile)) {
    echo ' already downloaded.' . PHP_EOL;
  }
  extractTarGz($tgzFile, $extractedDir); // Should create $txtFile


  // Parse the file name for metadata parameters
  $tokens = explode('_', $dataFile);
  $edition = $editionFactory->getId($tokens[0]);
  $region = $regionFactory->getId($tokens[1]);
  $imt = $imtFactory->getId($tokens[2]);
  $vs30 = $soilFactory->getId($tokens[3]);
  $gridspacing = floatval($tokens[4]);

  $dataset = new Dataset(null, $imt, $vs30, $edition, $region, array());

  $fp = fopen($txtFile, 'r');

  if (!$fp) {
    throw new Exception('Failed to open text file for reading.');
  }

  $line = null;
  $iml = array();
  $metainfo = null;

  // 3 lines of header text to discard
  fgets($fp); fgets($fp); fgets($fp);

  // Read IML values
  while (($line = trim(fgets($fp))) !== false) {
    if (strpos($line, ' ') !== false) {
      break; // Done with IML values
    }

    $dataset->iml[] = floatval($line);
  }

  $dataset = $datasetFactory->set($dataset);

  $progress = null;
  do {
    // Clean up input line
    $line = trim($line);
    $line = str_replace('   ', ' ', $line);
    $line = str_replace('  ', ' ', $line);

    $tokens = explode(' ', $line);
    $latitude = floatval($tokens[0]);
    $longitude = floatval($tokens[1]);
    $afe = array_map('floatval', array_slice($tokens, 2));

    $curve = new Curve(null, $dataset->id, $latitude, $longitude, $afe);
    $curve = $curveFactory->set($curve);

    if ($progress == null || intval($curve->latitude) != $progress) {
      printf("  %f, %f\n", $curve->latitude, $curve->longitude);
      $progress = intval($curve->latitude);
    }
  } while (($line = fgets($fp)) !== false);

  fclose($fp);
  unlink($txtFile);
}

$ftpRoot = 'ftp://hazards.cr.usgs.gov/web/earthquake-hazard-tool';

$scratchDir = sys_get_temp_dir() . DIRECTORY_SEPARATOR .
    'earthquake-hazard-tool';
$downloadDir = $scratchDir . DIRECTORY_SEPARATOR . 'download';
$extractedDir = $scratchDir . DIRECTORY_SEPARATOR . 'extracted';

if (!is_dir($downloadDir)) {
  mkdir($downloadDir, 0777, true);
}

if (!is_dir($extractedDir)) {
  mkdir($extractedDir, 0777, true);
}

foreach ($dataFiles as $dataFile) {
  try {
    loadFile($dataFile);
  } catch (Exception $e) {
    printf("Failed loading data file [%s].\n%s\n",
        $dataFile, $e->getMessage());
  }
}

rmdir($extractedDir);
rmdir($downloadDir);
rmdir($scratchDir);
