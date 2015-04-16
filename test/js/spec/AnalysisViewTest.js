/* global chai, sinon, describe, it, beforeEach, afterEach */
'use strict';

var Analysis = require('Analysis'),
    AnalysisView = require('AnalysisView');

var expect = chai.expect;

describe('AnalysisView test suite.', function () {
  describe('Constructor', function () {
    it('can be created and destroyed', function () {
      var createDestroy = function () {
        var view = AnalysisView();
        view.destroy();
      };

      expect(createDestroy).to.not.throw('Error');
    });
  });

  describe('model bindings', function () {
    var renderSpy,
        analysis,
        view;

    beforeEach(function () {
      analysis = Analysis();
      view = AnalysisView({
        model: analysis,
        el: document.createElement('li')
      });

      renderSpy = sinon.spy(view, 'render');
    });

    afterEach(function () {
      renderSpy.restore();
      analysis = null;
      view.destroy();
      view = null;
    });

    it('should render when analysis changes', function () {
      analysis.trigger('change');
      expect(renderSpy.callCount).to.equal(1);
    });
  });
});
