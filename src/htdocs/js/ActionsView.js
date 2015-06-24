'use strict';

var Accordion = require('accordion/Accordion'),

    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');

/**
 * Displays a collection of editions in a collection select box,
 * The collection of editions updates when the selected calculation
 * in the collection of calculations changes.
 *
 * EditionView({
 *   el: document.createElement('div'),
 *   collection: Collection([Analysis])
 * });
 *
 * @param {[type]} params [description]
 */
var EditionView = function (params) {

  var _this,
      _initialize,

      _accordion;

  _this = SelectedCollectionView(params);

  /**
   * @constructor
   */
  _initialize = function () {
    _accordion = Accordion({
      el: _this.el,
      accordions: [
        {
          toggleElement: 'div',
          toggleText: 'ActionsView',
          content: 'TODO, CollectionView',
          classes: 'accordion-closed'
        }
      ]
    });
  };

  /**
   * Calls CollectionSelectBox.destroy() and cleans up local variables
   */
  _this.destroy = Util.compose(function () {
    _accordion = null;
    _this = null;
    _initialize = null;
  }, _this.destroy);


  /**
   * Render the selected edition, unless it is already selected.
   * If no edition is selected then deselect.
   */
  _this.render = function () {

  };


  _initialize(params);
  params = null;
  return _this;

};

module.exports = EditionView;
