define(function (require) {
'use strict';
var pv = require('pv');
var spv = require('spv');
var LoadableListBase = require('./LoadableListBase');

var settingsByCountry = {};

var getSettings = function(country) {
  if (!settingsByCountry[country]) {
    settingsByCountry[country] = {
      types: ['(regions)'],
      componentRestrictions: {country: country},
    };
  }
  return settingsByCountry[country];
};

var SelectedPoints = pv.behavior({
  zero_map_level: true,
  model_name: 'selected-points',
  main_list_name: 'points_list',
  'nest_rqc-points_list': pv.Model,
  'nest_req-points_list': [
    [{
      is_array: true,
      source: 'items',
      props_map: {
        id: 'id',
        // broker: null,
        // age: null,
        // equipment: null,
        // pickup: null,
        // price: null,
        // weight: null,
        // width: null,
        // drop_off: null,
        // load_size: null,
        // length: null,
      }
    }],
    ['#google-places-autocomplete-service', [
      ['search_query'],
      function(api, opts, search_query) {
        var params = spv.cloneObj({
          input: search_query,
        }, getSettings('us'));

        return api.request(function (resolve, reject, api) {
          api.getPlacePredictions(params, function (results, status) {
            var statuses = google.maps.places.PlacesServiceStatus;

            if (status === statuses.OK || status === statuses.ZERO_RESULTS) {
              resolve(results || []);
            } else {
              reject(status);
            }
          });
        });
      }
    ]]
  ]
}, LoadableListBase);
return SelectedPoints;
});
