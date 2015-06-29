/* global before, chai, describe, it */
'use strict';

var DependencyFactory = require('DependencyFactory');

var metadata = require('etc/metadata');

var expect = chai.expect;

describe('DependencyFactory test suite.', function () {
  describe('Constructor', function () {
    it('can be created and destroyed', function (done) {
      var create,
          destroy,
          factory;

      create = function () {
        factory = DependencyFactory.getInstance();
      };

      destroy = function () {
        factory.destroy();
      };

      expect(create).to.not.throw('Error');

      factory.whenReady(function () {
        expect(destroy).to.not.throw('Error');
        done();
      });
    });
  });

  describe('DependencyFactory dependency get all.', function () {
    var factory,
        allEditions,
        // allContourTypes,
        allRegions,
        allSiteClasses,
        allSpectralPeriods;


    before(function (done) {
      factory = DependencyFactory.getInstance();
      factory.whenReady(done);
    });

    it('can get all Editions', function () {
      allEditions = factory.getAllEditions();
      expect(metadata.parameters.edition.values.length).to.equal(
          allEditions.length);
    });

    // it('can get all Contour Types', function () {
    //   allContourTypes = factory.getAllContourTypes();
    //   expect(metadata.parameters.contourType.values.length).to.equal(
    //       allContourTypes.length);
    // });

    it('can get all Regions', function () {
      allRegions = factory.getAllRegions();
      expect(metadata.parameters.region.values.length).to.equal(
          allRegions.length);
    });

    it('can get all Site Classes', function () {
      allSiteClasses = factory.getAllSiteClasses();
      expect(metadata.parameters.vs30.values.length).to.equal(
          allSiteClasses.length);
    });

    it('can get all Spectral Periods', function () {
      allSpectralPeriods = factory.getAllSpectralPeriods();
      expect(metadata.parameters.imt.values.length).to.equal(
          allSpectralPeriods.length);
    });

  });

});

