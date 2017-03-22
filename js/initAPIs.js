define(function (require) {
'use strict';
var truckloadsAPI = require('js/libs/truckloadsAPI');
var FuncsQueue = require('js/libs/FuncsQueue');

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


  return addQueue;
};

});
