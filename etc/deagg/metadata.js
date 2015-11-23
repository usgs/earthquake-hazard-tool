module.exports = {
  'status': 'usage',
  'description': 'Deaggregate hazard at an input location',
  'syntax': '/deagg/data.json',
  'parameters': {
    'returnperiod': {
      'label': 'Return period (in years)',
      'type': 'number',
      'values': {
        'minimum': 1.0,
        'maximum': 4000.0
      }
    },
    'edition': {
      'label': 'Model edition',
      'type': 'string',
      'values': [
        {
          'id': 0,
          'value': 'E2008',
          'display': 'USGS NSHM 2008 Dynamic',
          'displayorder': 100,
          'supports': {
            'region': [
              'CEUS',
              'WUS',
              'COUS'
            ]
          }
        },
        {
          'id': 1,
          'value': 'E2014',
          'display': 'USGS NSHM 2014 Dynamic',
          'displayorder': 0,
          'supports': {
            'region': [
              'CEUS',
              'WUS',
              'COUS'
            ]
          }
        }
      ]
    },
    'region': {
      'label': 'Model region',
      'type': 'string',
      'values': [
        {
          'id': 0,
          'value': 'CEUS',
          'display': 'Central & Eastern US',
          'displayorder': 0,
          'minlatitude': 24.6,
          'maxlatitude': 50.0,
          'minlongitude': -115.0,
          'maxlongitude': -65.0,
          'uiminlatitude': 24.6,
          'uimaxlatitude': 50.0,
          'uiminlongitude': -110.0,
          'uimaxlongitude': -65.0,
          'supports': {
            'imt': [
              'PGA',
              'SA0P2',
              'SA1P0'
            ],
            'vs30': [
              '2000',
              '760'
            ]
          }
        },
        {
          'id': 1,
          'value': 'WUS',
          'display': 'Western US',
          'displayorder': 1,
          'minlatitude': 24.6,
          'maxlatitude': 50.0,
          'minlongitude': -125.0,
          'maxlongitude': -100.0,
          'uiminlatitude': 24.6,
          'uimaxlatitude': 50.0,
          'uiminlongitude': -125.0,
          'uimaxlongitude': -115.0,
          'supports': {
            'imt': [
              'PGA',
              'SA0P2',
              'SA1P0'
            ],
            'vs30': [
              '1150',
              '760',
              '537',
              '360',
              '259',
              '180'
            ]
          }
        },
        {
          'id': 2,
          'value': 'COUS',
          'display': 'Conterminous US',
          'displayorder': 2,
          'minlatitude': 24.6,
          'maxlatitude': 50.0,
          'minlongitude': -125.0,
          'maxlongitude': -65.0,
          'uiminlatitude': 24.6,
          'uimaxlatitude': 50.0,
          'uiminlongitude': -125.0,
          'uimaxlongitude': -65.0,
          'supports': {
            'imt': [
              'PGA',
              'SA0P2',
              'SA1P0'
            ],
            'vs30': [
              '760'
            ]
          }
        }
      ]
    },
    'longitude': {
      'label': 'Longitude (in decimal degrees)',
      'type': 'number',
      'values': {
        'minimum': -180.0,
        'maximum': 360.0
      }
    },
    'latitude': {
      'label': 'Latitude (in decimal degrees)',
      'type': 'number',
      'values': {
        'minimum': -90.0,
        'maximum': 90.0
      }
    },
    'imt': {
      'label': 'Intensity measure type',
      'type': 'string',
      'values': [
        {
          'id': 0,
          'value': 'PGA',
          'display': 'Peak ground acceleration',
          'displayorder': 0
        },
        {
          'id': 22,
          'value': 'SA0P2',
          'display': '0.2 sec spectral acceleration',
          'displayorder': 22
        },
        {
          'id': 32,
          'value': 'SA1P0',
          'display': '1.0 sec spectral acceleration',
          'displayorder': 32
        }
      ]
    },
    'vs30': {
      'label': 'Site soil (Vs30)',
      'type': 'string',
      'values': [
        {
          'id': 0,
          'value': '2000',
          'display': '2000 m/s (Site class A)',
          'displayorder': 0
        },
        {
          'id': 1,
          'value': '1150',
          'display': '1150 m/s (Site class B)',
          'displayorder': 1
        },
        {
          'id': 2,
          'value': '760',
          'display': '760 m/s (B/C boundary)',
          'displayorder': 2
        },
        {
          'id': 3,
          'value': '537',
          'display': '537 m/s (Site class C)',
          'displayorder': 3
        },
        {
          'id': 4,
          'value': '360',
          'display': '360 m/s (C/D boundary)',
          'displayorder': 4
        },
        {
          'id': 5,
          'value': '259',
          'display': '259 m/s (Site class D)',
          'displayorder': 5
        },
        {
          'id': 6,
          'value': '180',
          'display': '180 m/s (D/E boundary)',
          'displayorder': 6
        }
      ]
    }
  }
};
