define(function (require) {
'use strict';
var google_maps = require('google_maps');
var truckloadsAPI = require('js/libs/truckloadsAPI');
var googleAPI = require('js/libs/googleAPI');
var FuncsQueue = require('js/libs/FuncsQueue');
var config = require('config');

return function (self, app_env, cache_ajax, resortQueue) {
  self.all_queues = [];

  var addQueue = function(step) {
    step.reverse_default_prio = true;
    self.all_queues.push(step);
    return step;
  };

  self.useInterface(
    'truckloads',
    truckloadsAPI('https://test-api.truckerpath.com', {
      crossdomain: true,
      thisOriginAllowed: true,
      cache_namespace: 'truckloads',
      queue: new FuncsQueue({
        time: [300, 3000 , 7],
        resortQueue: resortQueue,
        init: addQueue
      }),
    })
  );

  self.useInterface('google-maps', googleAPI(config.googleKey, google_maps));
  self.useInterface('google-directions-service', googleAPI(config.googleKey, new google_maps.DirectionsService()));

  return addQueue;
};

});
