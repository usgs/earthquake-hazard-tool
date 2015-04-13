<?php
//
// Service to provide curve data and usage in JSON format
//

header('Content-Type: application/json');

include_once '../conf/config.inc.php';
include_once '../lib/install-funcs.inc.php'; // Provides safefloatval

include_once '../lib/classes/CurveFactory.class.php';
include_once '../lib/classes/DatasetFactory.class.php';
include_once '../lib/classes/MetadataFactory.class.php';
include_once '../lib/classes/RegionFactory.class.php';

if (isset($_GET['rewrite'])) {
  $tokens = array_filter(explode('/', $_GET['rewrite']), function ($item) {
    return strlen(trim($item)) > 0;
  });

  $editionInput = array_shift($tokens);
  $regionInput = array_shift($tokens);

  $longitude = safefloatval(array_shift($tokens));
  $latitude = safefloatval(array_shift($tokens));

  $imtInput = array_shift($tokens);
  $soilInput = array_shift($tokens);
} else {

  $editionInput = isset($_GET['edition']) ? $_GET['edition'] : null;
  $regionInput = isset($_GET['region']) ? $_GET['region'] : null;

  $longitude = isset($_GET['longitude']) ? floatval($_GET['longitude']) : null;
  $latitude = isset($_GET['latitude']) ? floatval($_GET['latitude']) : null;

  $imtInput = isset($_GET['imt']) ? $_GET['imt'] : null;
  $soilInput = isset($_GET['vs30']) ? $_GET['vs30'] : null;
}


$editionFactory = new MetadataFactory($DB, 'edition');
$regionFactory = new RegionFactory($DB);
$imtFactory = new MetadataFactory($DB, 'imt');
$soilFactory = new MetadataFactory($DB, 'vs30');
$datasetFactory = new DatasetFactory($DB);
$curveFactory = new CurveFactory($DB);

$request = (($_SERVER['HTTPS'] == 'On') ? 'https://' : 'http://') .
    $_SERVER['HTTP_HOST'];

try {
  $curves = array();

  if ($editionInput === 'any') {
    $editions = $editionFactory->getAvailable();
  } else {
    $editions = array($editionFactory->get($editionFactory->getId(
        $editionInput)));
  }

  if ($regionInput === 'any') {
    $regions = $regionFactory->getAvailable();
  } else {
    $regions = array($regionFactory->get($regionFactory->getId($regionInput)));
  }

  if ($imtInput === 'any') {
    $imts = $imtFactory->getAvailable();
  } else {
    $imts = array($imtFactory->get($imtFactory->getId($imtInput)));
  }

  if ($soilInput === 'any') {
    $soils = $soilFactory->getAvailable();
  } else {
    $soils = array($soilFactory->get($soilFactory->getId($soilInput)));
  }


  foreach ($imts as $imt) {
    foreach ($soils as $vs30) {
      foreach ($editions as $edition) {
        foreach ($regions as $region) {
          try {
            $dataset = $datasetFactory->get($datasetFactory->getId(
                $imt->id,
                $vs30->id,
                $edition->id,
                $region->id));

            $curves[] = array(
              'metadata' => array(
                'edition' => $edition->toArray(),
                'region' => $region->toArray(),
                'latitude' => $latitude,
                'longitude' => $longitude,
                'imt' => $imt->toArray(),
                'vs30' => $vs30->toArray(),
                'xlabel' => 'Ground Motion (g)',
                'ylabel' => 'Annual Frequency of Exceedence',
                'xvals' => $dataset->iml
              ),
              'data' => $curveFactory->getAll($latitude, $longitude,
                $dataset->id, $region->gridspacing)
            );
          } catch (Exception $skipit) {
            // Ignore and continue.
          }
        }
      }
    }
  }

  echo json_encode(array(
    'status' => 'success',
    'date' => date('c'),
    'url' => sprintf("%s%s/services/curve/%s/%s/%s/%s/%s/%s", $request,
        $CONFIG['MOUNT_PATH'], $editionInput, $regionInput,
        $longitude, $latitude, $imtInput, $vs30Input),
    'response' => $curves
  ));

} catch (Exception $ex) {
  // Improper usage, show usage

  function get_metadata_with_support ($metadata, $type, $supports) {
    global $datasetFactory;

    $result = $metadata->toArray();
    $result['supports'] = $datasetFactory->getSupport($type, $metadata->value,
        $supports);

    return $result;
  }

  function getEditions ($edition) {
    return get_metadata_with_support($edition, 'edition', array('region'));
  }

  function getRegions ($region) {
    return get_metadata_with_support($region, 'region', array('imt'));
  }

  function getImts ($imt) {
    return get_metadata_with_support($imt, 'imt', array('vs30'));
  }

  function getVs30s ($vs30) {
    $result = $vs30->toArray();
    $result['supports'] = array();
    return $result;
  }

  echo str_replace('"supports":[]', '"supports":{}', json_encode(array(
    'status' => 'usage',
    'description' => 'Retrieves hazard curve data for an input location',
    'syntax' => $request . $CONFIG['MOUNT_PATH'] . '/services/curve/' .
        '{edition}/{region}/{longitude}/{latitude}/{imt}/{vs30}',
    'parameters' => array(
      'edition' => array(
        'label' => 'Model edition',
        'description' => '',
        'type' => 'string',
        'values' => array_map('getEditions', $editionFactory->getAvailable())
      ),
      'region' => array(
        'label' => 'Model region',
        'type' => 'string',
        'values' => array_map('getRegions', $regionFactory->getAvailable())
      ),
      'latitude' => array(
        'label' => 'Latitude (in decimal degrees)',
        'type' => 'number',
        'values' => array('minimum' => -90.0, 'maximum' => 90.0)
      ),
      'longitude' => array(
        'label' => 'Longitude (in decimal degrees)',
        'type' => 'number',
        'values' => array('minimum' => -180.0, 'maximum' => 360.0)
      ),
      'imt' => array(
        'label' => 'Intensity measure type',
        'description' => '',
        'type' => 'string',
        'values' => array_map('getImts', $imtFactory->getAvailable())
      ),
      'vs30' => array(
        'label' => 'Site soil (Vs30)',
        'description' => '',
        'type' => 'string',
        'values' => array_map('getVs30s', $soilFactory->getAvailable())
      )
    )
  )));
}
