define(function(require) {
'use strict';
var pv = require('pv');

var BrowseMap = require('js/libs/BrowseMap');

var LoadItem = pv.behavior({
  'compx-nav_title': [['id']],
  model_name: 'load_item'
}, BrowseMap.Model);

return LoadItem;
});
