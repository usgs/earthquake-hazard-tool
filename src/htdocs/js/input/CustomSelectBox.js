'use strict';

var CollectionSelectBox = require('mvc/CollectionSelectBox'),
    Util = require('util/Util');


var _DEFAULTS = {
  format: function (model) { return model.get('display'); },
  getValidOptions: false
};


/**
 * Extends the default CollectionSelectBox, but adds a feature to
 * allow options to be disabled based on a validating method provided
 * as an option during instantiation. Also, this implementation defaults to
 * using the model's "display" property rather than the id.
 *
 * @param params {Object}
 *      Configuration parameters. In addition to those defined by the parent
 *      CollectionSelectBox, includes:
 *
 *       - getValidOptions {Function} [Array{ID} :: function ()]
 *         If this parameter is falsey, no filtering is performed.
 */
var CustomSelectBox = function (params) {
  var _this,
      _initialize,

      _blankOption,
      _collection,
      _getValidOptions;


  params = Util.extend({}, _DEFAULTS, params);
  _this = CollectionSelectBox(params);

  _initialize = function (params) {
    _blankOption = params.blankOption;
    _collection = params.collection;
    _getValidOptions = params.getValidOptions;
  };



  _this.destroy = Util.compose(function () {
    _collection = null;
    _getValidOptions = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.render = Util.compose(_this.render, function () {
    var options,
        selected,
        validOptions;

    options = _this.el.querySelectorAll('option');
    selected = _collection.getSelected();

    if (!_getValidOptions) {
      return;
    }

    validOptions = _getValidOptions();

    Array.prototype.forEach.call(options, function (option) {
      if (_blankOption && _blankOption.value === option.value) {
        return;
      }

      if (validOptions.indexOf(option.value) === -1) {
        // Current option is not valid, disable
        option.setAttribute('disabled', 'disabled');

        if (selected && option.value === selected.id) {
          // Current selection is not valid, deselect
          _collection.deselect();
        }
      }
    });
  });

  _initialize(params);
  params = null;
  return _this;
};

module.exports = CustomSelectBox;
