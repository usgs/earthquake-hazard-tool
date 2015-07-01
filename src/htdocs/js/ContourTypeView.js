'use strict';

var Meta = require('Meta'),

    Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');

var CONTOUR_TYPES = [
  {
    'id': 'hazard',
    'value': 'hazard',
    'display': 'Gridded Hazard',
    'displayorder': 1
  }
];

var ContourTypeView = function (params) {
  var _this,
      _initialize,

      _contourTypeCollection,
      _collectionSelectBox,
      _message,
      _selectBox,

      _updateContourType;

  _this = SelectedCollectionView(params);

  _initialize = function (params) {

    _contourTypeCollection = Collection(CONTOUR_TYPES.map(Meta));

    _this.el.innerHTML = '<div class="selectBox"></div>' +
      '<div class="message"></div>';

    _selectBox = _this.el.querySelector('.selectBox');
    _message = _this.el.querySelector('.message');

    _collectionSelectBox = CollectionSelectBox({
      collection: _contourTypeCollection,
      el: _selectBox,
      includeBlankOption: params.includeBlankOption,
      blankOption: params.blankOption,
      format: function (model) {
        return model.get('display');
      }
    });

    // bind to select on contour type change
    _contourTypeCollection.on('select', _updateContourType, _this);
    _contourTypeCollection.on('deselect', _updateContourType, _this);

    _this.render();
  };

  /**
   * Update the currently selected analysis model with the currently
   * selected contour type.
   */
  _updateContourType = function () {
    var contourType;

    if (_this.model) {
      if (_contourTypeCollection.getSelected()) {
        contourType = _contourTypeCollection.getSelected().id;
      } else {
        contourType = null;
      }
      // set the value of the selected item in _contourTypeCollection
      _this.model.set({'contourType': contourType});
    }
  };

  /**
   * Calls CollectionSelectionBox.destroy() and cleans up local variables
   */
  _this.destroy = Util.compose(function () {

    _contourTypeCollection.destroy();
    _contourTypeCollection.off('select', _updateContourType, _this);
    _contourTypeCollection.off('deselect', _updateContourType, _this);

    _collectionSelectBox = null;
    _contourTypeCollection = null;
    _initialize = null;
    _message = null;
    _this = null;
    _updateContourType = null;

  }, _this.destroy);

  _this.render = function () {
    var contourType;

    _message.innerHTML = '';

    if (_this.model) {
      contourType = _this.model.get('contourType');
      if (contourType === null) {
        _contourTypeCollection.deselect();
      } else {
        _contourTypeCollection.selectById(contourType);

        if (contourType === 0) {
          _message.innerHTML =
              '<small>This data is always for the B/C boundry.</small>';
        }
      }
    } else {
      _contourTypeCollection.deselect();
    }
  };

  _initialize(params);
  params = null;
  return _this;
};

module.exports = ContourTypeView;