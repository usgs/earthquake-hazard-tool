'use strict';

var CollectionSelectBox = require('mvc/CollectionSelectBox'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');

/**
 * Displays a collection of editions in a collection select box,
 * The collection of editions updates when the selected calculation
 * in the collection of calculations changes.
 *
 * EditionView({
 *   el: document.createElement('div'),
 *   editions: Collection([Edition]),
 *   collection: Collection([Analysis])
 * });
 *
 * @param {[type]} params [description]
 */
var EditionView = function (params) {

  var _this,
      _initialize,

      _editionCollection,
      _editionCollectionSelectBox,

      _updateEdition;

  _this = SelectedCollectionView(params);

  /**
   * @constructor
   */
  _initialize = function (params) {
    _editionCollection = params.editions;

    _editionCollectionSelectBox = CollectionSelectBox({
      collection: _editionCollection,
      el: _this.el,
      includeBlankOption: params.includeBlankOption,
      blankOption: params.blankOption,
      format: function (model) {
        return model.get('display');
      }
    });

    // bind to select on the Edition collection
    _editionCollection.on('select', _updateEdition);
    _editionCollection.on('deselect', _updateEdition);
  };

  /**
   * update the currently selected Analysis model with
   * the currently selected Edition in the CollectionSelectBox.
   */
  _updateEdition = function () {
    var selected;

    if (_this.model) {
      selected = _editionCollection.getSelected();

      if (selected) {
        _this.model.set({'edition': selected.get('id')});
      } else {
        _this.model.set({'edition': null});
      }
    }
  };

  /**
   * Calls CollectionSelectBox.destroy() and cleans up local variables
   */
  _this.destroy = Util.compose(function () {
    // unbind
    _editionCollection.off('select', _updateEdition);
    _editionCollection.off('deselect', _updateEdition);

    // destroy
    _editionCollectionSelectBox.destroy();

    // methods
    _updateEdition = null;

    // variables
    _editionCollection = null;
    _editionCollectionSelectBox = null;

    _this = null;
    _initialize = null;
  }, _this.destroy);


  /**
   * Render the selected edition, unless it is already selected.
   * If no edition is selected then deselect.
   */
  _this.render = function (changes) {
    var edition;

    if (changes && (changes.edition || changes.model)) {
      if (_this.model) {
        edition = this.model.get('edition');

        // else select or deslect
        if (edition !== null) {
          _editionCollection.selectById(edition);
        } else {
          _editionCollection.deselect();
        }
      } else {
        // no item in the collection has been selected
        _editionCollection.deselect();
      }
    }
  };


  _initialize(params);
  params = null;
  return _this;

};

module.exports = EditionView;
