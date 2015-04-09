<?php

include_once 'Metadata.class.php';

class MetadataFactory {

  protected $db = null;
  protected $classname = null;

  protected static $EXCEPTION_NO_RESULT = 'No %s found for input id.';
  protected static $EXCEPTION_MULT_RESULTS = 'Multiple %ss found for input id.';

  protected static $EXCEPTION_NO_ID =
      'No id found for input %s parameters.';
  protected static $EXCEPTION_MULT_IDS =
      'Mutiple ids found for input %s parameters.';

  public function __construct ($db, $classname) {
    $this->db = $db;
    $this->classname = $classname;
    $this->_initialize();
  }

  public function get ($id) {
    $this->query->bindValue(':id', intval($id), PDO::PARAM_INT);

    $this->query->execute();
    $results = $this->query->fetchAll();

    $numResults = count($results);

    $this->query->closeCursor();

    if ($numResults < 1) {
      throw new Exception(sprintf(
          self::$EXCEPTION_NO_RESULT, $this->classname));
    } else if ($numResults > 1) {
      throw new Exception(sprintf(
          self::$EXCEPTION_MULT_RESULTS, $this->classname));
    } else {
      return $results[0];
    }
  }

  public function getAll () {
    $this->queryAll->execute();
    $results = $this->queryAll->fetchAll();

    $this->queryAll->closeCursor();

    return $results;
  }

  public function getAvailable () {
    $this->queryAvailable->execute();
    $results = $this->queryAvailable->fetchAll();

    $this->queryAvailable->closeCursor();

    return $results;
  }

  public function getId ($value) {
    $this->queryId->bindValue(':value', $value, PDO::PARAM_STR);

    $this->queryId->execute();
    $results = $this->queryId->fetchAll();
    $numResults = count($results);

    $this->queryId->closeCursor();

    if ($numResults < 1) {
      throw new Exception(sprintf(
          self::$EXCEPTION_NO_ID, $this->classname));
    } else if ($numResults > 1) {
      throw new Exception(sprintf(
          self::$EXCEPTION_MULT_IDS, $this->classname));
    } else {
      return intval($results[0]['id']);
    }
  }

  public function set ($instance) {
    if ($instance->id === null) {
      try {
        // No id yet. Look for existing record to update
        $instance->id = $this->getId($instance->value);
      } catch (Exception $e) {
        // No id found, try creating new
        return $this->_create($instance);
      }
    }

    return $this->_update($instance);
  }


  protected function _initialize () {
    $tablename = strtolower($this->classname);

    $this->query = $this->db->prepare('
      SELECT
        id,
        value,
        display,
        displayorder
      FROM
        ' . $tablename . '
      WHERE
        id = :id
    ');
    $this->query->setFetchMode(PDO::FETCH_CLASS|PDO::FETCH_PROPS_LATE,
        'Metadata');

    $this->queryAll = $this->db->prepare('
      SELECT
        id,
        value,
        display,
        displayorder
      FROM
        ' . $tablename . '
      ORDER BY
        displayorder ASC
    ');
    $this->queryAll->setFetchMode(PDO::FETCH_CLASS|PDO::FETCH_PROPS_LATE,
        'Metadata');

    $this->queryAvailable = $this->db->prepare('
      SELECT
        m.id,
        m.value,
        m.display,
        m.displayorder
      FROM
        ' . $tablename . ' AS m
      WHERE
        EXISTS (SELECT * FROM dataset WHERE ' . $tablename . 'id = m.id)
      ORDER BY
        m.displayorder ASC
    ');
    $this->queryAvailable->setFetchMode(PDO::FETCH_CLASS|PDO::FETCH_PROPS_LATE,
        'Metadata');

    $this->queryId = $this->db->prepare('
      SELECT
        id
      FROM
        ' . $tablename . '
      WHERE
        value = :value
    ');
    $this->queryId->setFetchMode(PDO::FETCH_ASSOC);


    $this->insert = $this->db->prepare('
      INSERT INTO ' . $tablename . '
          (value, display, displayorder)
        VALUES
          (:value, :display, :displayorder)
    ');

    $this->update = $this->db->prepare('
      UPDATE ' . $tablename . ' SET
          value = :value,
          display = :display,
          displayorder = :displayorder
        WHERE
          id = :id
    ');
  }

  protected function _create ($instance) {
    $this->_bindParams($this->insert, $instance);

    $this->insert->execute();
    $this->insert->closeCursor();

    $instance->id = $this->getId($instance->value);
    return $instance;
  }

  protected function _update ($instance) {
    $this->update->bindValue(':id', intval($instance->id), PDO::PARAM_INT);
    $this->_bindParams($this->update, $instance);

    $this->update->execute();
    $this->update->closeCursor();

    return $instance;
  }

  protected function _bindParams (&$query, $instance) {
    $query->bindValue(':value', $instance->value, PDO::PARAM_STR);
    $query->bindValue(':display', $instance->display, PDO::PARAM_STR);
    $query->bindValue(':displayorder', intval($instance->displayorder),
        PDO::PARAM_INT);
  }
}
