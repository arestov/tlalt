define(function(require) {
"use strict";
var dateFns = require('js/common-libs/date_fns.1.9.0.min.js');

var filters = {
	limitTo: function(input, limit) {
		if (Array.isArray(input)){
			return input.slice(0, limit);
		} else if ( typeof input == 'string' ) {
			if (limit) {
				return limit >= 0 ? input.slice(0, limit) : input.slice(limit, input.length);
			} else {
				return "";
			}
		} else {
			return input;
		}
	},
  formatDate: function(date, format) {
		return dateFns.format(date, format);
  },
	notGIF: function(input) {
		if (input.lastIndexOf('.gif') == input.length - 4){
			return;
		} else {
			return input;
		}
	}
};

return filters;
});
