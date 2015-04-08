<?php

include_once 'Dataset.class.php';

class DatasetFactory {

  public static $EXCEPTION_NO_DATASET = 'No dataset found for input id.';
  public static $EXCEPTION_MULT_DATASETS =
      'Mulitple datasets found for input id.';

  public static $EXCEPTION_NO_ID = 'No id found for input parameters.';
  public static $EXCEPTION_MULT_IDS =
      'Multiple ids found for input parameters.';


  private $db = null;

  private $queryDataset = null;


  public function __construct ($db) {
    $this->db = $db;
    $this->_initialize();
  }


  public function get ($id) {
    $this->queryDataset->bindValue(':id', intval($id), PDO::PARAM_INT);

    $this->queryDataset->execute();
    $datasets = $this->queryDataset->fetchAll(PDO::FETCH_ASSOC);
    $numDatasets = count($datasets);

    $this->queryDataset->closeCursor();

    if ($numDatasets < 1) {
      throw new Exception (self::$EXCEPTION_NO_DATASET);
    } else if ($numDatasets > 1) {
      throw new Exception (self::$EXCEPTION_MULT_DATASETS);
    } else {
      $dataset = $datasets[0];
      $dataset['iml'] = $this->_dbStringToArray($dataset['iml']);

      return Dataset::fromArray($dataset);
    }
  }

  public function getId ($imt, $soil, $edition, $region) {
    $this->queryId->bindValue(':imt', intval($imt), PDO::PARAM_INT);
    $this->queryId->bindValue(':soil', intval($soil), PDO::PARAM_INT);
    $this->queryId->bindValue(':edition', intval($edition), PDO::PARAM_INT);
    $this->queryId->bindValue(':region', intval($region), PDO::PARAM_INT);

    $this->queryId->execute();
    $ids = $this->queryId->fetchAll(PDO::FETCH_ASSOC);
    $numIds = count($ids);

    $this->queryId->closeCursor();

    if ($numIds < 1) {
      throw new Exception(self::$EXCEPTION_NO_ID);
    } else if ($numIds > 1) {
      throw new Exception(self::$EXCEPTION_MULT_IDS);
    } else {
      return intval($ids[0]['id']);
    }
  }

  public function set ($dataset) {
    if ($dataset->id === null) {
      // No id, create new dataset
      return $this->_create($dataset);
    } else {
      // Existing id, update dataset
      return $this->_update($dataset);
    }
  }

  private function _initialize () {
    $this->queryDataset = $this->db->prepare('
      SELECT
        id,
        imtid,
        soilid,
        editionid,
        regionid,
        iml
      FROM
        dataset
      WHERE
        id = :id
    ');

    $this->queryId = $this->db->prepare('
      SELECT
        id
      FROM
        dataset
      WHERE
        imtid = :imt AND
        soilid = :soil AND
        editionid = :edition AND
        regionid = :region
    ');


    $this->insertDataset = $this->db->prepare('
      INSERT INTO dataset (imtid, soilid, editionid, regionid, iml) VALUES
          (:imt, :soil, :edition, :region, :iml)
    ');

    $this->updateDataset = $this->db->prepare('
      UPDATE dataset SET
        imt = :imt,
        soil = :soil,
        edition = :edition,
        region = :region,
        iml = :iml
      WHERE
        id = :id
    ');
  }

  private function _create ($dataset) {
    $imt = intval($dataset->imt);
    $soil = intval($dataset->soil);
    $edition = intval($dataset->edition);
    $region = intval($dataset->region);

    $this->insertDataset->bindValue(':imt', $imt, PDO::PARAM_INT);
    $this->insertDataset->bindValue(':soil', $soil, PDO::PARAM_INT);
    $this->insertDataset->bindValue(':edition', $edition, PDO::PARAM_INT);
    $this->insertDataset->bindValue(':region', $region, PDO::PARAM_INT);
    $this->insertDataset->bindValue(':iml',
        $this->_arrayToDbString($dataset->iml), PDO::PARAM_STR);

    $this->insertDataset->execute();
    $dataset->id = $this->getId($imt, $soil, $edition, $region);

    return $dataset;
  }

  private function _update ($dataset) {
    $id = intval($dataset->id);
    $imt = intval($dataset->imt);
    $soil = intval($dataset->soil);
    $edition = intval($dataset->edition);
    $region = intval($dataset->region);

    $this->updateDataset->bindValue(':id', $id, PDO::PARAM_INT);
    $this->updateDataset->bindValue(':imt', $imt, PDO::PARAM_INT);
    $this->updateDataset->bindValue(':soil', $soil, PDO::PARAM_INT);
    $this->updateDataset->bindValue(':edition', $edition, PDO::PARAM_INT);
    $this->updateDataset->bindValue(':region', $region, PDO::PARAM_INT);
    $this->updateDataset->bindValue(':iml',
        $this->_arrayToDbString($dataset->iml), PDO::PARAM_STR);

    $this->updateDataset->bindValue(':id', $id, PDO::PARAM_INT);

    return $dataset;
  }


  private function _dbStringToArray ($string) {
    return array_map('floatval', explode(',', substr($string, 1, -1)));
  }

  private function _arrayToDbString ($array) {
    return '{' . implode(',', $array) . '}';
  }
}
