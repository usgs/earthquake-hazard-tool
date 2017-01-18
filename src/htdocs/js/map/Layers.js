/* global L */
'use strict';

var Grayscale = require('leaflet/layer/Grayscale'),
    HazardFault2008 = require('leaflet/layer/HazardFault2008'),
    HazardFault2014 = require('leaflet/layer/HazardFault2014'),
    Satellite = require('leaflet/layer/Satellite'),
    Street = require('leaflet/layer/Street'),
    Terrain = require('leaflet/layer/Terrain');


var Z_BASELAYER_INDEX = 0,
    Z_OVERLAY_INDEX = 100,
    Z_DATASET_INDEX = 1000;

module.exports = {
  baseLayers: [
    {
      id: 1,
      value: 'Terrain',
      layer: Terrain({
        zIndex: Z_BASELAYER_INDEX + 1
      })
    },
    {
      id: 2,
      value: 'Grayscale',
      layer: Grayscale({
        zIndex: Z_BASELAYER_INDEX + 2
      })
    },
    {
      id: 3,
      value: 'Street',
      layer: Street({
        zIndex: Z_BASELAYER_INDEX + 3
      })
    },
    {
      id: 4,
      value: 'Aerial',
      layer: Satellite({
        zIndex: Z_BASELAYER_INDEX + 4
      })
    }
  ],
  overlays: [
    // 2014
    {
      id: 1,
      edition: 'E2014R1',
      type: 'hazard',
      imt: 'PGA',
      period: '2P50',
      vs30: '760',
      layer: L.tileLayer('https://geohazards.cr.usgs.gov/arcgis/rest/' +
          'services/USpga250_2014/MapServer/tile/{z}/{y}/{x}', {
        zIndex: Z_OVERLAY_INDEX + 1,
        attribution: 'USGS - NSHMP'
      })
    },
    {
      id: 2,
      edition: 'E2014R1',
      type: 'hazard',
      imt: 'SA0P2',
      period: '2P50',
      vs30: '760',
      layer: L.tileLayer('https://geohazards.cr.usgs.gov/arcgis/rest/' +
          'services/US5hz250_2014/MapServer/tile/{z}/{y}/{x}', {
        zIndex: Z_OVERLAY_INDEX + 2,
        attribution: 'USGS - NSHMP'
      })
    },
    {
      id: 3,
      edition: 'E2014R1',
      type: 'hazard',
      imt: 'SA1P0',
      period: '2P50',
      vs30: '760',
      layer: L.tileLayer('https://geohazards.cr.usgs.gov/arcgis/rest/' +
          'services/US1hz250_2014/MapServer/tile/{z}/{y}/{x}', {
        zIndex: Z_OVERLAY_INDEX + 3,
        attribution: 'USGS - NSHMP'
      })
    },
    {
      id: 4,
      edition: 'E2014R1',
      type: 'hazard',
      imt: 'PGA',
      period: '10P50',
      vs30: '760',
      layer: L.tileLayer('https://geohazards.cr.usgs.gov/arcgis/rest/' +
          'services/USpga050_2014/MapServer/tile/{z}/{y}/{x}', {
        zIndex: Z_OVERLAY_INDEX + 4,
        attribution: 'USGS - NSHMP'
      })
    },
    {
      id: 5,
      edition: 'E2014R1',
      type: 'hazard',
      imt: 'SA0P2',
      period: '10P50',
      vs30: '760',
      layer: L.tileLayer('https://geohazards.cr.usgs.gov/arcgis/rest/' +
          'services/US5hz050_2014/MapServer/tile/{z}/{y}/{x}', {
        zIndex: Z_OVERLAY_INDEX + 5,
        attribution: 'USGS - NSHMP'
      })
    },
    {
      id: 6,
      edition: 'E2014R1',
      type: 'hazard',
      imt: 'SA1P0',
      period: '10P50',
      vs30: '760',
      layer: L.tileLayer('https://geohazards.cr.usgs.gov/arcgis/rest/' +
          'services/US1hz050_2014/MapServer/tile/{z}/{y}/{x}', {
        zIndex: Z_OVERLAY_INDEX + 6,
        attribution: 'USGS - NSHMP'
      })
    },

    // 2008
    {
      id: 7,
      edition: 'E2008R3',
      type: 'hazard',
      imt: 'PGA',
      period: '2P50',
      vs30: '760',
      layer: L.tileLayer('https://geohazards.usgs.gov/arcgis/rest/' +
          'services/USpga250_2008/MapServer/tile/{z}/{y}/{x}', {
        zIndex: Z_OVERLAY_INDEX + 7,
        attribution: 'USGS - NSHMP'
      })
    },
    {
      id: 8,
      edition: 'E2008R3',
      type: 'hazard',
      imt: 'SA0P2',
      period: '2P50',
      vs30: '760',
      layer: L.tileLayer('https://geohazards.usgs.gov/arcgis/rest/' +
          'services/US5hz250_2008/MapServer/tile/{z}/{y}/{x}', {
        zIndex: Z_OVERLAY_INDEX + 8,
        attribution: 'USGS - NSHMP'
      })
    },
    {
      id: 9,
      edition: 'E2008R3',
      type: 'hazard',
      imt: 'SA1P0',
      period: '2P50',
      vs30: '760',
      layer: L.tileLayer('https://geohazards.usgs.gov/arcgis/rest/' +
          'services/US1hz250_2008/MapServer/tile/{z}/{y}/{x}', {
        zIndex: Z_OVERLAY_INDEX + 9,
        attribution: 'USGS - NSHMP'
      })
    },

    {
      id: 10,
      edition: 'E2008R3',
      type: 'hazard',
      imt: 'PGA',
      period: '10P50',
      vs30: '760',
      layer: L.tileLayer('https://geohazards.usgs.gov/arcgis/rest/' +
          'services/USpga050_2008/MapServer/tile/{z}/{y}/{x}', {
        zIndex: Z_OVERLAY_INDEX + 10,
        attribution: 'USGS - NSHMP'
      })
    },
    {
      id: 11,
      edition: 'E2008R3',
      type: 'hazard',
      imt: 'SA0P2',
      period: '10P50',
      vs30: '760',
      layer: L.tileLayer('https://geohazards.usgs.gov/arcgis/rest/' +
          'services/US5hz050_2008/MapServer/tile/{z}/{y}/{x}', {
        zIndex: Z_OVERLAY_INDEX + 11,
        attribution: 'USGS - NSHMP'
      })
    },
    {
      id: 12,
      edition: 'E2008R3',
      type: 'hazard',
      imt: 'SA1P0',
      period: '10P50',
      vs30: '760',
      layer: L.tileLayer('https://geohazards.usgs.gov/arcgis/rest/' +
          'services/US1hz050_2008/MapServer/tile/{z}/{y}/{x}', {
        zIndex: Z_OVERLAY_INDEX + 12,
        attribution: 'USGS - NSHMP'
      })
    }
  ],
  datasets: [
    {
      id: 'faults',
      value: 'Faults',
      overlays: [
        {
          edition: 'E2014R1',
          layer: HazardFault2014({
            clickable: true,
            zIndex: Z_DATASET_INDEX
          })
        },
        {
          edition: 'E2008R3',
          layer: HazardFault2008({
            clickable: true,
            zIndex: Z_DATASET_INDEX + 1
          })
        }
      ]
    }
  ]
};
