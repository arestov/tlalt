define(function(require) {
"use strict";
var pv = require('pv');
var spv = require('spv');

var BrowseMap = require('js/libs/BrowseMap');
var SearchPage = require('./SearchPage');

var pvUpdate = pv.update;

var StartPage = spv.inh(BrowseMap.Model, {
	init: function(self) {
		pvUpdate(self, 'needs_search_from', true);
  }
}, {
	rpc_legacy: {
		changeSearchHint: function() {
			pvUpdate(this, 'nice_artist_hint', this.app.popular_artists[(Math.random()*10).toFixed(0)]);
		}
	},
	model_name: 'start_page',
	zero_map_level: true,
	// sub_pager: {
	// 	by_type: {
	// 		query: [
  //
	// 		],
	// 	},
	// 	type: {
	// 		queries: 'query',
	// 	}
	// },
  sub_page: {
		'search': {
			constr: SearchPage,
			title: [[]],
		},
	}
});

return StartPage;
});
