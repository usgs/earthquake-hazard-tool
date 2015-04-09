<?php

class Metadata {

  public $id = null;
  public $value = null;
  public $display = null;
  public $displayorder = null;

  public function __construct ($id=null, $value=null, $display=null,
      $displayorder=null) {

    if (isset($id)) {
      $this->id = intval($id);
    }

    if (isset($value)) {
      $this->value = $value;
    }

    if (isset($display)) {
      $this->display = $display;
    }

    if (isset($displayorder)) {
      $this->displayorder = intval($displayorder);
    }
  }

  public function toArray () {
    return array(
      'id' => $this->id,
      'value' => $this->value,
      'display' => $this->display,
      'displayorder' => $this->displayorder
    );
  }
}
