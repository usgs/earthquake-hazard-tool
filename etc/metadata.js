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
              "COUS0P05"
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
              "COUS0P05"
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
          "id": 1,
          "value": "COUS0P05",
          "display": "Conterminous U.S. w/ 0.05 Grid",
          "displayorder": 1,
          "minlatitude": 24.6,
          "maxlatitude": 50,
          "minlongitude": -118,
          "maxlongitude": -65,
          "gridspacing": 0.05,
          "supports": {
            "imt": [
              "PGA",
              "SA0P2",
              "SA1P0"
            ],
            "vs30": [
              "760"
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
          "id": 3,
          "value": "760",
          "display": "760 m/s - B/C Boundary",
          "displayorder": 3,
          "supports": {}
        }
      ]
    }
  }
};
