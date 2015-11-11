'use strict';

var BASE_PORT = 8500;

var config = {
  build: '.build',
  buildPort: BASE_PORT,
  dataPort: BASE_PORT + 7,
  dist: 'dist',
  distPort: BASE_PORT + 3,
  etc: 'etc',
  example: 'example',
  examplePort: BASE_PORT + 4,
  liveReloadPort: BASE_PORT + 9,
  src: 'src',
  templatePort: BASE_PORT + 8,
  test: 'test',
  testPort: BASE_PORT + 1
};

module.exports = config;
