define(function (require) {
'use strict';
var pv = require('pv');
var LoadableListBase = require('./LoadableListBase');

var SelectedPoints = pv.behavior({
  zero_map_level: true,
}, LoadableListBase);
return SelectedPoints;
});
