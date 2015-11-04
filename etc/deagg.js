module.exports = {
  'status': 'success',
  'date': '2015-11-03T09:25:48-07:00',
  'url': 'http://localhost:8080/nshmp-haz-ws/deagg/E2008/WUS/-118/34/PGA/760/2475',
  'response': [
    {
      'metadata': {
        'edition': {
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
        'region': {
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
        'latitude': 34.0,
        'longitude': -118.0,
        'imt': {
          'id': 0,
          'value': 'PGA',
          'display': 'Peak ground acceleration',
          'displayorder': 0
        },
        'returnperiod': 2475.0,
        'vs30': {
          'id': 2,
          'value': '760',
          'display': '760 m/s (B/C boundary)',
          'displayorder': 2
        },
        'rlabel': 'Closest Distance, rRup (km)',
        'mlabel': 'Magnitude (Mw)',
        'εlabel': '% Contribution to Hazard',
        'εbins': [
          {
            'id': 0,
            'min': null,
            'max': -2.25
          },
          {
            'id': 1,
            'min': -2.25,
            'max': -1.75
          },
          {
            'id': 2,
            'min': -1.75,
            'max': -1.25
          },
          {
            'id': 3,
            'min': -1.25,
            'max': -0.75
          },
          {
            'id': 4,
            'min': -0.75,
            'max': -0.25
          },
          {
            'id': 5,
            'min': -0.25,
            'max': 0.25
          },
          {
            'id': 6,
            'min': 0.25,
            'max': 0.75
          },
          {
            'id': 7,
            'min': 0.75,
            'max': 1.25
          },
          {
            'id': 8,
            'min': 1.25,
            'max': 1.75
          },
          {
            'id': 9,
            'min': 1.75,
            'max': 2.25
          },
          {
            'id': 10,
            'min': 2.25,
            'max': null
          }
        ]
      },
      'data': [
        {
          'component': 'Total',
          'data': [
            {
              'r': 5.0,
              'm': 6.95,
              'εdata': [
                {
                  'εbin': 1,
                  'value': 0.011189199
                },
                {
                  'εbin': 2,
                  'value': 0.029127169
                },
                {
                  'εbin': 3,
                  'value': 4.581656
                },
                {
                  'εbin': 4,
                  'value': 14.2808
                }
              ]
            },
            {
              'r': 5.0,
              'm': 6.85,
              'εdata': [
                {
                  'εbin': 1,
                  'value': 0.012216164
                },
                {
                  'εbin': 2,
                  'value': 0.074173967
                },
                {
                  'εbin': 3,
                  'value': 4.5342671
                },
                {
                  'εbin': 4,
                  'value': 13.890189
                },
                {
                  'εbin': 5,
                  'value': 0.0054596586
                }
              ]
            },
            {
              'r': 5.0,
              'm': 6.75,
              'εdata': [
                {
                  'εbin': 1,
                  'value': 0.018892292
                },
                {
                  'εbin': 2,
                  'value': 0.184015
                },
                {
                  'εbin': 3,
                  'value': 4.1270035
                },
                {
                  'εbin': 4,
                  'value': 11.02532
                },
                {
                  'εbin': 5,
                  'value': 0.013116178
                }
              ]
            },
            {
              'r': 5.0,
              'm': 6.65,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.0027429325
                },
                {
                  'εbin': 1,
                  'value': 0.021387232
                },
                {
                  'εbin': 2,
                  'value': 0.29600645
                },
                {
                  'εbin': 3,
                  'value': 4.5228839
                },
                {
                  'εbin': 4,
                  'value': 7.8806349
                },
                {
                  'εbin': 5,
                  'value': 0.015757381
                }
              ]
            },
            {
              'r': 5.0,
              'm': 6.55,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.0040335215
                },
                {
                  'εbin': 1,
                  'value': 0.022369127
                },
                {
                  'εbin': 2,
                  'value': 0.30185084
                },
                {
                  'εbin': 3,
                  'value': 7.8453755
                },
                {
                  'εbin': 4,
                  'value': 7.0705591
                },
                {
                  'εbin': 5,
                  'value': 0.018930435
                }
              ]
            },
            {
              'r': 5.0,
              'm': 6.45,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.0064704487
                },
                {
                  'εbin': 1,
                  'value': 0.031524187
                },
                {
                  'εbin': 2,
                  'value': 0.55981463
                },
                {
                  'εbin': 3,
                  'value': 4.2176307
                },
                {
                  'εbin': 4,
                  'value': 0.41545161
                }
              ]
            },
            {
              'r': 5.0,
              'm': 6.35,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.0095276799
                },
                {
                  'εbin': 1,
                  'value': 0.093978736
                },
                {
                  'εbin': 2,
                  'value': 0.21877253
                },
                {
                  'εbin': 3,
                  'value': 1.5215879
                },
                {
                  'εbin': 4,
                  'value': 0.056267954
                }
              ]
            },
            {
              'r': 5.0,
              'm': 6.25,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.013924454
                },
                {
                  'εbin': 1,
                  'value': 0.088129449
                },
                {
                  'εbin': 2,
                  'value': 0.21233966
                },
                {
                  'εbin': 3,
                  'value': 0.70825194
                }
              ]
            },
            {
              'r': 5.0,
              'm': 6.15,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.015419746
                },
                {
                  'εbin': 1,
                  'value': 0.052762701
                },
                {
                  'εbin': 2,
                  'value': 0.15711517
                },
                {
                  'εbin': 3,
                  'value': 0.38421116
                }
              ]
            },
            {
              'r': 5.0,
              'm': 6.05,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.0075684703
                },
                {
                  'εbin': 1,
                  'value': 0.07519983
                },
                {
                  'εbin': 2,
                  'value': 0.049682057
                },
                {
                  'εbin': 3,
                  'value': 0.35352463
                }
              ]
            },
            {
              'r': 5.0,
              'm': 5.95,
              'εdata': [
                {
                  'εbin': 1,
                  'value': 0.022331724
                },
                {
                  'εbin': 2,
                  'value': 0.29033147
                },
                {
                  'εbin': 3,
                  'value': 0.10388568
                }
              ]
            },
            {
              'r': 5.0,
              'm': 5.85,
              'εdata': [
                {
                  'εbin': 1,
                  'value': 0.02297377
                },
                {
                  'εbin': 2,
                  'value': 0.30519574
                },
                {
                  'εbin': 3,
                  'value': 0.11382465
                }
              ]
            },
            {
              'r': 5.0,
              'm': 5.75,
              'εdata': [
                {
                  'εbin': 1,
                  'value': 0.023506847
                },
                {
                  'εbin': 2,
                  'value': 0.31825062
                },
                {
                  'εbin': 3,
                  'value': 0.12440041
                }
              ]
            },
            {
              'r': 5.0,
              'm': 5.65,
              'εdata': [
                {
                  'εbin': 1,
                  'value': 0.023909106
                },
                {
                  'εbin': 2,
                  'value': 0.46474202
                }
              ]
            },
            {
              'r': 5.0,
              'm': 5.55,
              'εdata': [
                {
                  'εbin': 1,
                  'value': 0.024155984
                },
                {
                  'εbin': 2,
                  'value': 0.48482363
                }
              ]
            },
            {
              'r': 5.0,
              'm': 5.45,
              'εdata': [
                {
                  'εbin': 1,
                  'value': 0.14689502
                },
                {
                  'εbin': 2,
                  'value': 0.36450722
                }
              ]
            },
            {
              'r': 5.0,
              'm': 5.35,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.01406974
                },
                {
                  'εbin': 1,
                  'value': 0.15019435
                },
                {
                  'εbin': 2,
                  'value': 0.3310217
                }
              ]
            },
            {
              'r': 5.0,
              'm': 5.25,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.0083023083
                },
                {
                  'εbin': 1,
                  'value': 0.1678703
                },
                {
                  'εbin': 2,
                  'value': 0.29907108
                }
              ]
            },
            {
              'r': 5.0,
              'm': 5.15,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.003237115
                },
                {
                  'εbin': 1,
                  'value': 0.1393185
                },
                {
                  'εbin': 2,
                  'value': 0.30789563
                }
              ]
            },
            {
              'r': 5.0,
              'm': 5.05,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.014829907
                },
                {
                  'εbin': 1,
                  'value': 0.21202523
                },
                {
                  'εbin': 2,
                  'value': 0.1940934
                }
              ]
            },
            {
              'r': 15.0,
              'm': 6.95,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.024077766
                },
                {
                  'εbin': 1,
                  'value': 0.055584105
                },
                {
                  'εbin': 2,
                  'value': 0.21287491
                }
              ]
            },
            {
              'r': 15.0,
              'm': 6.85,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.040973817
                },
                {
                  'εbin': 1,
                  'value': 0.13729006
                },
                {
                  'εbin': 2,
                  'value': 0.23889097
                }
              ]
            },
            {
              'r': 15.0,
              'm': 6.75,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.094992073
                },
                {
                  'εbin': 1,
                  'value': 0.69230831
                },
                {
                  'εbin': 2,
                  'value': 0.087522212
                }
              ]
            },
            {
              'r': 15.0,
              'm': 6.65,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.12202521
                },
                {
                  'εbin': 1,
                  'value': 0.77459323
                },
                {
                  'εbin': 2,
                  'value': 0.0084423713
                }
              ]
            },
            {
              'r': 15.0,
              'm': 6.55,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.15332631
                },
                {
                  'εbin': 1,
                  'value': 1.4688819
                },
                {
                  'εbin': 2,
                  'value': 0.013407172
                }
              ]
            },
            {
              'r': 15.0,
              'm': 6.45,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.036224325
                },
                {
                  'εbin': 1,
                  'value': 0.31892892
                },
                {
                  'εbin': 2,
                  'value': 0.030506052
                }
              ]
            },
            {
              'r': 15.0,
              'm': 6.35,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.015288871
                },
                {
                  'εbin': 1,
                  'value': 0.1673352
                },
                {
                  'εbin': 2,
                  'value': 0.02081551
                }
              ]
            },
            {
              'r': 15.0,
              'm': 6.25,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.023624994
                },
                {
                  'εbin': 1,
                  'value': 0.064915017
                },
                {
                  'εbin': 2,
                  'value': 0.021873246
                }
              ]
            },
            {
              'r': 15.0,
              'm': 6.15,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.031506042
                },
                {
                  'εbin': 1,
                  'value': 0.028249588
                },
                {
                  'εbin': 2,
                  'value': 0.021920292
                }
              ]
            },
            {
              'r': 15.0,
              'm': 6.05,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.035413695
                },
                {
                  'εbin': 1,
                  'value': 0.070981346
                }
              ]
            },
            {
              'r': 15.0,
              'm': 5.95,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.021420172
                },
                {
                  'εbin': 1,
                  'value': 0.032845853
                }
              ]
            },
            {
              'r': 15.0,
              'm': 5.85,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.03034569
                },
                {
                  'εbin': 1,
                  'value': 0.019472199
                }
              ]
            },
            {
              'r': 15.0,
              'm': 5.75,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.034295354
                },
                {
                  'εbin': 1,
                  'value': 0.010572726
                }
              ]
            },
            {
              'r': 15.0,
              'm': 5.65,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.038577578
                }
              ]
            },
            {
              'r': 15.0,
              'm': 5.55,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.031172337
                }
              ]
            },
            {
              'r': 15.0,
              'm': 5.45,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.023128274
                }
              ]
            },
            {
              'r': 15.0,
              'm': 5.35,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.015654554
                }
              ]
            },
            {
              'r': 15.0,
              'm': 5.25,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.0090707603
                }
              ]
            },
            {
              'r': 15.0,
              'm': 5.15,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 0.0038622755
                }
              ]
            },
            {
              'r': 25.0,
              'm': 6.95,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 9.3722858E-4
                }
              ]
            },
            {
              'r': 25.0,
              'm': 6.85,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 4.3129307E-4
                }
              ]
            },
            {
              'r': 25.0,
              'm': 6.75,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 2.8180449E-4
                }
              ]
            },
            {
              'r': 25.0,
              'm': 6.65,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 1.2105037E-4
                }
              ]
            },
            {
              'r': 25.0,
              'm': 6.45,
              'εdata': [
                {
                  'εbin': 0,
                  'value': 2.6130032E-4
                }
              ]
            }
          ],
          'primarySourceSets': [
            {
              'name': 'California B-Faults CH',
              'contribution': 28.5,
              'id': -1,
              'rBar': 5.0,
              'mBar': 7.4,
              'εBar': 0.4
            },
            {
              'name': 'California B-Faults GR',
              'contribution': 22.0,
              'id': -1,
              'rBar': 6.2,
              'mBar': 6.7,
              'εBar': 0.15
            },
            {
              'name': 'CA Crustal Gridded',
              'contribution': 15.0,
              'id': -1,
              'rBar': 7.0,
              'mBar': 6.7,
              'εBar': -0.2
            }
          ],
          'primarySources': [
            {
              'name': 'Puente Hills',
              'contribution': 5.2,
              'id': 521,
              'r': 3.2,
              'm': 7.6,
              'ε': 0.5,
              'azimuth': 160.1
            },
            {
              'name': 'Elysian Park',
              'contribution': 4.0,
              'id': 431,
              'r': 5.6,
              'm': 6.8,
              'ε': 0.7,
              'azimuth': 340.0
            },
            {
              'name': 'San Andreas (Mojave)',
              'contribution': 1.2,
              'id': 44,
              'r': 32.1,
              'm': 8.2,
              'ε': 1.5,
              'azimuth': 22.3
            }
          ]
        }
      ]
    }
  ]
};
