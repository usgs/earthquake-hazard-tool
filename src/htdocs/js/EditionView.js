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
     * update the currently selected Analysis model  with
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
    // methods
    _updateEdition = null;
    // variables
    _editionCollection = null;
    _this = null;
    _initialize = null;
  }, _this.destroy);

  /**
   * unset the event bindings for the collection
   */
  _this.onCollectionDeselect = function () {
    _this.model.off('change', _updateEdition, _this);
    _this.model = null;
    _this.render();
  };

  /**
   * set event bindings for the collection
   */
  _this.onCollectionSelect = function () {
    _this.model = _this.collection.getSelected();
    _this.model.on('change', _updateEdition, _this);
    _this.render();
  };

  // render the selected edition, or the blank option
  _this.render = function () {
    var edition;

    // Update selected edition when collection changes
    if (_this.model) {
      edition = _this.model.get('edition');
      _editionCollection.select(edition);
    } else {
      _editionCollection.deselect();
    }
  };

  _initialize(params);
  params = null;
  return _this;

};

module.exports = EditionView;
