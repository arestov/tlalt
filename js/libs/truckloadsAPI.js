define(function(require) {
'use strict';

var spv = require('spv');
var aReq = require('js/modules/aReq');
var wrapRequest = require('js/modules/wrapRequest');
var hex_md5 = require('hex_md5');

return function(url, config) {
  config = config || {};

  var send = function(method, resource, params, options) {
    var cache_key = options.cache_key || hex_md5(url + resource + spv.stringifyParams(params));
    var wrap_def = wrapRequest({
      url: url + resource,
      type: method,
      dataType: "json",
      data: JSON.stringify(params),
      contentType: 'application/json; charset=utf-8',
      timeout: 20000,
      resourceCachingAvailable: true,
      afterChange: function(opts) {
        debugger;
        if (opts.dataType == 'json'){
          opts.headers = null;
        }
      },
      thisOriginAllowed: config.thisOriginAllowed,
      context: options.context,
      headers: {
        client: 'tlalt/0.0.1',
      }
    }, {
      cache_ajax: config.cache_ajax,
      nocache: options.nocache,
      cache_key: cache_key,
      cache_timeout: options.cache_timeout,
      cache_namespace: config.cache_namespace,
      requestFn: aReq,
      queue: config.queue,
    });

    return wrap_def.complex;
  }

  return {
    source_name: 'truckerpath',
    errors_fields: ['api_errors'],
    get: function(resource, params, options) {
      return send('GET', resource, params, options);
    },
    post: function(resource, params, options) {
      return send('POST', resource, params, options);
    },
  };

};
});
