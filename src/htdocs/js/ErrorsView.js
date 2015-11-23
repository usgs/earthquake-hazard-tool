'use strict';

var View = require('mvc/View'),

    Message = require('util/Message'),
    Util = require('util/Util');

var ErrorsView = function (params) {

  var _this,
      _initialize,

      _errors;

  _this = View(params);

  _initialize = function () {
    // error object that stores error messages
    _errors = {};
  };

  /**
   * Build an input keyed object with an array of errors for each input.
   */
  _this.addErrors = function (e) {
    _errors[e.input] = e.messages;
    // _this.render();
  };

  /**
   * Remove errors from _errors for the input type passed in.
   */
  _this.removeErrors = function (e) {
    if (_errors[e.input]) {
      _errors[e.input] = null;
    }
    // _this.render();
  };

  /**
   * Render the error output
   */
  _this.render = function () {
    var classes,
        markup;

    classes = [];
    markup = [];
    _this.el.innerHTML = '';

    // remove errors
    if (!_errors.edition && !_errors.location && !_errors.siteClass &&
        !_errors.spectralPeriod && !_errors.timeHorizon) {
      return;
    }

    // display errors
    classes.push('alert');
    classes.push('error');
    classes.push('application-errors');

    markup.push('<b>Errors:</b>');
    markup.push('<ul class="error-list">');

    // replicate the input order with the error output
    if (_errors.edition) {
      markup.push('<li>' + _errors.edition.join('</li><li>') + '</li>');
    }

    if (_errors.location) {
      markup.push('<li>' + _errors.location.join('</li><li>') + '</li>');
    }

    if (_errors.siteClass) {
      markup.push('<li>' + _errors.siteClass.join('</li><li>') + '</li>');
    }

    if (_errors.timeHorizon) {
      markup.push('<li>' + _errors.timeHorizon.join('</li><li>') + '</li>');
    }

    markup.push('</ul>');

    markup = markup.join('');

    Message({
      classes: classes,
      // container: _this.el,
      content: markup
    });
  };

  _this.destroy = Util.compose(function () {

    _initialize = null;
    _this = null;

    _errors = null;

  }, _this.destroy);


  _initialize();
  params = null;
  return _this;

};

module.exports = ErrorsView;
