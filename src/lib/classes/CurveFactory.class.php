<?php

include_once 'Curve.class.php';

class CurveFactory {

  public static $EXCEPTION_NO_ID = 'No curve id found for input parameters.';
  public static $EXCEPTION_MULT_IDS =
      'Multiple curve ids found for input parameters.';

  public static $EXCEPTION_NO_CURVE = 'No curve found for input id.';
  public static $EXCEPTION_MULT_CURVES = 'Multiple curves found for input id.';


  public function __construct ($db) {
    $this->db = $db;
    $this->_initialize();
  }

  public function get ($id) {
    $this->queryCurve->setFetchMode(PDO::FETCH_CLASS|PDO::FETCH_PROPS_LATE,
        'Curve');
    $this->queryCurve->bindValue(':id', intval($id), PDO::PARAM_INT);

    $this->queryCurve->execute();
    $curves = $this->queryCurve->fetchAll();

    $numCurves = count($curves);
    $this->queryCurve->closeCursor();

    if ($numCurves < 1) {
      throw new Exception(self::$EXCEPTION_NO_CURVE);
    } else if ($numCurves > 1) {
      throw new Exception(self::$EXCEPTION_MULT_CURVES);
    } else {
      return $curves[0];
    }
  }

  public function getAll ($latitude, $longitude, $datasetid, $gridspacing) {
    $this->queryCurves->setFetchMode(PDO::FETCH_ASSOC);

    $this->queryCurves->bindValue(':maxlat', floatval($latitude + $gridspacing),
        PDO::PARAM_STR);
    $this->queryCurves->bindValue(':minlat', floatval($latitude - $gridspacing),
        PDO::PARAM_STR);
    $this->queryCurves->bindValue(':maxlng', floatval($longitude + $gridspacing),
        PDO::PARAM_STR);
    $this->queryCurves->bindValue(':minlng', floatval($longitude - $gridspacing),
        PDO::PARAM_STR);
    $this->queryCurves->bindValue(':datasetid', intval($datasetid),
        PDO::PARAM_INT);

    $this->queryCurves->execute();
    $curves = $this->queryCurves->fetchAll();

    for ($i = 0; $i < count($curves); $i++) {
      $curve = $curves[$i];

      $curves[$i] = new Curve(intval($curve['id']), intval($datasetid),
          $curve['latitude'], $curve['longitude'],
          $this->_dbStringToArray($curve['afe']));
    }

    return $curves;
  }

  public function getId ($datasetid, $latitude, $longitude) {
    $this->queryId->bindValue(':datasetid', intval($datasetid), PDO::PARAM_INT);
    $this->queryId->bindValue(':latitude', floatval($latitude), PDO::PARAM_STR);
    $this->queryId->bindValue(':longitude', floatval($longitude),
        PDO::PARAM_STR);

    $this->queryId->execute();
    $ids = $this->queryId->fetchAll(PDO::FETCH_ASSOC);
    $numIds = count($ids);

    if ($numIds < 1) {
      throw new Exception(self::$EXCEPTION_NO_ID);
    } else if ($numIds > 1) {
      throw new Exception(self::$EXCEPTION_MULT_IDS);
    } else {
      return intval($ids[0]['id']);
    }
  }

  public function set ($curve, $skipIdLookup = false) {
    if ($curve->id === null) {
      return $this->_create($curve, $skipIdLookup);
    } else {
      return $this->_update($curve, $skipIdLookup);
    }
  }


  private function _initialize () {
    $this->queryCurve = $this->db->prepare('
      SELECT
        id,
        datasetid,
        latitude,
        longitude,
        afe
      FROM
        curve
      WHERE
        id = :id
    ');

    $this->queryCurves = $this->db->prepare('
      SELECT
        id,
        latitude,
        longitude,
        afe
      FROM
        curve
      WHERE
        datasetid = :datasetid AND
        latitude < :maxlat AND
        latitude > :minlat AND
        longitude < :maxlng AND
        longitude > :minlng
      ORDER BY
        latitude DESC,
        longitude ASC
    ');

    $this->queryId = $this->db->prepare('
      SELECT
        id
      FROM
        curve
      WHERE
        datasetid = :datasetid AND
        latitude = :latitude AND
        longitude = :longitude
    ');


    $this->insertCurve = $this->db->prepare('
      INSERT INTO curve (datasetid, latitude, longitude, afe) VALUES
          (:datasetid, :latitude, :longitude, :afe)
    ');

    $this->updateCurve = $this->db->prepare('
      UPDATE curve SET
        datasetid = :datasetid,
        latitude = :latitude,
        longitude = :longitude,
        afe = :afe
      WHERE
        id = :id
    ');
  }

  private function _create ($curve, $skipIdLookup = false) {
    $datasetid = intval($curve->datasetid);
    $latitude = floatval($curve->latitude);
    $longitude = floatval($curve->longitude);

    $this->insertCurve->bindValue(':datasetid', $datasetid, PDO::PARAM_INT);
    $this->insertCurve->bindValue(':latitude', $latitude, PDO::PARAM_STR);
    $this->insertCurve->bindValue(':longitude', $longitude, PDO::PARAM_STR);
    $this->insertCurve->bindValue(':afe',
        $this->_arrayToDbString($curve->yvals), PDO::PARAM_STR);

    $this->insertCurve->execute();

    if (!$skipIdLookup) {
      $curve->id = $this->getId($datasetid, $latitude, $longitude);
    }

    return $curve;
  }

  private function _update ($curve, $skipIdLookup = false) {
    $id = intval($curve->id);
    $datasetid = intval($curve->datasetid);
    $latitude = floatval($curve->latitude);
    $longitude = floatval($curve->longitude);

    $this->updateCurve->bindValue(':id', $id, PDO::PARAM_INT);
    $this->updateCurve->bindValue(':datasetid', $datasetid, PDO::PARAM_INT);
    $this->updateCurve->bindValue(':latitude', $latitude, PDO::PARAM_STR);
    $this->updateCurve->bindValue(':longitude', $longitude, PDO::PARAM_STR);
    $this->updateCurve->bindValue(':afe',
        $this->_arrayToDbString($curve->yvals), PDO::PARAM_STR);

    $this->updateCurve->execute();

    if (!$skipIdLookup) {
      $curve->id = $this->getId($datasetid, $latitude, $longitude);
    }

    return $curve;
  }

  private function _dbStringToArray ($string) {
    return array_map('floatval', explode(',', substr($string, 1, -1)));
  }

  private function _arrayToDbString ($array) {
    return '{' . implode(',', $array) . '}';
  }
}
