define(function(require) {
'use strict';

// var spv = require('spv');
// var aReq = require('js/modules/aReq');
// var wrapRequest = require('js/modules/wrapRequest');
// var hex_md5 = require('hex_md5');

var Promise = require('Promise');
// var extendPromise = require('js/modules/extendPromise');

// var toBigPromise = extendPromise.toBigPromise;


return function(key, google_maps) {
  return {
    key: key,
    source_name: 'google.com',
    errors_fields: ['api_errors'],
    request: function (fn) {
      return new Promise(function(resolve, reject) {
        fn(resolve, reject, google_maps);
      });
      // var complex_response = toBigPromise(deferred);
      //
      //
      //
      // var queued_promise = new Promise(function(resolve, reject) {
      // 	asSend = resolve;
      // 	asAbort = reject;
      // });
      // queued_promise.asAbort = asAbort;
      // complex_response.queued_promise = queued_promise;
      // deferred.queued = options.queue.add(sendRequest, options.not_init_queue);
    }
  };

};
});
