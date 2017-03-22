define(function (require) {
'use strict';
var spv = require('spv');
var View= require('View');

var SPView = spv.inh(View, {}, {
	'compx-lvmp_show': [
		['^vmp_show'],
		function(vmp_show) {
			return vmp_show;
		}
	],
	'compx-mp_show_end': {
		depends_on: ['^mp_show_end'],
		fn: function(mp_show_end) {
			return mp_show_end;
		}
	}
});
return SPView;
})
