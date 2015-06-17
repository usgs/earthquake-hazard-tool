'use strict';
var CollectionSelectBox = require('mvc/CollectionSelectBox'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),
    Util = require('util/Util');

var ContourTypeView = function (params) {
  var _this,
      _initialize,

      _contourType,

      _updateContourType;

  _this = SelectedCollectionView(params);

  _initialize = function () {
    _contourType = params.contourType;

    CollectionSelectBox({
      collection: _contourType,
      el: _this.el,
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
      _this.model.set({'contourType': _contourType.getSelected()},
          {'silent': true});
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
    _this = null;
    _initialize = null;
  }, _this.destroy);

  _this.render = function () {
    var contourType;

    if (_this.model) {
      contourType = _this.model.get('contourType');
      _contourType.value = contourType;
      if (contourType === 'Gridded Hazard')  {
        _this.el.innerHTML =
            '<p> This data is always for the B//C Boundry </p>';
      }
    }
  };

  _initialize(params);
  return _this;
};

module.exports = ContourTypeView;