<?php

class Dataset {

  public $id = null;
  public $imt = null;
  public $vs30 = null;
  public $edition = null;
  public $region = null;
  public $iml = null;

  public function __construct ($id, $imt, $vs30, $edition, $region, $iml) {
    $this->id = $id;
    $this->imt = $imt;
    $this->vs30 = $vs30;
    $this->edition = $edition;
    $this->region = $region;
    $this->iml = $iml;
  }

  public function toArray () {
    return array(
      'id'      => intval($this->id),
      'imt'     => intval($this->imt),
      'vs30'    => intval($this->vs30),
      'edition' => intval($this->edition),
      'region'  => intval($this->region),
      'iml'     => $this->iml
    );
  }

  public static function fromArray ($array) {
    return new Dataset(
      isset($array['id'])      ? intval($array['id'])      : null,
      isset($array['imt'])     ? intval($array['imt'])     : null,
      isset($array['vs30'])    ? intval($array['vs30'])    : null,
      isset($array['edition']) ? intval($array['edition']) : null,
      isset($array['region'])  ? intval($array['region'])  : null,
      isset($array['iml'])     ? $array['iml']             : null
    );
  }
}
