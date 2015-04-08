<?php

class Dataset {

  public $id = null;
  public $imt = null;
  public $edition = null;
  public $region = null;
  public $iml = null;

  public function __construct ($id, $imt, $soil, $edition, $region, $iml) {
    $this->id = $id;
    $this->imt = $imt;
    $this->soil = $soil;
    $this->edition = $edition;
    $this->region = $region;
    $this->iml = $iml;
  }

  public function toArray () {
    return array(
      'id'      => intval($this->id),
      'imt'     => intval($this->imt),
      'soil'    => intval($this->soil),
      'edition' => intval($this->edition),
      'region'  => intval($this->region),
      'iml'     => $this->iml
    );
  }

  public static function fromArray ($array) {
    return new Dataset(
      isset($array['id'])      ? intval($array['id'])      : null,
      isset($array['imt'])     ? intval($array['imt'])     : null,
      isset($array['soil'])    ? intval($array['soil'])    : null,
      isset($array['edition']) ? intval($array['edition']) : null,
      isset($array['region'])  ? intval($array['region'])  : null,
      isset($array['iml'])     ? $array['iml']             : null
    );
  }
}
