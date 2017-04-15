define(function(require) {
'use strict';
var pv = require('pv');
var spv = require('spv');

var BrowseMap = require('js/libs/BrowseMap');
var d3geo = require('d3-geo');

var po = function (obj) {
  return [obj.lng, obj.lat];
}

// var earth_radius_meters = 6371000;
var earth_radius_milis = 3963.1676;

var values_map = {
  id: 'id',
  broker: null,
  age: null,
  equipment: null,
  pickup: null,
  price: null,
  weight: null,
  width: null,
  drop_off: null,
  load_size: null,
  length: null,
}

var props = {
	source: 'response.0', // FIXME path is wrong
	props_map: values_map
};

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
  req_map: [
    [
      Object.keys(values_map),
      props,
      ['#truckloads', [
        ['id'],
        function(api, opts, id) {
          return api.get('/shipments/search/' + id, {}, opts);
        }
      ]]
    ],
		[
			['route'],
			function (r) {
        return {
          route: r.routes[0].overview_polyline,
        }
			},
      ['#google-directions-service', [
        ['pickup', 'drop_off'],
        function (api, opts, pickup, drop_off) {
          return api.request(function (resolve, reject, api) {
            api.route({
                origin: locationName(pickup),
                destination: locationName(drop_off),
                travelMode: window.google.maps.TravelMode.DRIVING
              }, function (result, status) {
                if (status !== window.google.maps.DirectionsStatus.OK) {
                  return reject(status);
                }
                return resolve(result);
              }
            );
          });
        }
      ]]
		],
  ],
  'compx-map_url': [
    ['pickup', 'drop_off', 'route'],
    function (pickup, drop_off, route) {
      if (!pickup || !drop_off || !route) {return;}

      return mapURL(pickup.location, drop_off.location, route)
    }
  ],
  model_name: 'load_item'
}, BrowseMap.Model);


function locationName(location_point) {
  return location_point.address.city + ', ' + location_point.address.state;
}

function location(loc) {
  return loc.lat + ',' + loc.lng;
}

function marker(label, color, loc) {
  return '&markers=label:' + label + '|color:' + color + '|' + loc;
}

function markers(from, to) {
  return '' + marker('O', 'green', location(from)) + marker('D', 'red', location(to));
}

function mapURL(from, to, polyline) {
  var imageSrc = 'https://maps.googleapis.com/maps/api/staticmap?size=640x160&scale=2&path=weight:5|color:blue';
  imageSrc += polyline.length < 2000 - imageSrc.length - 5 ? '|enc:' + polyline : '';
  imageSrc += markers(from, to);
  return imageSrc;
}

return LoadItem;
});
