<?php

include_once 'Region.class.php';

class RegionFactory extends MetadataFactory {

  public function __construct ($db) {
    parent::__construct($db, 'Region');
  }

  protected function _initialize () {

    $this->query = $this->db->prepare('
      SELECT
        id,
        value,
        display,
        displayorder,
        minlatitude,
        maxlatitude,
        minlongitude,
        maxlongitude,
        uiminlatitude,
        uimaxlatitude,
        uiminlongitude,
        uimaxlongitude,
        gridspacing
      FROM
        region
      WHERE
        id = :id
    ');
    $this->query->setFetchMode(PDO::FETCH_CLASS|PDO::FETCH_PROPS_LATE,
        'Region');

    $this->queryAll = $this->db->prepare('
      SELECT
        id,
        value,
        display,
        displayorder,
        minlatitude,
        maxlatitude,
        minlongitude,
        maxlongitude,
        uiminlatitude,
        uimaxlatitude,
        uiminlongitude,
        uimaxlongitude,
        gridspacing
      FROM
        region
      ORDER BY
        displayorder ASC
    ');
    $this->queryAll->setFetchMode(PDO::FETCH_CLASS|PDO::FETCH_PROPS_LATE,
        'Region');

    $this->queryAvailable = $this->db->prepare('
      SELECT
        r.id,
        r.value,
        r.display,
        r.displayorder,
        r.minlatitude,
        r.maxlatitude,
        r.minlongitude,
        r.maxlongitude,
        r.uiminlatitude,
        r.uimaxlatitude,
        r.uiminlongitude,
        r.uimaxlongitude,
        r.gridspacing
      FROM
        region AS r
      WHERE
        EXISTS (SELECT * FROM dataset WHERE regionid = r.id)
      ORDER BY
        displayorder ASC
    ');
    $this->queryAvailable->setFetchMode(PDO::FETCH_CLASS|PDO::FETCH_PROPS_LATE,
        'Region');

    $this->queryId = $this->db->prepare('
      SELECT
        id
      FROM
        region
      WHERE
        value = :value
    ');
    $this->queryId->setFetchMode(PDO::FETCH_ASSOC);


    $this->insert = $this->db->prepare('
      INSERT INTO region
          (value, display, displayorder, minlatitude, maxlatitude,
           minlongitude, maxlongitude, uiminlatitude, uimaxlatitude,
           uiminlongitude, uimaxlongitude, gridspacing)
        VALUES
          (:value, :display, :displayorder, :minlatitude, :maxlatitude,
           :minlongitude, :maxlongitude, :uiminlatitude, :uimaxlatitude,
           :uiminlongitude, :uimaxlongitude, :gridspacing)
    ');

    $this->update = $this->db->prepare('
      UPDATE region SET
          value = :value,
          display = :display,
          displayorder = :displayorder,
          minlatitude = :minlatitude,
          maxlatitude = :maxlatitude,
          minlongitude = :minlongitude,
          maxlongitude = :maxlongitude,
          uiminlatitude = :uiminlatitude,
          uimaxlatitude = :uimaxlatitude,
          uiminlongitude = :uiminlongitude,
          uimaxlongitude = :uimaxlongitude,
          gridspacing = :gridspacing
        WHERE
          id = :id
    ');
  }

  protected function _bindParams (&$query, $instance) {
    parent::_bindParams($query, $instance);

    $query->bindValue(':minlatitude', floatval($instance->minlatitude),
        PDO::PARAM_STR);
    $query->bindValue(':maxlatitude', floatval($instance->maxlatitude),
        PDO::PARAM_STR);
    $query->bindValue(':minlongitude', floatval($instance->minlongitude),
        PDO::PARAM_STR);
    $query->bindValue(':maxlongitude', floatval($instance->maxlongitude),
        PDO::PARAM_STR);
    $query->bindValue(':uiminlatitude', floatval($instance->uiminlatitude),
        PDO::PARAM_STR);
    $query->bindValue(':uimaxlatitude', floatval($instance->uimaxlatitude),
        PDO::PARAM_STR);
    $query->bindValue(':uiminlongitude', floatval($instance->uiminlongitude),
        PDO::PARAM_STR);
    $query->bindValue(':uimaxlongitude', floatval($instance->uimaxlongitude),
        PDO::PARAM_STR);
    $query->bindValue(':gridspacing', floatval($instance->gridspacing),
        PDO::PARAM_STR);
  }
}
