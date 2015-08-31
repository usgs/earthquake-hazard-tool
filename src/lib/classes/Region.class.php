<?php

include_once 'Metadata.class.php';

class Region extends Metadata {

  public $minlatitude = null;
  public $maxlatitude = null;
  public $minlongitude = null;
  public $maxlongitude = null;

  public $uiminlatitude = null;
  public $uimaxlatitude = null;
  public $uiminlongitude = null;
  public $uimaxlongitude = null;

  public $gridspacing = null;

  public function __construct ($id=null, $value=null, $display=null,
      $displayorder=null, $minlatitude=null, $maxlatitude=null,
      $minlongitude=null, $maxlongitude=null,
      $uiminlatitude=null, $uimaxlatitude=null,
      $uiminlongitude=null, $uimaxlongitude=null, $gridspacing=null) {

    parent::__construct($id, $value, $display, $displayorder);

    if (isset($minlatitude)) {
      $this->minlatitude = floatval($minlatitude);
    }
    if (isset($maxlatitude)) {
      $this->maxlatitude = floatval($maxlatitude);
    }
    if (isset($minlongitude)) {
      $this->minlongitude = floatval($minlongitude);
    }
    if (isset($maxlongitude)) {
      $this->maxlongitude = floatval($maxlongitude);
    }

    if (isset($uiminlatitude)) {
      $this->uiminlatitude = floatval($uiminlatitude);
    }
    if (isset($uimaxlatitude)) {
      $this->uimaxlatitude = floatval($uimaxlatitude);
    }
    if (isset($uiminlongitude)) {
      $this->uiminlongitude = floatval($uiminlongitude);
    }
    if (isset($uimaxlongitude)) {
      $this->uimaxlongitude = floatval($uimaxlongitude);
    }

    if (isset($gridspacing)) {
      $this->gridspacing = floatval($gridspacing);
    }
  }

  public function toArray () {
    return parent::toArray() + array(
      'minlatitude' => isset($this->minlatitude) ?
          floatval($this->minlatitude) : null,
      'maxlatitude' => isset($this->maxlatitude) ?
          floatval($this->maxlatitude) : null,
      'minlongitude' => isset($this->minlongitude) ?
          floatval($this->minlongitude) : null,
      'maxlongitude' => isset($this->maxlongitude) ?
          floatval($this->maxlongitude) : null,

      'uiminlatitude' => isset($this->uiminlatitude) ?
          floatval($this->uiminlatitude) : null,
      'uimaxlatitude' => isset($this->uimaxlatitude) ?
          floatval($this->uimaxlatitude) : null,
      'uiminlongitude' => isset($this->uiminlongitude) ?
          floatval($this->uiminlongitude) : null,
      'uimaxlongitude' => isset($this->uimaxlongitude) ?
          floatval($this->uimaxlongitude) : null,



      'gridspacing' => isset($this->gridspacing) ?
          floatval($this->gridspacing) : null
    );
  }
}
