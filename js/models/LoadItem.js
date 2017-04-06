define(function(require) {
'use strict';
var pv = require('pv');

var BrowseMap = require('js/libs/BrowseMap');
var d3geo = require('d3-geo');

var po = function (obj) {
  return [obj.lng, obj.lat];
}

// var earth_radius_meters = 6371000;
var earth_radius_milis = 3963.1676;


var LoadItem = pv.behavior({
  'compx-nav_title': [['id']],
  'compx-trip_length': [
    ['pickup', 'drop_off'],
    function (pickup, drop_off) {
      if (!pickup || !drop_off) {return;}

      var length = d3geo.geoDistance(po(pickup.location), po(drop_off.location)) * earth_radius_milis;
      return Math.round(length);
    }
  ],
  model_name: 'load_item'
}, BrowseMap.Model);

return LoadItem;
});
