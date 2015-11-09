'use strict';

var SelectedCollectionView = require('mvc/SelectedCollectionView');

var DeaggregationReportView = function (params) {
  var _this,
      _initialize;

  _this = SelectedCollectionView(params);

  _initialize = function () {
    _this.render();
  };

  _this.render = function () {
    _this.el.innerHTML = 'Go Pats!!';

  };

  _initialize(params);
  params = null;
  return _this;
};

module.exports = DeaggregationReportView;