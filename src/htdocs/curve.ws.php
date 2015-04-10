<?php
//
// Service to provide curve data and usage in JSON format
//

header('Content-Type: application/json');

include_once '../conf/config.inc.php';

include_once '../lib/classes/CurveFactory.class.php';
include_once '../lib/classes/DatasetFactory.class.php';
include_once '../lib/classes/MetadataFactory.class.php';
include_once '../lib/classes/RegionFactory.class.php';

$editionInput = isset($_GET['edition']) ? $_GET['edition'] : null;
$regionInput = isset($_GET['region']) ? $_GET['region'] : null;

$latitude = isset($_GET['latitude']) ? floatval($_GET['latitude']) : null;
$longitude = isset($_GET['longitude']) ? floatval($_GET['longitude']) : null;

$imtInput = isset($_GET['imt']) ? $_GET['imt'] : null;
$soilInput = isset($_GET['vs30']) ? $_GET['vs30'] : null;


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
                'edition' => $edition,
                'region' => $region,
                'latitude' => $latitude,
                'longitude' => $longitude,
                'imt' => $imt,
                'vs30' => $vs30,
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
        $CONFIG['MOUNT_PATH'], $_GET['edition'], $_GET['region'],
        $_GET['longitude'], $_GET['latitude'], $_GET['imt'], $_GET['vs30']),
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

  echo json_encode(array(
    'status' => 'usage',
    'description' => 'Retrieves hazard curve data for an input location',
    'syntax' => $request . $CONFIG['MOUNT_PATH'] . '/services/curve/' .
        '{edition}/{region}/{longitude}/{latitude}/{imt}/{vs30}',
    'parameters' => array(
      'edition' => array(
        'label' => 'Data Edition',
        'description' => '',
        'type' => 'string',
        'values' => array_map('getEditions', $editionFactory->getAvailable())
      ),
      'region' => array(
        'label' => 'Geographic Region',
        'description' => '',
        'type' => 'string',
        'values' => array_map('getRegions', $regionFactory->getAvailable())
      ),
      'latitude' => array(
        'label' => 'Latitude',
        'description' => 'Decimal degrees latitude for location',
        'type' => 'number',
        'values' => '[-90.0, 90.0] Additional restrictions based on region'
      ),
      'longitude' => array(
        'label' => 'Longitude',
        'description' => 'Decimal degrees longitude for location',
        'type' => 'number',
        'values' => '[-180.0, 180.0] Additional restrictions based on region'
      ),
      'imt' => array(
        'label' => 'Intensity Measure Type',
        'description' => '',
        'type' => 'string',
        'values' => array_map('getImts', $imtFactory->getAvailable())
      ),
      'vs30' => array(
        'label' => 'Site Soil Conditions',
        'description' => '',
        'type' => 'string',
        'values' => array_map('getVs30s', $soilFactory->getAvailable())
      )
    )
  ));
}
