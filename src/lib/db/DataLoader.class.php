<?php

include_once '../classes/Curve.class.php';
include_once '../classes/CurveFactory.class.php';
include_once '../classes/Dataset.class.php';
include_once '../classes/DatasetFactory.class.php';
include_once '../classes/MetadataFactory.class.php';
include_once '../classes/RegionFactory.class.php';

class DataLoader {

  private $curveFactory = null;
  private $datasetFactory = null;

  private $editionFactory = null;
  private $regionFactory = null;
  private $imtFactory = null;
  private $vs30Factory = null;

  public function __construct ($db) {
    if ($db) {
      $this->curveFactory = new CurveFactory($db);
      $this->datasetFactory = new DatasetFactory($db);

      $this->editionFactory = new MetadataFactory($db, 'edition');
      $this->regionFactory = new RegionFactory($db);
      $this->imtFactory = new MetadataFactory($db, 'imt');
      $this->vs30Factory = new MetadataFactory($db, 'vs30');
    }
  }


  public function load ($dataFile, $dataset = null, $showProgress = false) {
    $iml = null;
    $line = null;
    $metainfo = null;
    $progress = null;

    if ($dataset === null) {
      $tokens = explode('_', basename($dataFile));
      if (count($tokens) != 5) {
        throw new Exception('Invalid file name format. Correct format is: ' .
            '{EDITION}_{REGION}_{IMT}_{VS30}_Curves.txt');
      }

      $edition = $this->editionFactory->getId($tokens[0]);
      $region = $this->regionFactory->getId($tokens[1]);
      $imt = $this->imtFactory->getId($tokens[2]);
      $vs30 = $this->vs30Factory->getId($tokens[3]);

      $dataset = new Dataset(null, $imt, $vs30, $edition, $region, array());
    }

    $fp = fopen($dataFile, 'r');

    if (!$fp) {
      throw new Exception('Failed to open data file for reading.');
    }

    // First three lines of data file is junk
    fgets($fp); fgets($fp); fgets($fp);

    // Read IML values
    while (($line = fgets($fp)) !== false) {
      $line = trim($line);

      if (strpos($line, ' ') !== false) {
        break; // Done with IML
      }

      $dataset->iml[] = floatval($line);
    }

    $dataset = $this->datasetFactory->set($dataset);

    do {
      // Clean up input line
      $line = trim($line);
      $line = str_replace('   ', ' ', $line);
      $line = str_replace('  ', ' ', $line);

      $tokens = explode(' ', $line);
      $latitude = floatval($tokens[0]);
      $longitude = floatval($tokens[1]);
      $yvals = array_map('floatval', array_slice($tokens, 2));

      $curve = new Curve(null, $dataset->id, $latitude, $longitude, $yvals);
      $curve = $this->curveFactory->set($curve);

      if ($showProgress && (
          $progress == null || intval($curve->latitude) != $progress)) {
        printf("  %f, %f\n", $curve->latitude, $curve->longitude);
        $progress = intval($curve->latitude);
      }
    } while (($line = fgets($fp)) !== false);

    fclose($fp);
  }

}
