'use strict';
var CollectionSelectBox = require('mvc/CollectionSelectBox'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),
    Util = require('util/Util');

var ContourTypeView = function (params) {
  var _this,
      _initialize,

      _contourType,
      _collectionSelectBox,
      _message,
      _selectBox,

      _updateContourType;

  _this = SelectedCollectionView(params);
  _collectionSelectBox = CollectionSelectBox;

  _initialize = function (params) {

    _contourType = params.contourType;

    _this.el.innerHTML = '<div class="selectBox"></div>' +
      '<div class="message"></div>';

    _selectBox = _this.el.querySelector('.selectBox');
    _message = _this.el.querySelector('.message');

    _collectionSelectBox({
      collection: _contourType,
      el: _selectBox,
      includeBlankOption: true,
      format: function (model) {
        return model.get('display');
      }
    });

    // bind to select on contour type change
    _contourType.on('select', _updateContourType, _this);
    _contourType.on('deselect', _updateContourType, _this);

    _this.render();
  };

  /**
   * Update the currently selected analysis model with the currently
   * selected contour type.
   */
  _updateContourType = function () {
    if (_this.model) {
      _this.model.set({'contourType': _contourType.getSelected()});
    }
  };

  /**
   * Calls CollectionSelectionBox.destroy() and cleans up local variables
   */
  _this.destroy = Util.compose(function () {
    _contourType.off('select', _updateContourType, _this);
    _contourType.off('deselect', _updateContourType, _this);
    _updateContourType = null;
    _contourType = null;
    _collectionSelectBox = null;
    _this = null;
    _initialize = null;
  }, _this.destroy);

  _this.render = function () {
    var contourType;

    _updateContourType();

    if (_this.model) {
      contourType = _this.model.get('contourType');
      if (contourType) {
        if (contourType.get('display') === 'Hazard Contours') {
          _message.innerHTML =
              '<small>This data is always for the B/C boundry.</small>';
        } else {
          _message.innerHTML = '';
        }
      }
    }
  };

  _initialize(params);
  params = null;
  return _this;
};

module.exports = ContourTypeView;