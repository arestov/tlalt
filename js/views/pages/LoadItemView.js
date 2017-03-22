define(function (require) {
'use strict';
var spv = require('spv');
var View= require('View');

var LoadItemView = spv.inh(View, {}, {
  base_tree: {
    sample_name: 'load_item'
  },
});

return LoadItemView;
});
