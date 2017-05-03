<?php

echo navItem('/example.html', 'Example Index');

echo navGroup('Input',
  navItem('/input/LocationExample.php', 'Location')
);

echo navGroup('Other',
  navItem('/AnalysisView.html', 'Analysis View') .
  navItem('/AnalysisCollectionView.html', 'Analysis Collection View') .
  navItem('/DependencyFactory.html', 'Dependency Factory') .
  navItem('/Fullscreen.html', 'Fullscreen') .
  navItem('/HazardCurveGraphView.html', 'Hazard Curve GraphView') .
  navItem('/HazardResponse.html', 'Hazard Response') .
  navItem('/LayerControl.html', 'Layer Control') .
  navItem('/MapView.html', 'Map View') .
  navItem('/ResponseSpectrumGraphView.html', 'Response Spectrum Graph View')
);
