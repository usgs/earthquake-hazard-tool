'use strict';

var Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
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

      _updateEdition;

  _this = SelectedCollectionView(params);

  /**
   * @constructor
   */
  _initialize = function (params) {

    // editions CollectionSelectBox
    _editionCollection = params.editions || Collection();

    CollectionSelectBox({
      collection: _editionCollection,
      el: _this.el,
      includeBlankOption: true,
      format: function (model) {
        return model.get('display');
      }
    });

    // bind to select on the Edition collection
    _editionCollection.on('select', _updateEdition, _this);
    _editionCollection.on('deselect', _updateEdition, _this);

    // select the edition in the currently selected Analysis
    _this.render();
  };

  /**
   * update the currently selected Analysis model with
   * the currently selected Edition in the CollectionSelectBox.
   */
  _updateEdition = function () {
    if (_this.model) {
      _this.model.set({'edition': _editionCollection.getSelected()});
    }
  };

  /**
   * Calls CollectionSelectBox.destroy() and cleans up local variables
   */
  _this.destroy = Util.compose(function () {
    // unbind
    _editionCollection.off('select', _updateEdition, _this);
    _editionCollection.off('deselect', _updateEdition, _this);
    // methods
    _updateEdition = null;
    // variables
    _editionCollection = null;
    _this = null;
    _initialize = null;
  }, _this.destroy);


  /**
   * Render the selected edition, unless it is already selected.
   * If no edition is selected then deselect.
   */
  _this.render = function () {
    var edition;

    // Update selected edition when collection changes
    if (_this.model) {

      edition = this.model.get('edition');

      // else select or deslect
      if (edition !== null) {
        _editionCollection.select(edition);
      } else {
        _editionCollection.deselect();
      }
    } else {
      _editionCollection.deselect();
    }
  };


  _initialize(params);
  params = null;
  return _this;

};

module.exports = EditionView;
