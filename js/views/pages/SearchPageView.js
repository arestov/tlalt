define(function (require) {
'use strict';
var spv = require('spv');
var SPView= require('./SPView');

var StartPageView = spv.inh(SPView, {}, {
  base_tree: {
		sample_name: 'loads_search_page'
	},
});

return StartPageView;
});
