module.exports = {
  "status": "usage",
  "description": "Retrieves hazard curve data for an input location",
  "syntax": "http://localhost:8500/hazws/staticcurve/1/{edition}/{region}/{longitude}/{latitude}/{imt}/{vs30}",
  "parameters": {
    "edition": {
      "label": "Model edition",
      "type": "string",
      "values": [
        {
          "id": 3,
          "value": "E2008R3",
          "display": "USGS NSHM 2008 Rev. 3",
          "displayorder": 3,
          "supports": {
            "region": [
              0,
              1,
              2
            ],
            "contourType": [
              0
            ]
          }
        },
        {
          "id": 4,
          "value": "E2014R1",
          "display": "USGS NSHM 2014 Rev. 1",
          "displayorder": 4,
          "supports": {
            "region": [
              0,
              1,
              2
            ],
            "contourType": [
              0
            ]
          }
        }
      ]
    },
    "region": {
      "label": "Model region",
      "type": "string",
      "values": [
        {
          "id": 0,
          "value": "COUS",
          "display": "Conterminous US",
          "displayorder": 0,
          "minlatitude": 24.6,
          "maxlatitude": 50,
          "minlongitude": -118,
          "maxlongitude": -65,
          "gridspacing": 0.05,
          "supports": {
            "imt": [
              1
            ],
            "vs30": [
              2
            ]
          }
        },
        {
          "id": 1,
          "value": "WUS",
          "display": "Western US",
          "displayorder": 1,
          "minlatitude": 24.6,
          "maxlatitude": 50,
          "minlongitude": -118,
          "maxlongitude": -115,
          "gridspacing": 0.05,
          "supports": {
            "imt": [
              1,
              4,
              8
            ],
            "vs30": [
              1,
              2,
              3,
              4,
              5,
              6
            ]
          }
        },
        {
          "id": 2,
          "value": "CEUS",
          "display": "Central & Eastern US",
          "displayorder": 2,
          "minlatitude": 24.6,
          "maxlatitude": 50,
          "minlongitude": -100,
          "maxlongitude": -65,
          "gridspacing": 0.05,
          "supports": {
            "imt": [
              1,
              4,
              8
            ],
            "vs30": [
              0,
              2
            ]
          }
        }
      ]
    },
    "latitude": {
      "label": "Latitude (in decimal degrees)",
      "type": "number",
      "values": {
        "minimum": -90,
        "maximum": 90
      }
    },
    "longitude": {
      "label": "Longitude (in decimal degrees)",
      "type": "number",
      "values": {
        "minimum": -180,
        "maximum": 360
      }
    },
    "imt": {
      "label": "Intensity measure type",
      "type": "string",
      "values": [
        {
          "id": 1,
          "value": "PGA",
          "display": "Peak Ground Acceleration",
          "displayorder": 1,
          "supports": {}
        },
        {
          "id": 4,
          "value": "SA0P2",
          "display": "0.20 Second Spectral Acceleration",
          "displayorder": 4,
          "supports": {}
        },
        {
          "id": 8,
          "value": "SA1P0",
          "display": "1.00 Second Spectral Acceleration",
          "displayorder": 8,
          "supports": {}
        }
      ]
    },
    "vs30": {
      "label": "Site soil (Vs30)",
      "type": "string",
      "values": [
        {
          "id": 0,
          "value": "2000",
          "display": "2000 m/s (Site class A)",
          "displayorder": 0
        },
        {
          "id": 1,
          "value": "1150",
          "display": "1150 m/s (Site class B)",
          "displayorder": 1
        },
        {
          "id": 2,
          "value": "760",
          "display": "760 m/s (B/C boundary)",
          "displayorder": 2
        },
        {
          "id": 3,
          "value": "537",
          "display": "537 m/s (Site class C)",
          "displayorder": 3
        },
        {
          "id": 4,
          "value": "360",
          "display": "360 m/s (C/D boundary)",
          "displayorder": 4
        },
        {
          "id": 5,
          "value": "259",
          "display": "259 m/s (Site class D)",
          "displayorder": 5
        },
        {
          "id": 6,
          "value": "180",
          "display": "180 m/s (D/E boundary)",
          "displayorder": 6
        }
      ]
    },
    "contourType": {
      "label": "Contour Types",
      "type": "string",
      "values": [
        {
          "id": 0,
          "value": "Hazard Contours",
          "display": "Hazard Contours",
          "displayorder": 0
        },
        {
          "id": 1,
          "value": "Gridded Hazard",
          "display": "Gridded Hazard",
          "displayorder": 1
        }
      ]
    }
  }
};
