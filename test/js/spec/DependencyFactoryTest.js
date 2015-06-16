/* global chai, describe, it */
'use strict';

var DependencyFactory = require('DependencyFactory');

var metadata = require('etc/metadata');

var expect = chai.expect;

describe('DependencyFactory test suite.', function () {
  describe('Constructor', function () {
    it('can be created and destroyed', function () {
      var createDestroy = function () {
        var view = DependencyFactory();
        view.destroy();
      };

      expect(createDestroy).to.not.throw('Error');
    });
  });

  describe('DependencyFactory dependency filtering.', function () {
    var factory,
        allEditions,
        allContourTypes,
        allRegions,
        allSiteClasses,
        allSpectralPeriods,
        allTimeHorizons;

    factory = DependencyFactory.getInstance();

    it('can get all Editions', function () {
      factory.whenReady(function () {
        allEditions = factory.getAllEditions();
        expect(metadata.parameters.edition.values.length).to.equal(
            allEditions.data().length);
      });
    });

    it('can get all Contour Types', function () {
      factory.whenReady(function () {
        allContourTypes = factory.getAllContourTypes();
        expect(metadata.parameters.contourType.values.length).to.equal(
            allContourTypes.data().length);
      });
    });

    it('can get all Regions', function () {
      factory.whenReady(function () {
        allRegions = factory.getAllRegions();
        expect(metadata.parameters.region.values.length).to.equal(
            allRegions.data().length);
      });
    });

    it('can get all Site Classes', function () {
      factory.whenReady(function () {
        allSiteClasses = factory.getAllSiteClasses();
        expect(metadata.parameters.vs30.values.length).to.equal(
            allSiteClasses.data().length);
      });
    });

    it('can get all Spectral Periods', function () {
      factory.whenReady(function () {
        allSpectralPeriods = factory.getAllSpectralPeriods();
        expect(metadata.parameters.imt.values.length).to.equal(
            allSpectralPeriods.data().length);
      });
    });

    it('can get all Time Horizons', function () {
      factory.whenReady(function () {
        allTimeHorizons = factory.getAllTimeHorizons();
        expect(metadata.parameters.timeHorizon.values.length).to.equal(
            allTimeHorizons.data().length);
      });
    });
  });


  describe('DependencyFactory dependency filtering.', function () {
    var factory,
        filteredContourTypes,
        filteredSiteClasses,
        filteredSpectralPeriods,
        filteredTimeHorizons,
        edition,
        latitude,
        longitude;

    factory = DependencyFactory.getInstance();
    edition = 3;
    latitude = 40;
    longitude = -105;

    it('can get filtered Contour Types', function () {
      factory.whenReady(function () {
        filteredContourTypes = factory.getFilteredContourTypes(edition);
        expect(filteredContourTypes.data().length).to.equal(1);
      });
    });

    it('can get filtered Site Classes', function () {
      factory.whenReady(function () {
        filteredSiteClasses = factory.getFilteredSiteClasses(
            edition, latitude, longitude);
        expect(filteredSiteClasses.data().length).to.equal(1);
      });
    });

    it('can get filtered Spectral Periods', function () {
      factory.whenReady(function () {
        filteredSpectralPeriods = factory.getFilteredSpectralPeriods(
            edition, latitude, longitude);
        expect(filteredSpectralPeriods.data().length).to.equal(1);
      });
    });

    it('can get filtered Time Horizons', function () {
      factory.whenReady(function () {
        filteredTimeHorizons = factory.getFilteredTimeHorizons(edition);
        expect(filteredTimeHorizons.data().length).to.equal(1);
      });
    });
  });

});

