'use strict';

var L = require('leaflet');

var Z_BASELAYER_INDEX = 0,
    Z_OVERLAY_INDEX = 100,
    Z_DATASET_INDEX = 1000;

module.exports = {
  baseLayers: [
    {
      id: 1,
      value: 'Terrain',
      layer: L.tileLayer('http://{s}.arcgisonline.com/ArcGIS/rest/services/' +
          'NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}.jpg', {
        subdomains: ['server', 'services'],
        zIndex: Z_BASELAYER_INDEX + 1,
        attribution: 'Content may not reflect National Geographic\'s ' +
            'current map policy. Sources: National Geographic, Esri, ' +
            'DeLorme, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, ' +
            'GEBCO, NOAA, increment P Corp.'
      })
    },
    {
      id: 2,
      value: 'Grayscale',
      layer: L.tileLayer('http://{s}.arcgisonline.com/ArcGIS/rest/services/' +
          'Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.jpg', {
        subdomains: ['server', 'services'],
        zIndex: Z_BASELAYER_INDEX + 2,
        attribution: 'Sources: Esri, DeLorme, HERE, MapmyIndia,  &copy; ' +
            'OpenStreetMap contributors, and the GIS community'
      })
    },
    {
      id: 3,
      value: 'Street',
      layer: L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/osm/' +
          '{z}/{x}/{y}.jpg', {
        subdomains: '1234',
        zIndex: Z_BASELAYER_INDEX + 3,
        attribution: 'Portions Courtesy NASA/JPL-Caltech and U.S. ' +
            'Depart. of Agriculture, Farm Service Agency'
      })
    },
    {
      id: 4,
      value: 'Satellite',
      layer: L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/sat/' +
          '{z}/{x}/{y}.jpg', {
        subdomains: '1234',
        zIndex: Z_BASELAYER_INDEX + 4,
        attribution: '<a href="http://www.openstreetmap.org/copyright">' +
            '&copy; OpenStreetMap contributors</a>'
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
      layer: L.tileLayer('http://geohazards.cr.usgs.gov/arcgis/rest/' +
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
      layer: L.tileLayer('http://geohazards.cr.usgs.gov/arcgis/rest/' +
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
      layer: L.tileLayer('http://geohazards.cr.usgs.gov/arcgis/rest/' +
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
      layer: L.tileLayer('http://geohazards.cr.usgs.gov/arcgis/rest/' +
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
      layer: L.tileLayer('http://geohazards.cr.usgs.gov/arcgis/rest/' +
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
      layer: L.tileLayer('http://geohazards.cr.usgs.gov/arcgis/rest/' +
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
      layer: L.tileLayer('http://geohazards.usgs.gov/arcgis/rest/' +
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
      layer: L.tileLayer('http://geohazards.usgs.gov/arcgis/rest/' +
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
      layer: L.tileLayer('http://geohazards.usgs.gov/arcgis/rest/' +
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
      layer: L.tileLayer('http://geohazards.usgs.gov/arcgis/rest/' +
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
      layer: L.tileLayer('http://geohazards.usgs.gov/arcgis/rest/' +
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
      layer: L.tileLayer('http://geohazards.usgs.gov/arcgis/rest/' +
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
          layer: L.tileLayer('http://geohazards.usgs.gov/arcgis/rest/' +
              'services/hazfaults2014/MapServer/tile/{z}/{y}/{x}', {
            zIndex: Z_DATASET_INDEX,
          })
        },
        {
          edition: 'E2008R3',
          layer: L.tileLayer('http://geohazards.usgs.gov/arcgis/rest/' +
              'services/hazfaults/MapServer/tile/{z}/{y}/{x}', {
            zIndex: Z_DATASET_INDEX + 1
          })
        }
      ]
    }
  ]
};
