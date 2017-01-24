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
  $vs30Input = array_shift($tokens);
} else {

  $editionInput = isset($_GET['edition']) ? $_GET['edition'] : null;
  $regionInput = isset($_GET['region']) ? $_GET['region'] : null;

  $longitude = isset($_GET['longitude']) ? floatval($_GET['longitude']) : null;
  $latitude = isset($_GET['latitude']) ? floatval($_GET['latitude']) : null;

  $imtInput = isset($_GET['imt']) ? $_GET['imt'] : null;
  $vs30Input = isset($_GET['vs30']) ? $_GET['vs30'] : null;
}


$editionFactory = new MetadataFactory($DB, 'edition');
$regionFactory = new RegionFactory($DB);
$imtFactory = new MetadataFactory($DB, 'imt');
$vs30Factory = new MetadataFactory($DB, 'vs30');
$datasetFactory = new DatasetFactory($DB);
$curveFactory = new CurveFactory($DB);

$forwarded_https = (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) &&
    $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

$request = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'Off') ||
    $forwarded_https) ? 'https://' : 'http://';

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

  if ($vs30Input === 'any') {
    $vs30s = $vs30Factory->getAvailable();
  } else {
    $vs30s = array($vs30Factory->get($vs30Factory->getId($vs30Input)));
  }


  foreach ($imts as $imt) {
    foreach ($vs30s as $vs30) {
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
    'url' => sprintf("%s%s", $request, $_SERVER['REQUEST_URI']),
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
    return get_metadata_with_support($edition, 'edition',
        array('region', 'imt', 'vs30'));
  }

  function getRegions ($region) {
    return get_metadata_with_support($region, 'region', array('imt', 'vs30'));
  }

  function getImts ($imt) {
    $result = $imt->toArray();
    $result['supports'] = array();
    return $result;
  }

  function getVs30s ($vs30) {
    $result = $vs30->toArray();
    $result['supports'] = array();
    return $result;
  }

  echo str_replace('"supports":[]', '"supports":{}', json_encode(array(
    'status' => 'usage',
    'description' => 'Retrieves hazard curve data for an input location',
    'syntax' => $request . $_SERVER['REQUEST_URI'] .
        '{edition}/{region}/{longitude}/{latitude}/{imt}/{vs30}',
    'parameters' => array(
      'edition' => array(
        'label' => 'Model edition',
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
        'type' => 'string',
        'values' => array_map('getImts', $imtFactory->getAvailable())
      ),
      'vs30' => array(
        'label' => 'Site soil (Vs30)',
        'type' => 'string',
        'values' => array_map('getVs30s', $vs30Factory->getAvailable())
      )
    )
  )));
}
