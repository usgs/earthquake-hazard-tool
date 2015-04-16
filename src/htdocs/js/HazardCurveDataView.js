'use strict';

var View = require('mvc/View'),
    Util = require('util/Util');

var HazardCurveDataView = function (options) {
  var _this,
      _initialize,

      // variables
      _curves,
      _table,
      _selected,

      // methods
      _getColumns,
      _getXValues,
      _onClick,
      _onSelect;

  _this = View(options);

  _initialize = function (options) {

    options = Util.extend({}, options);

    _curves = options.collection;

    _this.render();

    _table = _this.el.querySelector('.hazard-curve-data-view');
    _table.addEventListener('click', _onClick);
    _curves.on('add', _this.render);
    _curves.on('remove', _this.render);
    _curves.on('reset', _this.render);
    _curves.on('select', _onSelect);
    _curves.on('deselect', _onSelect);
  };

  /** accepts and array of points and returns an array of x-values */
  _getXValues = function (points) {
    var xPoints = [];
    for (var i = 0; i < points.length; i++) {
      xPoints.push(points[i][0]);
    }
    return xPoints;
  };

  _onClick = function (e) {
    var el = e.target,
        id;

    if (el.nodeName !== 'TD') {
      return;
    }

    // get curve id, and select the curve in the collection
    id = el.getAttribute('data-id');
    if (_curves.get(id) !== _selected) {
      _curves.selectById(id);
    }
  };

  _onSelect = function (curve) {
    var tableCells,
        tableCellClass,
        i;

    if (curve === _selected) {
      return;
    }

    // set the previously selected object in the collection
    _selected = _curves.getSelected();
    tableCellClass = curve.get('label').replace(/ /g, '-');

    // highlight the cells in the column if they are not already highlighted
    tableCells = document.querySelectorAll('.selected');
    for (i = 0; i < tableCells.length; i++) {
      tableCells[i].classList.remove('selected');
    }
    tableCells = document.querySelectorAll('.' + tableCellClass);
    for (i = 0; i < tableCells.length; i++) {
      tableCells[i].classList.add('selected');
    }
  };


  /**
   * Render the view.
   */
  _this.render = function () {
    var c,
        i,
        id,
        markup = [],
        label = null,
        point = null,
        curves = [],
        xValues = [];

    curves = _curves.data();

    if (curves.length === 0) {
      _this.el.innerHTML = '<p>There are no curves to display.</p>';
      return;
    }

    // isolate the x-values from the curve data
    xValues = _getXValues(curves[0].get('data'));

    markup.push('<table class="tabular hazard-curve-data-view"><thead>');
    markup.push('<th class="x-values blank"></th>');
    for (c = 0; c < curves.length; c++) {
      label = curves[c].get('label');
      id = curves[c].get('id');
      markup.push('<th>' + label + '</th>');
    }

    markup.push('</thead><tbody>');
    for (i = 0; i < xValues.length; i++) {
      // set x-value as row header
      markup.push('<tr><th>' + xValues[i] + '</th>');
      for (c = 0; c < curves.length; c++) {
        point = curves[c].get('data')[i][1];
        label = curves[c].get('label');
        markup.push('<td data-id="' + id + '" class="' +
            label.replace(/ /g, '-') + '">' + point.toExponential(5) + '</td>');
      }
      markup.push('</tr>');
    }
    markup.push('</tbody></table>');
    _this.el.innerHTML = markup.join('');
  };


  _this.destroy = Util.compose(function () {
    // bindings
    _table.removeEventListener('click', _onClick);
    _curves.off('add', _this.render);
    _curves.off('remove', _this.render);
    _curves.off('reset', _this.render);
    _curves.off('select', _onSelect);
    _curves.off('deselect', _onSelect);
    // variables
    _curves = null;
    _table = null;
    _selected = null;
    // methods
    _getColumns = null;
    _getXValues = null;
    _onClick = null;
    _onSelect = null;
  }, _this.destroy);

  _initialize(options);
  options = null;
  return _this;
};

module.exports = HazardCurveDataView;
